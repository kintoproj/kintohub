package api

import (
	"context"
	"github.com/kintoproj/kinto-core/pkg/types"
)

func (a *Api) GetBlocks(envId string) ([]*types.Block, error) {
	envs, err := a.client.GetBlocks(context.Background(),
		&types.BlockQueryRequest{
			EnvId: envId,
		})
	if err != nil {
		return nil, err
	}
	return envs.Items, err
}
