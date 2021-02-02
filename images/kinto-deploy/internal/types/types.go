package types

import (
	"fmt"
	"github.com/kintoproj/kinto-core/pkg/consts"
	kintoCoretypes "github.com/kintoproj/kinto-core/pkg/types"
	"kintoproj/kinto-deploy/internal/config"
	"strconv"
)

const (
	LabelReleaseId = "release"
	LabelBlockName = "app"
	LabelEnvId     = "env"
)

type Release struct {
	// common fields
	Id           string            `json:"id"`
	BlockId      string            `json:"blockId"`
	BlockName    string            `json:"blockName"`
	EnvId        string            `json:"envId"`
	Image        string            `json:"image"`
	Cpu          string            `json:"cpu"`
	Memory       string            `json:"memory"`
	Labels       map[string]string `json:"labels"`
	EnvVars      map[string]string `json:"envVars"`
	TimeoutInSec int               `json:"timeout"`

	// helm chart
	ChartPath           string `json:"chartPath"`
	ChartValuesFileName string `json:"chartValues"`

	// non jobs
	Replicas int32                       `json:"replicas"`
	HPA      *kintoCoretypes.AutoScaling `json:"hpa"`

	// only for webservers
	Port  int32    `json:"port"`
	Hosts []string `json:"hosts"`

	// only for jobs
	JobSpec *kintoCoretypes.JobSpec `json:"jobSpec"`

	// only if sleep mode is enabled
	ProxlessConfig *ProxlessConfig `json:"proxlessConfig"`
}

type ProxlessConfig struct {
	DeploymentReadinessTimeoutSeconds string `json:"deploymentReadinessTimeoutSeconds"`
	ServerlessTTLSeconds              string `json:"serverlessTTLSeconds"`
}

func ConvertKintoCoreReleaseToKDRelease(
	blockName, blockId, envId string,
	customDomains []string,
	kintoCoreRelease *kintoCoretypes.Release) (*Release, error) {

	deployRelease := &Release{
		Id:        kintoCoreRelease.Id,
		BlockName: blockName,
		BlockId:   blockId,
		EnvId:     envId,
		Labels: map[string]string{
			LabelBlockName:       blockName,
			LabelEnvId:           envId,
			consts.OwnerLabelKey: consts.OwnerLabelValue,
		},
	}

	if kintoCoreRelease.RunConfig != nil {
		deployRelease.EnvVars = kintoCoreRelease.RunConfig.EnvVars
		deployRelease.TimeoutInSec = int(kintoCoreRelease.RunConfig.TimeoutInSec)

		if kintoCoreRelease.RunConfig.Type == kintoCoretypes.Block_CATALOG {
			deployRelease.ChartPath = kintoCoreRelease.BuildConfig.PathToCode
			deployRelease.ChartValuesFileName = "values.yaml" // TODO make it configurable for helm chart type
		} else {
			if kintoCoreRelease.RunConfig.Resources.CpuInCore != -1 {
				deployRelease.Cpu = fmt.Sprintf("%f", kintoCoreRelease.RunConfig.Resources.CpuInCore)
			}

			deployRelease.Memory = fmt.Sprintf("%dMi", kintoCoreRelease.RunConfig.Resources.MemoryInMB)

			deployRelease.Image = fmt.Sprintf("%s/%s", config.ImageRegistryHost, kintoCoreRelease.BuildConfig.Image)
		}

		if kintoCoreRelease.RunConfig.Type == kintoCoretypes.Block_BACKEND_API ||
			kintoCoreRelease.RunConfig.Type == kintoCoretypes.Block_WEB_APP {

			port, err := getPort(kintoCoreRelease.RunConfig.Port)
			if err != nil {
				return nil, err
			}
			deployRelease.Port = int32(port)

			deployRelease.Hosts = append(deployRelease.Hosts, kintoCoreRelease.RunConfig.Host)
			deployRelease.Hosts = append(deployRelease.Hosts, customDomains...)
		}

		if kintoCoreRelease.RunConfig.Type == kintoCoretypes.Block_BACKEND_API ||
			kintoCoreRelease.RunConfig.Type == kintoCoretypes.Block_WEB_APP ||
			kintoCoreRelease.RunConfig.Type == kintoCoretypes.Block_WORKER {

			deployRelease.Replicas = getReplicas(kintoCoreRelease.RunConfig.AutoScaling)

			deployRelease.HPA = kintoCoreRelease.RunConfig.AutoScaling
		}

		if kintoCoreRelease.RunConfig.Type == kintoCoretypes.Block_JOB ||
			kintoCoreRelease.RunConfig.Type == kintoCoretypes.Block_CRON_JOB {

			deployRelease.JobSpec = kintoCoreRelease.RunConfig.JobSpec
		}

		if kintoCoreRelease.RunConfig.Type == kintoCoretypes.Block_STATIC_SITE ||
			kintoCoreRelease.RunConfig.Type == kintoCoretypes.Block_JAMSTACK {

			deployRelease.Replicas = 2 // HA because running on preemptible nodes
			deployRelease.Cpu = ""     // no reserved cpu
			deployRelease.Memory = ""  // no reserved memory
			deployRelease.Port = 80    // nginx port

			// we append the kinto `host` (*.kinto.io) and all the `customDomains`
			deployRelease.Hosts = append(deployRelease.Hosts, kintoCoreRelease.RunConfig.Host)
			deployRelease.Hosts = append(deployRelease.Hosts, customDomains...)
		}

		if kintoCoreRelease.RunConfig.SleepModeEnabled {
			if kintoCoreRelease.RunConfig.Type == kintoCoretypes.Block_BACKEND_API || kintoCoreRelease.RunConfig.Type == kintoCoretypes.Block_WEB_APP {

				svlsTTLSeconds := kintoCoreRelease.RunConfig.SleepModeTTLSeconds
				if svlsTTLSeconds < 30 { // let's not allow less than 30sec since it would not make sense
					svlsTTLSeconds = 30
				}

				deployRelease.ProxlessConfig = &ProxlessConfig{
					DeploymentReadinessTimeoutSeconds: strconv.Itoa(int(kintoCoreRelease.RunConfig.TimeoutInSec)),
					ServerlessTTLSeconds:              strconv.Itoa(int(svlsTTLSeconds)),
				}
			}
		}
	}

	return deployRelease, nil
}

func getReplicas(autoscaling *kintoCoretypes.AutoScaling) int32 {
	if autoscaling == nil || autoscaling.Min < 1 {
		return 1
	}

	return autoscaling.Min
}

func getPort(port string) (int, error) {
	if port == "" {
		return -1, nil
	}

	return strconv.Atoi(port)
}

func EnrichLabels(labels map[string]string, releaseId string) map[string]string {
	enrichedLabels := map[string]string{}
	for k, v := range labels {
		enrichedLabels[k] = v
	}
	enrichedLabels[LabelReleaseId] = releaseId
	return enrichedLabels
}
