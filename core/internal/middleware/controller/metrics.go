package controller

import (
	"context"
	utilsGoServer "github.com/kintohub/utils-go/server"

	"github.com/kintoproj/kinto-core/pkg/types"
)

func (c *ControllerMiddleware) GetBlocksMetrics(
	ctx context.Context, name, envId string) (*types.BlocksMetrics, *utilsGoServer.Error) {

	return c.store.GetBlocksMetrics(name, envId)
}
