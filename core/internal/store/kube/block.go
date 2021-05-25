package kube

import (
	"context"
	"fmt"
	"time"

	"github.com/kintoproj/go-utils/klog"
	utilsGoServer "github.com/kintoproj/go-utils/server"
	"github.com/kintoproj/kintohub/core/pkg/consts"
	pkgtypes "github.com/kintoproj/kintohub/core/pkg/types"
	"github.com/rs/zerolog/log"
	corev1 "k8s.io/api/core/v1"
	k8serrors "k8s.io/apimachinery/pkg/api/errors"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

func (k *KubeStore) UpsertBlock(block *pkgtypes.Block) *utilsGoServer.Error {
	defer klog.LogDuration(time.Now(), "UpsertBlock")
	cm, err := pkgtypes.BlockToConfigMap(block) // generating again the config map to make sure even the labels change

	if err != nil {
		return utilsGoServer.NewInternalErrorWithErr("error converting block to configmap", err)
	}

	_, err = k.kubeClient.CoreV1().ConfigMaps(block.EnvId).Get(
		context.TODO(), pkgtypes.GenBlockConfigMapName(block.Name), metav1.GetOptions{})

	if err == nil { // `error == nil` means a configmap has been found
		_, err = k.kubeClient.CoreV1().ConfigMaps(block.EnvId).Update(context.TODO(), cm, metav1.UpdateOptions{})

		if err != nil {
			return utilsGoServer.NewInternalErrorWithErr("error updating configmap", err)
		}
	} else {
		_, err = k.kubeClient.CoreV1().ConfigMaps(block.EnvId).Create(context.TODO(), cm, metav1.CreateOptions{})

		if err != nil {
			return utilsGoServer.NewInternalErrorWithErr("error creating configmap", err)
		}
	}

	return nil
}

func (k *KubeStore) GetBlock(name, envId string) (*pkgtypes.Block, *utilsGoServer.Error) {
	defer klog.LogDuration(time.Now(), "GetBlock")
	cm, err := k.kubeClient.CoreV1().ConfigMaps(envId).Get(
		context.TODO(), pkgtypes.GenBlockConfigMapName(name), metav1.GetOptions{})

	if err != nil {
		if k8serrors.IsNotFound(err) {
			return nil, utilsGoServer.NewErrorf(utilsGoServer.StatusCode_NotFound, "could not find block %s in env %s",
				name,
				envId)
		}

		return nil, utilsGoServer.NewInternalErrorWithErr("error getting config map", err)
	}

	block, err := pkgtypes.ConfigMapToBlock(cm)

	if err != nil {
		return nil, utilsGoServer.NewInternalErrorWithErr("error converting config map to block", err)
	}

	return block, nil
}

func (k *KubeStore) GetBlocks(envId string) ([]*pkgtypes.Block, *utilsGoServer.Error) {
	defer klog.LogDuration(time.Now(), "GetBlocks")
	cms, err := k.kubeClient.CoreV1().ConfigMaps(envId).List(
		context.TODO(),
		metav1.ListOptions{
			LabelSelector: fmt.Sprintf("%s=%s", consts.OwnerLabelKey, consts.OwnerLabelValue),
		})

	if err != nil {
		if k8serrors.IsNotFound(err) {
			return nil, utilsGoServer.NewErrorf(utilsGoServer.StatusCode_NotFound, "could not list blocks in env %s",
				envId)
		}

		return nil, utilsGoServer.NewInternalErrorWithErr("error listing blocks", err)
	}

	var blocks []*pkgtypes.Block
	for _, cm := range cms.Items {
		block, err := pkgtypes.ConfigMapToBlock(&cm)

		if err == nil {
			blocks = append(blocks, block)
		}

		// TODO add a label for filtering the configmap - only get the ones created by kintohub for blocks
		// Don't return the error - u can have others config map
	}

	return blocks, nil
}

func (k *KubeStore) DeleteBlock(name, envId string) *utilsGoServer.Error {
	defer klog.LogDuration(time.Now(), "DeleteBlock")
	err := k.kubeClient.CoreV1().ConfigMaps(envId).Delete(
		context.TODO(), pkgtypes.GenBlockConfigMapName(name), metav1.DeleteOptions{})

	if err != nil {
		if k8serrors.IsNotFound(err) {
			return utilsGoServer.NewErrorf(utilsGoServer.StatusCode_NotFound, "could find block %v in env %s to delete",
				name,
				envId)
		}

		return utilsGoServer.NewInternalErrorWithErr("error deleting block", err)
	}

	return nil
}

func getBlockHealthState(
	kubeClient kubernetes.Interface,
	blockName, envId string,
	latestSuccessfulRelease *pkgtypes.Release) (pkgtypes.BlockStatus_State, error) {

	blockType := latestSuccessfulRelease.RunConfig.Type
	releaseId := latestSuccessfulRelease.Id
	releaseType := latestSuccessfulRelease.Type

	var podsList *corev1.PodList
	var err error
	if blockType == pkgtypes.Block_CATALOG {
		podsList, err = kubeClient.CoreV1().Pods(envId).List(context.TODO(), metav1.ListOptions{
			LabelSelector: fmt.Sprintf("%s=%s", consts.AppLabelKey, blockName),
		})
	} else {
		podsList, err = kubeClient.CoreV1().Pods(envId).List(context.TODO(), metav1.ListOptions{
			LabelSelector: fmt.Sprintf("%s=%s,%s=%s", consts.AppLabelKey, blockName, consts.ReleaseLabelKey, releaseId),
		})
	}

	if err != nil {
		return pkgtypes.BlockStatus_NOT_SET, err
	}

	// no pod found, the service must have been suspended
	if podsList.Items == nil || len(podsList.Items) == 0 {
		if releaseType == pkgtypes.Release_SUSPEND {
			return pkgtypes.BlockStatus_SUSPENDED, nil
		} else if latestSuccessfulRelease.RunConfig.SleepModeEnabled {
			return pkgtypes.BlockStatus_SLEEPING, nil
		} else {
			log.Error().Err(err).Msg("No pod found but service is not suspended or sleeping")
			return pkgtypes.BlockStatus_UNHEALTHY, nil
		}
	}

	for _, pod := range podsList.Items {
		containerStatus, err := getMainContainerStatus(pod.Status.ContainerStatuses, blockName)

		if err != nil {
			log.Error().Err(err).Msg("Error extracting main container status from pod")
			continue
		}

		containerState := getContainerState(containerStatus)
		if containerState == pkgtypes.BlockInstance_ERROR ||
			containerState == pkgtypes.BlockInstance_OOM_KILLED ||
			containerState == pkgtypes.BlockInstance_NOT_SET {
			return pkgtypes.BlockStatus_UNHEALTHY, nil
		}

	}

	return pkgtypes.BlockStatus_HEALTHY, nil
}

func (k *KubeStore) KillBlockInstance(id, envId string) *utilsGoServer.Error {
	defer klog.LogDuration(time.Now(), "KillBlockInstance")
	err := k.kubeClient.CoreV1().Pods(envId).Delete(context.TODO(), id, metav1.DeleteOptions{})

	if k8serrors.IsNotFound(err) {
		return utilsGoServer.NewErrorf(utilsGoServer.StatusCode_NotFound, "could not find instance %s",
			id)
	} else if err != nil {
		return utilsGoServer.NewInternalErrorWithErr("error deleting pod", err)
	}

	return nil
}
