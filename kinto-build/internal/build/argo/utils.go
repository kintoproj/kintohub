package argo

import (
	"github.com/kintoproj/kinto-core/pkg/consts"
	v1 "k8s.io/api/core/v1"
)

func genLabels(blockName, release, envId string) map[string]string {
	return map[string]string{
		consts.AppLabelKey:     blockName,
		consts.ReleaseLabelKey: release,
		"envId":                envId,
	}
}

func getImagePullPolicy(imagePullPolicy string) v1.PullPolicy {
	switch imagePullPolicy {
	case "Never":
		return v1.PullNever
	case "IfNotPresent":
		return v1.PullIfNotPresent
	case "Always":
		return v1.PullAlways
	default:
		return v1.PullIfNotPresent
	}
}
