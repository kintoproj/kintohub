package kube

import (
	"errors"
	"fmt"
	"github.com/kintoproj/kinto-core/pkg/types"
	"github.com/rs/zerolog/log"
	corev1 "k8s.io/api/core/v1"
	"regexp"
)

var (
	regexpAliasEmail = regexp.MustCompile(`(.*)@(.*)`)
)

func genCustomDomainResourceName(blockName string) string {
	return fmt.Sprintf("custom-domain-%s", blockName)
}

func genAliasEmail(email, alias string) string {
	return regexpAliasEmail.ReplaceAllString(
		email,
		fmt.Sprintf(`$1+%s@$2`, alias),
	)
}

func getContainerState(containerStatus *corev1.ContainerStatus) types.BlockInstance_State {
	if containerStatus.State.Running != nil {
		return types.BlockInstance_RUNNING
	}

	// for jobs
	if containerStatus.State.Terminated != nil {
		switch containerStatus.State.Terminated.Reason {
		case "Completed":
			return types.BlockInstance_COMPLETED
		case "OOMKilled":
			return types.BlockInstance_OOM_KILLED
		case "Error":
			return types.BlockInstance_ERROR
		}
	}

	// for non jobs
	if containerStatus.LastTerminationState.Terminated != nil {
		switch containerStatus.LastTerminationState.Terminated.Reason {
		case "Completed":
			return types.BlockInstance_COMPLETED
		case "OOMKilled":
			return types.BlockInstance_OOM_KILLED
		case "Error":
			return types.BlockInstance_ERROR
		}
	}

	log.Warn().Msgf("getContainerState - container status NOT_SET for %v", containerStatus)

	return types.BlockInstance_NOT_SET
}

func getMainContainerStatus(statuses []corev1.ContainerStatus, blockName string) (*corev1.ContainerStatus, error) {
	if statuses != nil {
		for _, status := range statuses {
			if status.Name == blockName {
				return &status, nil
			}
		}
	}

	return nil, errors.New(fmt.Sprintf("could not find main containerstatus for block %s", blockName))
}
