package controller

import (
	"context"
	utilsGoServer "github.com/kintohub/utils-go/server"
	"github.com/kintoproj/kinto-core/internal/config"
	"github.com/kintoproj/kinto-core/pkg/types"
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
