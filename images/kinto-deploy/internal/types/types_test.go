package types

import (
	"fmt"
	"github.com/google/uuid"
	"github.com/kintohub/kinto-kube-core/pkg/consts"
	kintoCore "github.com/kintohub/kinto-kube-core/pkg/types"
	"github.com/r3labs/diff"
	"github.com/stretchr/testify/assert"
	"kinto.io/kinto-kube-deploy/internal/config"
	"testing"
)

func TestConvertKintoCoreReleaseToKDRelease(t *testing.T) {
	config.ImageRegistryHost = "asia.gcr.io/ben-test-env"
	blockName := "dummyBlockName"
	blockId := "dummyBlockId"
	envId := "dummyEnvId"

	kintoCoreRelease := &kintoCore.Release{
		Id: uuid.New().String(),
		BuildConfig: &kintoCore.BuildConfig{
			Image: "kintohub/test:latest",
		},
		RunConfig: &kintoCore.RunConfig{
			Type: kintoCore.Block_BACKEND_API,
			Port: "8080",
			AutoScaling: &kintoCore.AutoScaling{
				Min:        1,
				Max:        3,
				CpuPercent: 80,
			},
			EnvVars: map[string]string{
				"KEY0": "VAL0",
			},
			Resources: &kintoCore.Resources{
				MemoryInMB: 500,
				CpuInCore:  1,
			},
			TimeoutInSec: 30,
			Host:         "example.io",
		},
	}

	wantRelease := &Release{
		Id:        kintoCoreRelease.Id,
		BlockName: blockName,
		BlockId:   blockId,
		EnvId:     envId,
		Image:     fmt.Sprintf("%s/%s", config.ImageRegistryHost, kintoCoreRelease.BuildConfig.Image),
		Cpu:       fmt.Sprintf("%f", kintoCoreRelease.RunConfig.Resources.CpuInCore),
		Memory:    fmt.Sprintf("%dMi", kintoCoreRelease.RunConfig.Resources.MemoryInMB),
		Labels: map[string]string{
			LabelBlockName:       blockName,
			LabelEnvId:           envId,
			consts.OwnerLabelKey: consts.OwnerLabelValue,
		},
		EnvVars:      kintoCoreRelease.RunConfig.EnvVars,
		TimeoutInSec: int(kintoCoreRelease.RunConfig.TimeoutInSec),
		Replicas:     kintoCoreRelease.RunConfig.AutoScaling.Min,
		HPA:          kintoCoreRelease.RunConfig.AutoScaling,
		Port:         8080,
		Hosts:        []string{kintoCoreRelease.RunConfig.Host},
	}

	gotRelease, err :=
		ConvertKintoCoreReleaseToKDRelease(blockName, blockId, envId, []string{}, kintoCoreRelease)

	assert.NoError(t, err)

	assert.Equal(t, wantRelease, gotRelease)
}

func Test_EnrichLabels(t *testing.T) {
	testCases := []struct {
		labels    map[string]string
		releaseId string
		want      map[string]string
	}{
		{
			labels:    map[string]string{},
			releaseId: "dummyReleaseId",
			want:      map[string]string{LabelReleaseId: "dummyReleaseId"},
		},
		{
			labels:    map[string]string{LabelBlockName: "dummyAppName"},
			releaseId: "dummyReleaseId",
			want:      map[string]string{LabelBlockName: "dummyAppName", LabelReleaseId: "dummyReleaseId"},
		},
	}

	for _, tc := range testCases {
		got := EnrichLabels(tc.labels, tc.releaseId)

		if diff.Changed(got, tc.want) {
			t.Errorf("EnrichLabels(%s, %s) = %s; want = %s", tc.labels, tc.releaseId, got, tc.want)
		}
	}
}
