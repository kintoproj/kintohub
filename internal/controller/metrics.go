package controller

import (
	utilsGoServer "github.com/kintohub/utils-go/server"

	"github.com/kintohub/kinto-core/pkg/types"
)

func (c *Controller) GetBlocksMetrics(name, envId string) (*types.BlocksMetrics, *utilsGoServer.Error) {
	return c.store.GetBlocksMetrics(name, envId)
}
