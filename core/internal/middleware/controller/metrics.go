package controller

import (
	"context"

	utilsGoServer "github.com/kintoproj/go-utils/server"

	"github.com/kintoproj/kintohub/core/pkg/types"
)

func (c *ControllerMiddleware) GetBlocksMetrics(
	ctx context.Context, name, envId string) (*types.BlocksMetrics, *utilsGoServer.Error) {

	return c.store.GetBlocksMetrics(name, envId)
}
