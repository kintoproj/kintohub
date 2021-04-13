package build

import (
	"context"
	utilsGoServer "github.com/kintohub/utils-go/server"

	"github.com/kintoproj/kinto-core/pkg/types"
)

type BuildInterface interface {
	BuildAndDeployRelease(
		buildConfig *types.BuildConfig, blockName, releaseId, envId string, isStaticBuild bool) (string, *utilsGoServer.Error)
	DeployRelease(blockName, releaseId, envId string) (string, *utilsGoServer.Error)
	DeployCatalogRelease(repo *types.Repository, blockName, releaseId, envId string) (string, *utilsGoServer.Error)
	UndeployRelease(blockName, envId string) (string, *utilsGoServer.Error)
	SuspendRelease(blockName, envId, releaseID string) (string, *utilsGoServer.Error)
	GetBuildLogs(release *types.Release) (*types.Logs, *utilsGoServer.Error)
	WatchBuildLogs(ctx context.Context, release *types.Release, logsChan chan *types.Logs) *utilsGoServer.Error
	AbortRelease(ctx context.Context, buildId, envId string) *utilsGoServer.Error
	GenReleaseConfigFromKintoFile(
		org, repo, branch, envId, githubUserToken string, blockType types.Block_Type) (*types.ReleaseConfig, *utilsGoServer.Error)
}
