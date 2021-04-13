package kube

import (
	"context"
	"fmt"
	"time"

	"github.com/kintohub/utils-go/klog"
	utilsGoServer "github.com/kintohub/utils-go/server"
	"github.com/kintoproj/kinto-core/pkg/consts"
	"github.com/kintoproj/kinto-core/pkg/types"
	"github.com/rs/zerolog/log"
	corev1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/api/errors"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/watch"
)

func (k *KubeStore) WatchBlockReleaseStatus(blockName, envId string, ctx context.Context,
	statusChan chan *types.ReleasesStatus) *utilsGoServer.Error {
	defer klog.LogDuration(time.Now(), "WatchBlockReleaseStatus")

	// watch will be closed in `processReleaseStatusWatchEvent`
	watcher, err := k.kubeClient.CoreV1().ConfigMaps(envId).Watch(
		context.TODO(),
		metav1.ListOptions{
			LabelSelector: fmt.Sprintf("%s=%s", consts.AppLabelKey, blockName),
			Watch:         true,
		})

	if err != nil {
		if errors.IsNotFound(err) {
			return utilsGoServer.NewErrorf(utilsGoServer.StatusCode_NotFound, "could not find environment %s",
				envId)
		}

		return utilsGoServer.NewInternalErrorWithErr("could not get configmap", err)
	}

	go processReleaseStatusWatcherEvents(blockName, envId, watcher, ctx, statusChan)

	return nil
}

func processReleaseStatusWatcherEvents(blockName, envId string, watcher watch.Interface, context context.Context,
	statusChan chan *types.ReleasesStatus) {

	defer close(statusChan)
	defer watcher.Stop()

	for {
		select {
		case event, ok := <-watcher.ResultChan():
			if !ok {
				log.Ctx(context).Debug().Msgf("watcher closed for block %s.%s", blockName, envId)
				return
			}

			if event.Type == watch.Deleted {
				log.Ctx(context).Debug().Msgf("configmap %s.%s has been deleted", blockName, envId)
				return
			}

			cm, ok := event.Object.(*corev1.ConfigMap)

			if !ok {
				log.Ctx(context).Error().Msgf("unexpected type %v", cm)
				return
			}

			releaseStatus, err := getReleaseStatus(cm)

			if err != nil {
				log.Ctx(context).Error().Err(err.Error).Msgf("could not get release status from %v", cm)
				return
			}

			statusChan <- releaseStatus
		case <-context.Done():
			if context.Err() != nil {
				log.Ctx(context).Debug().Msg("client no longer listening. - exiting...")
			}
			return
		}
	}
}

func getReleaseStatus(cm *corev1.ConfigMap) (*types.ReleasesStatus, *utilsGoServer.Error) {
	block, err := types.ConfigMapToBlock(cm)

	if err != nil {
		return nil, utilsGoServer.NewInternalErrorWithErr("error converting configmap to block",
			err)
	}

	releaseStatus := &types.ReleasesStatus{
		BlockName: block.Name,
		EnvId:     block.EnvId,
		Releases:  make(map[string]*types.Status),
	}
	for _, release := range block.Releases {
		releaseStatus.Releases[release.Id] = release.Status
	}

	return releaseStatus, nil
}
