package controller

import (
	"context"
	"github.com/kintohub/kinto-core/pkg/types"
	utilsGoServer "github.com/kintohub/utils-go/server"
)

func (c *Controller) WatchJobsStatus(
	blockName, envId string,
	ctx context.Context,
	sendClientLogs func(jobStatus *types.JobStatus) error) *utilsGoServer.Error {
	return c.store.WatchJobsStatus(blockName, envId, ctx, sendClientLogs)
}
