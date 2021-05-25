package api

import (
	"context"

	"github.com/kintoproj/kintohub/core/pkg/types"
)

func (a *Api) GetBlocks(envId string) ([]*types.Block, error) {
	ctx := a.authorizeKintoCore(context.Background())
	envs, err := a.client.GetBlocks(ctx,
		&types.BlockQueryRequest{
			EnvId: envId,
		})
	if err != nil {
		return nil, err
	}
	return envs.Items, err
}
