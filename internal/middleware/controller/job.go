package controller

import (
	"context"
	utilsGoServer "github.com/kintohub/utils-go/server"
	"github.com/kintoproj/kinto-core/pkg/types"
)

func (c *ControllerMiddleware) WatchJobsStatus(
	ctx context.Context,
	blockName, envId string,
	sendClientLogs func(jobStatus *types.JobStatus) error) *utilsGoServer.Error {
	return c.store.WatchJobsStatus(blockName, envId, ctx, sendClientLogs)
}
