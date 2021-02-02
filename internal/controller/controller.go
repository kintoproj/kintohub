package controller

import (
	"context"
	"github.com/kintohub/kinto-core/internal/build"
	"github.com/kintohub/kinto-core/internal/store"
	utilsGoServer "github.com/kintohub/utils-go/server"

	"github.com/kintohub/kinto-core/pkg/types"
)

type ControllerInterface interface {
	GetEnvironment(id string) (*types.Environment, *utilsGoServer.Error)
	GetEnvironments() (*types.Environments, *utilsGoServer.Error)
	CreateEnvironment(name string) (*types.Environment, *utilsGoServer.Error)
	UpdateEnvironment(id string, name string) (*types.Environment, *utilsGoServer.Error)
	DeleteEnvironment(id string) *utilsGoServer.Error

	CreateBlock(
		envId, name string,
		buildConfig *types.BuildConfig,
		runConfig *types.RunConfig) (string, string, *utilsGoServer.Error)
	GetBlock(name, envId string) (*types.Block, *utilsGoServer.Error)
	GetBlocks(envId string) (*types.Blocks, *utilsGoServer.Error)
	DeployBlockUpdate(
		name, envId, baseReleaseId string,
		buildConfig *types.BuildConfig,
		runConfig *types.RunConfig) (string, string, *utilsGoServer.Error)
	TriggerDeploy(
		name, envId string) (string, string, *utilsGoServer.Error)
	RollbackBlock(name, envId, releaseId string) (string, string, *utilsGoServer.Error)
	DeleteBlock(name, envId string) *utilsGoServer.Error
	WatchReleasesStatus(blockName, envId string, ctx context.Context, statusChan chan *types.ReleasesStatus) *utilsGoServer.Error
	GetBlocksHealthStatus(envId string) (*types.BlockStatuses, *utilsGoServer.Error)
	WatchJobsStatus(
		blockName, envId string, ctx context.Context, sendClientLogs func(jobStatus *types.JobStatus) error) *utilsGoServer.Error
	GetBlocksMetrics(name, envId string) (*types.BlocksMetrics, *utilsGoServer.Error)
	KillBlockInstance(id, envId string) *utilsGoServer.Error
	// Scale down all the resources of a block down to 0
	// return blockName, releaseId, error if any
	SuspendBlock(blockName, envId string) (string, string, *utilsGoServer.Error)

	WatchBuildLogs(releaseId, blockName, envId string, ctx context.Context, logsChan chan *types.Logs) *utilsGoServer.Error
	UpdateBuildStatus(releaseId, blockName, envId string, buildState types.BuildStatus_State) (*types.Release, *utilsGoServer.Error)
	UpdateBuildCommitSha(releaseId, blockName, envId, commitSha string) *utilsGoServer.Error

	WatchConsoleLogs(blockName, envId string, ctx context.Context, logsChan chan *types.ConsoleLog) *utilsGoServer.Error

	GetKintoConfiguration() (*types.KintoConfiguration, error)

	AbortRelease(ctx context.Context, blockName, releaseId, envId string) *utilsGoServer.Error

	EnableExternalURL(name, envId, releaseId string) *utilsGoServer.Error
	DisableExternalURL(name, envId string) *utilsGoServer.Error

	CreateCustomDomainName(blockName, envId, domainName string, protocol types.RunConfig_Protocol) *utilsGoServer.Error
	DeleteCustomDomainName(blockName, envId, domainName string, protocol types.RunConfig_Protocol) *utilsGoServer.Error
	CheckCertificateReadiness(blockName, envId string) bool

	StartTeleport(
		ctx context.Context, envId, blockNameToTeleport string) (*types.TeleportServiceData, *utilsGoServer.Error)
	StopTeleport(envId, blockNameTeleported string) *utilsGoServer.Error

	TagRelease(tag, blockName, envId, releaseId string) *utilsGoServer.Error
	PromoteRelease(tag, releaseId, blockName, envId, targetEnvId string) *utilsGoServer.Error

	GenReleaseConfigFromKintoFile(
		org, repo, branch, envId, githubUserToken string, blockType types.Block_Type) (*types.ReleaseConfig, *utilsGoServer.Error)
}

type Controller struct {
	store store.StoreInterface
	build build.BuildInterface
}

func NewController(
	kubeStore store.StoreInterface, buildClient build.BuildInterface) ControllerInterface {

	return &Controller{
		store: kubeStore,
		build: buildClient,
	}
}

func (Controller) GetKintoConfiguration() (*types.KintoConfiguration, error) {
	return &types.KintoConfiguration{
		Languages:          types.LanguagesOptions,
		MemoryOptions:      types.MemoryOpts,
		CpuOptions:         types.CPUOpts,
		TimeoutOptions:     types.TimeoutOpts,
		JobTimeoutOptions:  types.JobTimeoutOpts,
		AutoScalingOptions: types.AutoScalingOpts,
	}, nil
}
