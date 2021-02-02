package api

import (
	"context"
	utilsGoServer "github.com/kintohub/utils-go/server"
	"github.com/kintoproj/kinto-core/pkg/types"
	grpccodes "google.golang.org/grpc/codes"
	grpcstatus "google.golang.org/grpc/status"
)

func (b *BuildAPI) GetBuildLogs(release *types.Release) (*types.Logs, *utilsGoServer.Error) {
	logs, err := b.buildClient.GetWorkflowLogs(context.Background(), &types.WorkflowLogsRequest{
		BuildId: release.BuildConfig.Id,
	})

	if err != nil {
		status, ok := grpcstatus.FromError(err)
		if ok && status.Code() == grpccodes.NotFound {
			return nil, utilsGoServer.NewErrorf(utilsGoServer.StatusCode_NotFound, "could not find build %s logs",
				release.BuildConfig.Id)
		}

		return nil, utilsGoServer.NewInternalErrorWithErr("error occurred when getting build logs", err)
	}

	return logs, nil
}

func (b *BuildAPI) WatchBuildLogs(ctx context.Context, release *types.Release, logsChan chan *types.Logs) *utilsGoServer.Error {
	defer close(logsChan)

	watcher, err := b.buildClient.WatchWorkflowLogs(ctx, &types.WorkflowLogsRequest{
		BuildId: release.BuildConfig.Id,
	})

	if err != nil {
		return utilsGoServer.NewInternalErrorWithErr("error occurred when trying to watch build logs", err)
	}

	for {
		logs, err := watcher.Recv()

		if err != nil {
			return utilsGoServer.NewInternalErrorWithErr("error occurred when receiving build logs", err)
		}

		logsChan <- logs
	}
}
