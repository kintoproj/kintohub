package kube

import (
	"context"
	"fmt"
	"strconv"
	"time"

	"github.com/kintohub/kinto-core/pkg/consts"
	"github.com/kintohub/utils-go/klog"
	utilsGoServer "github.com/kintohub/utils-go/server"

	"regexp"
	"sync"

	"github.com/kintohub/kinto-core/pkg/types"
	"github.com/rs/zerolog/log"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	metricsv1beta1 "k8s.io/metrics/pkg/apis/metrics/v1beta1"
)

func getMainContainerMetrics(containerMetricsList []metricsv1beta1.ContainerMetrics,
	blockName string) (*metricsv1beta1.ContainerMetrics, *utilsGoServer.Error) {
	if containerMetricsList != nil {
		for _, containerMetrics := range containerMetricsList {
			if containerMetrics.Name == blockName {
				return &containerMetrics, nil
			}
		}
	}

	return nil, utilsGoServer.NewErrorf(utilsGoServer.StatusCode_InternalServerError, "could not find main containermetrics for block %s",
		blockName)
}

func getMainContainer(containers []corev1.Container, blockName string) (*corev1.Container, *utilsGoServer.Error) {
	for _, container := range containers {
		if container.Name == blockName {
			return &container, nil
		}
	}

	return nil, utilsGoServer.NewErrorf(utilsGoServer.StatusCode_InternalServerError, "could not find main container for block %s",
		blockName)
}

func getVolumeMountPath(mounts []corev1.VolumeMount, name string) string {
	for _, mount := range mounts {
		if mount.Name == name {
			return mount.MountPath
		}
	}

	log.Warn().Msgf("found a volume with name %s that does not have a pod", name)

	return ""
}

// Collects resource requests, usage and storage information for all blocks in an environment or
// if provide optional blockName, the specific metrics of that block only.
func (k *KubeStore) GetBlocksMetrics(name, envId string) (*types.BlocksMetrics, *utilsGoServer.Error) {
	opts := metav1.ListOptions{}

	blocksMetrics := &types.BlocksMetrics{
		Blocks: map[string]*types.BlockMetrics{},
	}

	if name != "" {
		opts.LabelSelector = fmt.Sprintf("%s=%s",
			consts.AppLabelKey,
			name)
		blocksMetrics.Blocks[name] = &types.BlockMetrics{
			BlockName: name,
			EnvId:     envId,
			Instances: map[string]*types.BlockInstance{},
			Storages:  map[string]*types.BlockStorage{},
		}
	} else {
		blocks, err := k.GetBlocks(envId)

		if err != nil {
			return nil, err
		}

		for _, block := range blocks {
			blocksMetrics.Blocks[block.Name] = &types.BlockMetrics{
				BlockName: block.Name,
				EnvId:     envId,
				Instances: map[string]*types.BlockInstance{},
				Storages:  map[string]*types.BlockStorage{},
			}
		}
	}

	err := k.enrichContainerResources(envId, opts, blocksMetrics.Blocks)

	if err != nil {
		return nil, err
	}

	var wg sync.WaitGroup
	wg.Add(3)

	go func() {
		k.enrichContainerMetricsData(envId, opts, blocksMetrics.Blocks)
		wg.Done()
	}()

	go func() {
		k.enrichStorageCapacityData(envId, opts, blocksMetrics.Blocks)
		wg.Done()
	}()

	go func() {
		k.enrichStorageUsageData(envId, blocksMetrics.Blocks)
		wg.Done()
	}()

	wg.Wait()

	return blocksMetrics, nil
}

func (k *KubeStore) enrichContainerResources(
	envId string, opts metav1.ListOptions, blocksMetrics map[string]*types.BlockMetrics) *utilsGoServer.Error {

	defer klog.LogDuration(time.Now(), "createBlocksMetrics")

	pods, err := k.kubeClient.CoreV1().Pods(envId).List(context.TODO(), opts)

	if err != nil {
		return utilsGoServer.NewInternalErrorWithErr("error getting blocks metrics", err)
	}

	for _, pod := range pods.Items {
		blockName, ok := pod.Labels[consts.AppLabelKey]

		if !ok {
			return utilsGoServer.NewErrorf(
				utilsGoServer.StatusCode_InternalServerError, "could not find app name label for pod %v", pod)
		}

		blockMetrics, ok := blocksMetrics[blockName]

		if !ok {
			return utilsGoServer.NewErrorf(
				utilsGoServer.StatusCode_InternalServerError, "pod metrics %s not corresponding to a service", blockName)
		}

		container, uErr := getMainContainer(pod.Spec.Containers, blockName)

		if uErr != nil {
			return uErr
		}

		containerStatus, err := getMainContainerStatus(pod.Status.ContainerStatuses, blockName)

		if err != nil {
			return utilsGoServer.NewInternalErrorWithErr("error getting main container status", err)
		}

		blockMetrics.Instances[pod.Name] = &types.BlockInstance{
			Name:        pod.Name,
			ReleaseId:   pod.Labels[consts.ReleaseLabelKey],
			CpuRequests: container.Resources.Requests.Cpu().MilliValue(),
			MemRequests: container.Resources.Requests.Memory().MilliValue(),
			Restarts:    containerStatus.RestartCount,
			State:       getContainerState(containerStatus),
		}

		if len(pod.Spec.Volumes) > 0 {
			blockMetrics.Storages = map[string]*types.BlockStorage{}
		}

		for _, volume := range pod.Spec.Volumes {
			if volume.PersistentVolumeClaim != nil {
				blockMetrics.Storages[volume.PersistentVolumeClaim.ClaimName] = &types.BlockStorage{
					Name:      volume.PersistentVolumeClaim.ClaimName,
					MountPath: getVolumeMountPath(container.VolumeMounts, volume.Name),
				}
			}
		}
	}
	return nil
}

func (k *KubeStore) enrichContainerMetricsData(
	envId string, opts metav1.ListOptions, blocksMetrics map[string]*types.BlockMetrics) {

	defer klog.LogDuration(time.Now(), "enrichContainerMetricsData")

	metricsList, err := k.kubeMetricsClient.MetricsV1beta1().PodMetricses(envId).List(context.TODO(), opts)

	if err != nil {
		// TODO: Context enrich when refak channel -> handler
		klog.ErrorWithErr(err, "could not enrich pod metrics due to failure getting metrics data")
		return
	}

	// metrics client data does not have container labels - must do full search
	for _, blockMetrics := range blocksMetrics {
		for _, instance := range blockMetrics.Instances {
			for _, metrics := range metricsList.Items {
				if metrics.Name == instance.Name {
					containerMetrics, err := getMainContainerMetrics(metrics.Containers, blockMetrics.BlockName)

					if err != nil {
						klog.ErrorfWithErr(
							err.Error,
							"could not find main container metrics for env %s instance %s metrics %v",
							envId, instance.Name, metrics)
						return
					}

					instance.CpuUsage = containerMetrics.Usage.Cpu().MilliValue()
					instance.MemUsage = containerMetrics.Usage.Memory().MilliValue()
					break
				}
			}
		}
	}
}

func (k *KubeStore) enrichStorageCapacityData(
	envId string, opts metav1.ListOptions, blocksMetrics map[string]*types.BlockMetrics) {

	defer klog.LogDuration(time.Now(), "enrichStorageCapacityData")

	pvcs, err := k.kubeClient.CoreV1().PersistentVolumeClaims(envId).List(context.TODO(), opts)

	if err != nil {
		// TODO: Context enrich when refak channel -> handler
		klog.Errorf("could not enrich storage data in env id %v with err %v", envId, err)
		return
	}

	for _, pvc := range pvcs.Items {
		blockName, ok := pvc.Labels[consts.AppLabelKey]
		if !ok {
			// TODO: Context enrich when refak channel -> handler
			klog.Errorf("could not find blockname label in env %v for pvc %v!", envId, pvc.Name)
			return
		}

		blockMetrics, ok := blocksMetrics[blockName]

		if !ok {
			klog.Errorf("could not find blockmetrics in env %v for pvc %v.", envId, pvc.Name)
			continue
		}

		capacity := pvc.Status.Capacity[corev1.ResourceStorage]
		if storage, ok := blockMetrics.Storages[pvc.Name]; ok {
			storage.CapacityInBytes = capacity.Value()
		} else {
			blockMetrics.Storages[pvc.Name] = &types.BlockStorage{
				Name:            pvc.Name,
				CapacityInBytes: capacity.Value(),
			}
		}
	}
}

func (k *KubeStore) enrichStorageUsageData(envId string, blocksMetrics map[string]*types.BlockMetrics) {
	defer klog.LogDuration(time.Now(), "enrichStorageUsageData")
	for _, block := range blocksMetrics {

		if len(block.Instances) == 0 {
			break
		}

		// Get first instance
		var instanceName string
		for key := range block.Instances {
			instanceName = key
			break
		}

		for _, storage := range block.Storages {

			// https://unix.stackexchange.com/questions/179274/what-does-1k-blocks-column-mean-in-the-output-of-df
			// Guarantee the output is always with 1K block size
			stdout, _, err := k.ExecCommandInContainerWithFullOutput(
				envId, instanceName, block.BlockName, "df", "--block-size=1K")

			if err != nil {
				klog.ErrorfWithErr(err, "error getting pvc usage")
			}

			regex, err := regexp.Compile(fmt.Sprintf(".*%s.*\n", storage.MountPath))

			if err != nil {
				klog.ErrorfWithErr(err, "could not compile regex for storage lookup")
				return
			}

			linesWithMountPath := regex.FindAllString(stdout, 1)

			if len(linesWithMountPath) != 1 {
				klog.Errorf(
					"could not find any mounts on instance %s with mount path %s",
					storage.InstanceId, storage.MountPath)
				return
			}

			// The result should be in the format of (split with spaces not tab)
			// ===================================================================================================
			// Filesystem    1024-blocks      Used Available Capacity iused               ifree %iused  Mounted on
			// /dev/disk1s1    488245288 204698596 263749948    44% 4523492 9223372036850252315    0%   /

			re := regexp.MustCompile(`\s+`)
			tokens := re.Split(linesWithMountPath[0], -1)

			if len(tokens) < 5 {
				klog.Errorf(
					"the output format of df for instance %s is not as expected. Output: %s",
					storage.InstanceId, linesWithMountPath[0])
				return
			}

			storage.UsagePercent = tokens[4]

			mountedCapacity, cErr := strconv.Atoi(tokens[1])
			mountedUsage, uErr := strconv.Atoi(tokens[2])
			if cErr != nil || uErr != nil {

				klog.Errorf(
					"Cannot parse the storage usage for instance %s. usage: %s, capacity: %s",
					storage.InstanceId, tokens[2], tokens[1])
				return
			}
			// make it from 1K-blocks to bytes (= *1024 )
			storage.MountedCapacityInBytes = int64(mountedCapacity << 10)
			storage.MountedUsageInBytes = int64(mountedUsage << 10)
		}
	}
}
