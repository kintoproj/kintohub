package controller

import (
	"context"
	utilsGoServer "github.com/kintohub/utils-go/server"

	"github.com/kintoproj/kinto-core/pkg/types"
)

func (c *ControllerMiddleware) WatchBuildLogs(
	ctx context.Context, releaseId, blockName, envId string, logsChan chan *types.Logs) *utilsGoServer.Error {

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

func (c *ControllerMiddleware) WatchConsoleLogs(
	ctx context.Context, blockName, envId string, logsChan chan *types.ConsoleLog) *utilsGoServer.Error {

	return c.store.WatchConsoleLogs(blockName, envId, ctx, logsChan)
}
