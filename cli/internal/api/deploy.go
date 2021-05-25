package api

import (
	"context"

	"github.com/kintoproj/kintohub/cli/internal/utils"
	"github.com/kintoproj/kintohub/core/pkg/types"
)

func (a *Api) TriggerDeploy(envId string, blockName string) (*types.BlockUpdateResponse, error) {
	ctx := a.authorizeKintoCore(context.Background())
	resp, err := a.client.TriggerDeploy(ctx,
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
