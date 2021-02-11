package api

import (
	"context"
	"github.com/kintoproj/kinto-cli/internal/utils"
	"github.com/kintoproj/kinto-core/pkg/types"
)

func (a *Api) TriggerDeploy(envId string, blockName string) (*types.BlockUpdateResponse, error) {
	resp, err := a.client.TriggerDeploy(context.Background(),
		&types.TriggerDeployRequest{
			Name:  blockName,
			EnvId: envId,
		})
	if err != nil {
		utils.TerminateWithError(err)
		return nil, err
	}
	return resp, err
}
