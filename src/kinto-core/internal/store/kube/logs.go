package kube

import (
	"bufio"
	"context"
	"fmt"
	utilsGoServer "github.com/kintohub/utils-go/server"
	"github.com/kintoproj/kinto-core/internal/config"
	"github.com/kintoproj/kinto-core/pkg/consts"

	"github.com/kintoproj/kinto-core/pkg/types"
	"github.com/rs/zerolog/log"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/watch"
	"k8s.io/client-go/kubernetes"
)

type consoleLogTask struct {
	context    context.Context
	kubeClient kubernetes.Interface
	logsChan   chan *types.ConsoleLog
}

func (c *consoleLogTask) watchPodLogsTask(podName, blockName, envId string) {
	readStream, err := c.kubeClient.CoreV1().Pods(envId).GetLogs(podName, &corev1.PodLogOptions{
		Container:    blockName,
		Follow:       true,
		SinceSeconds: &config.ConsoleLogsHistorySeconds,
		Timestamps:   true,
		TailLines:    &config.ConsoleLogsMaxLinesOnStart,
	}).Stream(context.TODO())

	if err != nil {
		log.Ctx(c.context).Error().Err(err).Msgf("error creating logs watcher for pod %s", podName)
		return
	}

	// TODO this trigger a warning cuz unhandled error
	defer readStream.Close()

	log.Ctx(c.context).Debug().Msgf("starting task to watch %s pod for logs",
		podName)

	reader := bufio.NewReader(readStream)

	for {
		if c.context.Err() != nil {
			log.Ctx(c.context).Debug().Msgf("client no longer listening to pod %v logs. exiting...",
				envId)
			return
		}

		data, _, err := reader.ReadLine()

		if err != nil {
			log.Ctx(c.context).Debug().Err(err).Msgf("log stream closed for block %s in env %s",
				podName,
				envId)
			return
		}

		c.logsChan <- &types.ConsoleLog{
			InstanceName: podName,
			Data:         data,
		}
	}
}

func (c *consoleLogTask) startWatchPodsTask(envId, blockName string, watcher watch.Interface) {
	for {
		if c.context.Err() != nil {
			log.Ctx(c.context).Debug().Msgf("client no longer listening to pod logs. exiting podsTask...")
			return
		}

		ch := watcher.ResultChan()

		for event := range ch {
			pod, ok := event.Object.(*corev1.Pod)

			if !ok {
				log.Ctx(c.context).Error().Msgf("unexpected type upon receiving pod event %v", pod)
				return
			}

			if event.Type == watch.Added {
				go c.watchPodLogsTask(pod.Name, blockName, envId)
			}
		}
	}
}

// Listens to console logs to ALL instances of a specific block name in an environment
// Even if there are no blocks, new blocks or removed blocks - it will continue to observe and aggregate logs from each
// pod related to the blockName. This allows the client to listen pre-post deployment and wait for desired messages
func (k *KubeStore) WatchConsoleLogs(blockName, envId string, ctx context.Context,
	logsChan chan *types.ConsoleLog) *utilsGoServer.Error {

	consoleLogTask := consoleLogTask{
		context:    ctx,
		kubeClient: k.kubeClient,
		logsChan:   logsChan,
	}

	watcher, err := k.kubeClient.CoreV1().Pods(envId).Watch(
		context.TODO(),
		metav1.ListOptions{
			LabelSelector: fmt.Sprintf("%s=%s", consts.AppLabelKey, blockName),
			Watch:         true,
		})

	if err != nil {
		return utilsGoServer.NewInternalErrorWithErr("error watching pods", err)
	}

	go consoleLogTask.startWatchPodsTask(envId, blockName, watcher)

	return nil
}
