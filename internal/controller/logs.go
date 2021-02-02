package controller

import (
	"context"
	utilsGoServer "github.com/kintohub/utils-go/server"

	"github.com/kintohub/kinto-core/pkg/types"
)

func (c *Controller) WatchBuildLogs(releaseId, blockName, envId string, ctx context.Context,
	logsChan chan *types.Logs) *utilsGoServer.Error {
	block, err := c.store.GetBlock(blockName, envId)

	if err != nil {
		return err
	}

	release, ok := block.Releases[releaseId]

	if !ok {
		return utilsGoServer.NewErrorf(utilsGoServer.StatusCode_NotFound, "release %s not found", releaseId)
	}

	if release.Status.State == types.Status_FAIL || release.Status.State == types.Status_SUCCESS {
		logs, err := c.build.GetBuildLogs(release)

		if err != nil {
			return err
		}

		logsChan <- logs
		close(logsChan)
	} else {
		go c.build.WatchBuildLogs(ctx, release, logsChan)
	}

	return nil
}

func (c *Controller) WatchConsoleLogs(blockName, envId string, context context.Context,
	logsChan chan *types.ConsoleLog) *utilsGoServer.Error {
	return c.store.WatchConsoleLogs(blockName, envId, context, logsChan)
}
