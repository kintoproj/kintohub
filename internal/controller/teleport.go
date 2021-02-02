package controller

import (
	"context"
	"github.com/kintohub/kinto-core/internal/config"
	"github.com/kintohub/kinto-core/pkg/types"
	utilsGoServer "github.com/kintohub/utils-go/server"
)

func (c *Controller) StartTeleport(
	ctx context.Context, envId, blockNameToTeleport string) (*types.TeleportServiceData, *utilsGoServer.Error) {

	if !config.KintoDevProxyEnabled {
		return nil, utilsGoServer.NewError(
			utilsGoServer.StatusCode_BadRequest, "the teleport feature is disabled")
	}

	return c.store.StartChiselService(ctx, envId, blockNameToTeleport)
}

func (c *Controller) StopTeleport(envId, blockNameTeleported string) *utilsGoServer.Error {
	return c.store.StopChiselService(envId, blockNameTeleported)
}
