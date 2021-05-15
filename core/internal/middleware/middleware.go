package middleware

import (
	"context"
	utilsGoServer "github.com/kintohub/utils-go/server"
	"github.com/kintoproj/kinto-core/pkg/types"
)

// This is a wrapper that allows adapter implementations of Middleware be able to be passed in as middleware reference
// Composition in go does not allow composition to be = to the base type you are composing. This interface bridges that gap.
type Interface interface {
	GetEnvironment(ctx context.Context, id string) (*types.Environment, *utilsGoServer.Error)
	GetEnvironments(ctx context.Context) (*types.Environments, *utilsGoServer.Error)
	CreateEnvironment(ctx context.Context, name string) (*types.Environment, *utilsGoServer.Error)
	UpdateEnvironment(ctx context.Context, id string, name string) (*types.Environment, *utilsGoServer.Error)
	DeleteEnvironment(ctx context.Context, id string) *utilsGoServer.Error

	CreateBlock(
		ctx context.Context,
		envId, name string,
		buildConfig *types.BuildConfig,
		runConfig *types.RunConfig) (string, string, *utilsGoServer.Error)
	GetBlock(ctx context.Context, name, envId string) (*types.Block, *utilsGoServer.Error)
	GetBlocks(ctx context.Context, envId string) (*types.Blocks, *utilsGoServer.Error)
	DeployBlockUpdate(
		ctx context.Context,
		name, envId, baseReleaseId string,
		buildConfig *types.BuildConfig,
		runConfig *types.RunConfig) (string, string, *utilsGoServer.Error)
	TriggerDeploy(ctx context.Context, name, envId string) (string, string, *utilsGoServer.Error)
	RollbackBlock(ctx context.Context, name, envId, releaseId string) (string, string, *utilsGoServer.Error)
	DeleteBlock(ctx context.Context, name, envId string) *utilsGoServer.Error
	WatchReleasesStatus(ctx context.Context, blockName, envId string, statusChan chan *types.ReleasesStatus) *utilsGoServer.Error
	GetBlocksHealthStatus(ctx context.Context, envId string) (*types.BlockStatuses, *utilsGoServer.Error)
	WatchJobsStatus(
		ctx context.Context, blockName, envId string, sendClientLogs func(jobStatus *types.JobStatus) error) *utilsGoServer.Error
	GetBlocksMetrics(ctx context.Context, name, envId string) (*types.BlocksMetrics, *utilsGoServer.Error)
	KillBlockInstance(ctx context.Context, id, envId string) *utilsGoServer.Error
	// Scale down all the resources of a block down to 0
	// return blockName, releaseId, error if any
	SuspendBlock(ctx context.Context, blockName, envId string) (string, string, *utilsGoServer.Error)

	WatchBuildLogs(ctx context.Context, releaseId, blockName, envId string, logsChan chan *types.Logs) *utilsGoServer.Error
	UpdateBuildStatus(ctx context.Context, releaseId, blockName, envId string, buildState types.BuildStatus_State) (*types.Release, *utilsGoServer.Error)
	UpdateBuildCommitSha(ctx context.Context, releaseId, blockName, envId, commitSha string) *utilsGoServer.Error

	WatchConsoleLogs(ctx context.Context, blockName, envId string, logsChan chan *types.ConsoleLog) *utilsGoServer.Error

	GetKintoConfiguration(ctx context.Context) (*types.KintoConfiguration, error)

	AbortRelease(ctx context.Context, blockName, releaseId, envId string) *utilsGoServer.Error

	EnableExternalURL(ctx context.Context, name, envId, releaseId string) *utilsGoServer.Error
	DisableExternalURL(ctx context.Context, name, envId string) *utilsGoServer.Error

	CreateCustomDomainName(ctx context.Context, blockName, envId, domainName string, protocol types.RunConfig_Protocol) *utilsGoServer.Error
	DeleteCustomDomainName(ctx context.Context, blockName, envId, domainName string, protocol types.RunConfig_Protocol) *utilsGoServer.Error
	CheckCertificateReadiness(ctx context.Context, blockName, envId string) bool

	StartTeleport(
		ctx context.Context, envId, blockNameToTeleport string) (*types.TeleportServiceData, *utilsGoServer.Error)
	StopTeleport(ctx context.Context, envId, blockNameTeleported string) *utilsGoServer.Error

	TagRelease(ctx context.Context, tag, blockName, envId, releaseId string) *utilsGoServer.Error
	PromoteRelease(ctx context.Context, tag, releaseId, blockName, envId, targetEnvId string) *utilsGoServer.Error

	GenReleaseConfigFromKintoFile(
		ctx context.Context, org, repo, branch, envId, githubUserToken string, blockType types.Block_Type) (*types.ReleaseConfig, *utilsGoServer.Error)

	// this is a private func used for internal middleware package only. Adapter impls should not have access to this
	add(m Interface)
}

// Implements middleware pattern + Implements controller.ControllerInterface for Adapter Pattern
// All functions implemented for the Controller interface by default forward the request to `next`
// To override the function as middleware, create a struct and insert Middleware as composition and override each
// function as you please. see test file for example
type Middleware struct {
	// Note - it should never be possible for this to be nil
	next Interface
}

func (m *Middleware) add(middleware Interface) {
	m.next = middleware
}

func NewControllerMiddlewareOrDie(middlewares ...Interface) Interface {
	// Build linked list of middleware
	var last Interface
	for _, middleware := range middlewares {
		if last == nil {
			last = middleware
		} else {
			last.add(middleware)
			last = middleware
		}
	}

	// Return first middleware as the top of the chain
	return middlewares[0]
}

func (m *Middleware) CreateEnvironment(ctx context.Context, name string) (*types.Environment, *utilsGoServer.Error) {
	return m.next.CreateEnvironment(ctx, name)
}

func (m *Middleware) UpdateEnvironment(ctx context.Context, id string, name string) (*types.Environment, *utilsGoServer.Error) {
	return m.next.UpdateEnvironment(ctx, id, name)
}

func (m *Middleware) GetEnvironment(ctx context.Context, id string) (*types.Environment, *utilsGoServer.Error) {
	return m.next.GetEnvironment(ctx, id)
}

func (m *Middleware) GetEnvironments(ctx context.Context) (*types.Environments, *utilsGoServer.Error) {
	return m.next.GetEnvironments(ctx)
}

func (m *Middleware) DeleteEnvironment(ctx context.Context, id string) *utilsGoServer.Error {
	return m.next.DeleteEnvironment(ctx, id)
}

func (m *Middleware) CreateBlock(
	ctx context.Context,
	envId, displayName string,
	buildConfig *types.BuildConfig,
	runConfig *types.RunConfig) (string, string, *utilsGoServer.Error) {
	return m.next.CreateBlock(ctx, envId, displayName, buildConfig, runConfig)
}

func (m *Middleware) GetBlock(ctx context.Context, name, envId string) (*types.Block, *utilsGoServer.Error) {
	return m.next.GetBlock(ctx, name, envId)
}

func (m *Middleware) GetBlocks(ctx context.Context, envId string) (*types.Blocks, *utilsGoServer.Error) {
	return m.next.GetBlocks(ctx, envId)
}

func (m *Middleware) DeployBlockUpdate(
	ctx context.Context,
	name, envId, baseReleaseId string,
	buildConfig *types.BuildConfig,
	runConfig *types.RunConfig) (string, string, *utilsGoServer.Error) {
	return m.next.DeployBlockUpdate(ctx, name, envId, baseReleaseId, buildConfig, runConfig)
}

func (m *Middleware) TriggerDeploy(ctx context.Context, name, envId string) (string, string, *utilsGoServer.Error) {
	return m.next.TriggerDeploy(ctx, name, envId)
}

func (m *Middleware) RollbackBlock(ctx context.Context, name, envId, releaseId string) (string, string, *utilsGoServer.Error) {
	return m.next.RollbackBlock(ctx, name, envId, releaseId)
}

func (m *Middleware) DeleteBlock(ctx context.Context, name, envId string) *utilsGoServer.Error {
	return m.next.DeleteBlock(ctx, name, envId)
}

func (m *Middleware) WatchReleasesStatus(
	ctx context.Context, blockName, envId string, statusChan chan *types.ReleasesStatus) *utilsGoServer.Error {
	return m.next.WatchReleasesStatus(ctx, blockName, envId, statusChan)
}

func (m *Middleware) GetBlocksHealthStatus(ctx context.Context, envId string) (*types.BlockStatuses, *utilsGoServer.Error) {
	return m.next.GetBlocksHealthStatus(ctx, envId)
}

func (m *Middleware) WatchJobsStatus(
	ctx context.Context, blockName, envId string, sendClientLogs func(jobStatus *types.JobStatus) error) *utilsGoServer.Error {
	return m.next.WatchJobsStatus(ctx, blockName, envId, sendClientLogs)
}

func (m *Middleware) GetBlocksMetrics(ctx context.Context, name, envId string) (*types.BlocksMetrics, *utilsGoServer.Error) {
	return m.next.GetBlocksMetrics(ctx, name, envId)
}

func (m *Middleware) KillBlockInstance(ctx context.Context, id, envId string) *utilsGoServer.Error {
	return m.next.KillBlockInstance(ctx, id, envId)
}

func (m *Middleware) SuspendBlock(ctx context.Context, blockName, envId string) (string, string, *utilsGoServer.Error) {
	return m.next.SuspendBlock(ctx, blockName, envId)
}

func (m *Middleware) WatchBuildLogs(ctx context.Context, releaseId, blockName, envId string, logsChan chan *types.Logs) *utilsGoServer.Error {
	return m.next.WatchBuildLogs(ctx, releaseId, blockName, envId, logsChan)
}

func (m *Middleware) UpdateBuildCommitSha(ctx context.Context, releaseId, blockName, envId, commitSha string) *utilsGoServer.Error {
	return m.next.UpdateBuildCommitSha(ctx, releaseId, blockName, envId, commitSha)
}

func (m *Middleware) UpdateBuildStatus(
	ctx context.Context, releaseId, blockName, envId string, buildState types.BuildStatus_State) (*types.Release, *utilsGoServer.Error) {
	return m.next.UpdateBuildStatus(ctx, releaseId, blockName, envId, buildState)
}

func (m *Middleware) WatchConsoleLogs(
	ctx context.Context, blockName, envId string, logsChan chan *types.ConsoleLog) *utilsGoServer.Error {
	return m.next.WatchConsoleLogs(ctx, blockName, envId, logsChan)
}

func (m *Middleware) GetKintoConfiguration(ctx context.Context) (*types.KintoConfiguration, error) {
	return m.next.GetKintoConfiguration(ctx)
}

func (m *Middleware) AbortRelease(ctx context.Context, blockName, releaseId, envId string) *utilsGoServer.Error {
	return m.next.AbortRelease(ctx, blockName, releaseId, envId)
}

func (m *Middleware) EnableExternalURL(ctx context.Context, name, envId, releaseId string) *utilsGoServer.Error {
	return m.next.EnableExternalURL(ctx, name, envId, releaseId)
}

func (m *Middleware) DisableExternalURL(ctx context.Context, name, envId string) *utilsGoServer.Error {
	return m.next.DisableExternalURL(ctx, name, envId)
}

func (m *Middleware) CreateCustomDomainName(
	ctx context.Context, blockName, envId, domainName string, protocol types.RunConfig_Protocol) *utilsGoServer.Error {
	return m.next.CreateCustomDomainName(ctx, blockName, envId, domainName, protocol)
}

func (m *Middleware) DeleteCustomDomainName(
	ctx context.Context, blockName, envId, domainName string, protocol types.RunConfig_Protocol) *utilsGoServer.Error {

	return m.next.DeleteCustomDomainName(ctx, blockName, envId, domainName, protocol)
}

func (m *Middleware) CheckCertificateReadiness(ctx context.Context, blockName, envId string) bool {
	return m.next.CheckCertificateReadiness(ctx, blockName, envId)
}

func (m *Middleware) StartTeleport(ctx context.Context, envId, blockName string) (*types.TeleportServiceData, *utilsGoServer.Error) {
	return m.next.StartTeleport(ctx, envId, blockName)
}

func (m *Middleware) StopTeleport(ctx context.Context, envId, blockName string) *utilsGoServer.Error {
	return m.next.StopTeleport(ctx, envId, blockName)
}

func (m *Middleware) TagRelease(ctx context.Context, tag, blockName, envId, releaseId string) *utilsGoServer.Error {
	return m.next.TagRelease(ctx, tag, blockName, envId, releaseId)
}

func (m *Middleware) PromoteRelease(ctx context.Context, tag, releaseId, blockName, envId, targetEnvId string) *utilsGoServer.Error {
	return m.next.PromoteRelease(ctx, tag, releaseId, blockName, envId, targetEnvId)
}

func (m *Middleware) GenReleaseConfigFromKintoFile(
	ctx context.Context, org, repo, branch, envId, githubUserToken string, blockType types.Block_Type) (*types.ReleaseConfig, *utilsGoServer.Error) {
	return m.next.GenReleaseConfigFromKintoFile(ctx, org, repo, branch, envId, githubUserToken, blockType)
}
