package kube

import (
	"bufio"
	"context"
	"errors"
	"fmt"
	"github.com/rs/zerolog/log"
	"github.com/ttacon/chalk"
	"io"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"kintoproj/kinto-deploy/internal/types"
	"kintoproj/kinto-deploy/internal/utils"
	"strings"
)

func watchPodsLogsAndStatus(kubeClient kubernetes.Interface, release *types.Release) error {
	labels := types.EnrichLabels(release.Labels, release.Id)

	log.Debug().Msgf("Start watching pods with labels %s", labels)

	watcher, err := kubeClient.CoreV1().Pods(release.EnvId).Watch(
		context.TODO(),
		metav1.ListOptions{
			LabelSelector: labelsToLabelSelector(labels),
			Watch:         true,
		},
	)

	if err != nil {
		log.Error().Err(err).Msgf(
			"error listing pods with labels %s in namespace %s", labels, release.EnvId)
		return err
	}

	defer watcher.Stop()

	for event := range watcher.ResultChan() {
		pod, ok := event.Object.(*corev1.Pod)

		if !ok {
			log.Error().Msgf("unexpected type upon receiving pod event %v", pod)
			continue
		}

		if pod.Status.Phase == corev1.PodRunning {
			isReady, err := evaluatePodStatusReadiness(pod.Status, release)

			if err != nil {
				return err
			}

			if isReady {
				return nil
			}

			go watchPodLogs(kubeClient, pod.Namespace, pod.Name)
		}
	}

	return nil
}

func watchPodLogs(kubeClient kubernetes.Interface, namespace, podName string) {
	fmt.Println("start watching logs for service instance", podName)

	readStream, err := kubeClient.CoreV1().Pods(namespace).GetLogs(podName, &corev1.PodLogOptions{
		Follow: true,
	}).Stream(context.TODO())

	if err != nil {
		log.Error().Err(err).Msgf("error creating logs watcher for pod %s", podName)
		return
	}

	defer closeReadStream(readStream)

	reader := bufio.NewReader(readStream)

	for {
		data, _, err := reader.ReadLine()

		if err != nil {
			log.Warn().Err(err).Msgf("log stream closed for pod %s - probably pod restarting", podName)
			return
		}

		fmt.Println(chalk.Green.Color(fmt.Sprintf("%s - %s", podName, data)))
	}
}

func closeReadStream(readStream io.ReadCloser) {
	if err := readStream.Close(); err != nil {
		log.Error().Err(err).Msg("Could not close logs read stream")
	}
}

func evaluatePodStatusReadiness(podStatus corev1.PodStatus, release *types.Release) (bool, error) {
	if isPodReady(podStatus.Conditions) {
		return true, nil
	}

	containerStatuses := podStatus.ContainerStatuses
	for _, containerStatus := range containerStatuses {
		if containerStatus.Name == release.BlockName { // right now each pod has only one container
			containerStateTerminated := containerStatus.LastTerminationState.Terminated

			err := getPodError(containerStateTerminated, release)

			if err != nil {
				return false, err
			}

			break
		}
	}

	return false, nil
}

func isPodReady(conditions []corev1.PodCondition) bool {
	for _, cond := range conditions {
		if cond.Type == corev1.PodReady && cond.Status == corev1.ConditionTrue {
			return true
		}
	}

	return false
}

func getPodError(containerStateTerminated *corev1.ContainerStateTerminated, release *types.Release) error {
	if containerStateTerminated != nil {

		errorReasonFound := false

		errorMessage := utils.RedSprintLn(
			"ERROR DURING THE DEPLOYMENT OF YOUR SERVICE %s",
			strings.ToUpper(release.BlockName))
		errorMessage += "\n"

		const OOMKilled = "OOMKilled"

		if containerStateTerminated.Reason == OOMKilled {
			errorReasonFound = true

			errorMessage += utils.RedSprintLn("==> OOM (Out of Memory) issue detected")
			errorMessage += utils.RedSprintLn(
				"==> Your service %s is currently configured to use %s of memory but requires more",
				release.BlockName, release.Memory)
			errorMessage += "\n"
			errorMessage += "kinto::oomfixme::\n"
			return errors.New(errorMessage)
		}

		if containerStateTerminated.ExitCode != 1 {
			errorReasonFound = true

			errorMessage +=
				utils.RedSprintLn(
					"==> Your service has restarted with exit code %d",
					containerStateTerminated.ExitCode)

			if release.Port != -1 {
				errorMessage +=
					utils.RedSprintLn(
						"==> Please make sure your service %s is listening on port %d",
						release.BlockName, release.Port)
				errorMessage += "\n"
				errorMessage += "kinto::portfixme::\n"
			} else {
				errorMessage += utils.RedSprintLn("==> Please make sure your service does not terminate")
			}
			errorMessage += utils.RedSprintLn(
				"==> Note: you might also want to increase the deploy timeout if your service takes more than %d seconds to start",
				release.TimeoutInSec)
		}

		if containerStateTerminated.Reason != "" && containerStateTerminated.Reason != "Completed" {
			errorMessage += utils.RedSprintLn(
				"==> Reason: %s",
				containerStateTerminated.Reason)
		}

		if containerStateTerminated.Message != "" {
			errorMessage += utils.RedSprintLn(
				"==> Message: %s",
				containerStateTerminated.Message)
		}

		if !errorReasonFound {
			errorMessage += "\n"
			errorMessage += "kinto::checklogs::\n"
		}

		errorMessage += "\n" // keep it here for better printing

		return errors.New(errorMessage)
	}

	return nil
}
