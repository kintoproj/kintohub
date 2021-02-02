package store

import (
	"context"
	utilsGoServer "github.com/kintohub/utils-go/server"

	"github.com/kintohub/kinto-core/pkg/types"
)

type StoreInterface interface {
	GetEnvironment(id string) (*types.Environment, *utilsGoServer.Error)
	GetEnvironments() (*types.Environments, *utilsGoServer.Error)
	CreateEnvironment(env *types.Environment) *utilsGoServer.Error
	UpdateEnvironment(env *types.Environment) *utilsGoServer.Error
	DeleteEnvironment(id string) *utilsGoServer.Error

	UpsertBlock(block *types.Block) *utilsGoServer.Error
	GetBlock(name, envId string) (*types.Block, *utilsGoServer.Error)
	GetBlocks(envId string) ([]*types.Block, *utilsGoServer.Error)
	DeleteBlock(name, envId string) *utilsGoServer.Error
	GetBlockHeathState(blockName, envId string, latestSuccessfulRelease *types.Release) (types.BlockStatus_State, error)
	WatchJobsStatus(
		blockName, envId string, ctx context.Context, sendClientLogs func(jobStatus *types.JobStatus) error) *utilsGoServer.Error
	GetBlocksMetrics(name, envId string) (*types.BlocksMetrics, *utilsGoServer.Error)
	KillBlockInstance(id, envId string) *utilsGoServer.Error

	WatchConsoleLogs(blockName, envId string, context context.Context, logsChan chan *types.ConsoleLog) *utilsGoServer.Error

	WatchBlockReleaseStatus(blockName, envId string, context context.Context,
		statusChan chan *types.ReleasesStatus) *utilsGoServer.Error

	EnablePublicURL(envId, blockName string, protocol types.RunConfig_Protocol, hosts ...string) *utilsGoServer.Error
	DisablePublicURL(envId, blockName string) *utilsGoServer.Error

	UpsertCustomDomainNames(
		envId, blockName string,
		protocol types.RunConfig_Protocol,
		kintoHost string, domainNames ...string) *utilsGoServer.Error
	DeleteCustomDomainNames(envId, blockName, kintoHost string) *utilsGoServer.Error
	DoesCustomDomainExistInStore(host string) (bool, *utilsGoServer.Error)
	CheckCertificateReadiness(blockName, envId string) (bool, *utilsGoServer.Error)

	StartChiselService(ctx context.Context, envId, blockNameToTeleport string) (*types.TeleportServiceData, *utilsGoServer.Error)
	StopChiselService(envId, blockNameTeleported string) *utilsGoServer.Error
}
