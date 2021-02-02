package kube

import (
	"context"
	"fmt"
	"github.com/kintohub/kinto-core/pkg/consts"
	pkgtypes "github.com/kintohub/kinto-core/pkg/types"
	"github.com/rs/zerolog/log"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/watch"
	"k8s.io/client-go/kubernetes"
)

func watchJobsStatus(
	kubeClient kubernetes.Interface,
	blockName, envId string,
	ctx context.Context,
	sendClientLogs func(jobStatus *pkgtypes.JobStatus) error) error {

	watcher, err := kubeClient.CoreV1().Pods(envId).Watch(
		context.TODO(),
		metav1.ListOptions{
			Watch:         true,
			LabelSelector: fmt.Sprintf("%s=%s", consts.AppLabelKey, blockName),
		})

	if err != nil {
		return err
	}

	defer watcher.Stop()

	for {
		select {
		case event := <-watcher.ResultChan():
			pod, ok := event.Object.(*corev1.Pod)

			if !ok {
				log.Error().Err(err).Msgf("unexpected type upon receiving pod event %v", pod)
				break
			}

			var err error
			if event.Type == watch.Deleted {
				err = sendClientLogs(&pkgtypes.JobStatus{
					InstanceName: pod.Name,
					State:        pkgtypes.JobStatus_DELETED,
				})
			} else {
				if pod.Status.StartTime == nil { // the pod did not start yet
					err = sendClientLogs(&pkgtypes.JobStatus{
						InstanceName: pod.Name,
						State:        pkgtypes.JobStatus_PENDING,
					})
				} else {
					err = sendClientLogs(&pkgtypes.JobStatus{
						InstanceName:   pod.Name,
						State:          getJobStatusFromContainer(blockName, pod.Status.ContainerStatuses),
						StartTimestamp: pod.Status.StartTime.UnixNano(),
						EndTimestamp:   getJobEndTimeFromContainer(blockName, pod.Status.ContainerStatuses),
					})
				}
			}

			if err != nil {
				log.Error().Err(err).Msg("Error sending job status to client")
			}
		case <-ctx.Done():
			log.Ctx(ctx).Debug().Msg("client no longer listening to watch job status. exiting...")
			return nil
		}
	}
}

func getJobStatusFromContainer(blockName string, containerStatuses []corev1.ContainerStatus) pkgtypes.JobStatus_State {

	for _, containerStatus := range containerStatuses {
		if containerStatus.Name == blockName {
			if containerStatus.State.Running != nil {
				return pkgtypes.JobStatus_RUNNING
			}

			if containerStatus.State.Terminated != nil {
				switch containerStatus.State.Terminated.Reason {
				case "Completed":
					return pkgtypes.JobStatus_COMPLETED
				case "OOMKilled":
					return pkgtypes.JobStatus_OOM_KILLED
				case "Error":
					return pkgtypes.JobStatus_ERROR
				}
			}
		}
	}

	return pkgtypes.JobStatus_PENDING
}

func getJobEndTimeFromContainer(
	blockName string, containerStatuses []corev1.ContainerStatus) int64 {

	for _, containerStatus := range containerStatuses {
		if containerStatus.Name == blockName {
			if containerStatus.State.Terminated != nil {
				return containerStatus.State.Terminated.FinishedAt.UnixNano()
			}
		}
	}

	return -1
}
