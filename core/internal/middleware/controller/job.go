package controller

import (
	"context"

	utilsGoServer "github.com/kintoproj/go-utils/server"
	"github.com/kintoproj/kintohub/core/pkg/types"
)

func (c *ControllerMiddleware) WatchJobsStatus(
	ctx context.Context,
	blockName, envId string,
	sendClientLogs func(jobStatus *types.JobStatus) error) *utilsGoServer.Error {
	return c.store.WatchJobsStatus(blockName, envId, ctx, sendClientLogs)
}
