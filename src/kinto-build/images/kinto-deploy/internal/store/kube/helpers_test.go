package kube

import (
	kintoCoretypes "github.com/kintoproj/kinto-core/pkg/types"
	"kintoproj/kinto-deploy/internal/types"
)

func genDummyRelease() *types.Release {
	return &types.Release{
		Id:        "dummyId",
		BlockId:   "dummyBlockId",
		BlockName: "dummyBlockName",
		EnvId:     "dummyEnvId",
		Image:     "dummyImage",
		Cpu:       "1.5",
		Memory:    "100Mi",
		Labels: map[string]string{
			types.LabelBlockName: "dummyBlockName",
			types.LabelEnvId:     "dummyEnvId",
		},
		EnvVars: map[string]string{
			"dummyKey0": "dummyVal0",
		},
		TimeoutInSec: 1,
		Replicas:     1,
		Port:         8080,
		Hosts:        []string{"dummyHost"},
		JobSpec: &kintoCoretypes.JobSpec{
			CronPattern:  "* * * * *",
			TimeoutInSec: 300,
		},
		HPA: &kintoCoretypes.AutoScaling{
			Min:        1,
			Max:        8,
			CpuPercent: 85,
		},
	}
}
