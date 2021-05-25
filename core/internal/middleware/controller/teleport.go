package controller

import (
	"context"

	utilsGoServer "github.com/kintoproj/go-utils/server"
	"github.com/kintoproj/kintohub/core/internal/config"
	"github.com/kintoproj/kintohub/core/pkg/types"
)

func (c *ControllerMiddleware) StartTeleport(
	ctx context.Context, envId, blockNameToTeleport string) (*types.TeleportServiceData, *utilsGoServer.Error) {

	if !config.KintoDevProxyEnabled {
		return nil, utilsGoServer.NewError(
			utilsGoServer.StatusCode_BadRequest, "the teleport feature is disabled")
	}

	return c.store.StartChiselService(ctx, envId, blockNameToTeleport)
}

func (c *ControllerMiddleware) StopTeleport(ctx context.Context, envId, blockNameTeleported string) *utilsGoServer.Error {
	return c.store.StopChiselService(envId, blockNameTeleported)
}
