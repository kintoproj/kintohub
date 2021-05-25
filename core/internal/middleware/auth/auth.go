package auth

import (
	"context"

	utilsGoServer "github.com/kintoproj/go-utils/server"
	"github.com/kintoproj/kintohub/core/internal/middleware"
	"github.com/kintoproj/kintohub/core/pkg/types"
	"google.golang.org/grpc/metadata"
)

type AuthMiddleware struct {
	middleware.Middleware
	secret string
}

func NewAuthMiddleware(secret string) middleware.Interface {
	return &AuthMiddleware{
		secret: secret,
	}
}

func (a *AuthMiddleware) GetEnvironment(ctx context.Context, id string) (*types.Environment, *utilsGoServer.Error) {
	err := a.processAuth(ctx)
	if err != nil {
		return nil, err
	}

	return a.Middleware.GetEnvironment(ctx, id)
}

func (a *AuthMiddleware) GetEnvironments(ctx context.Context) (*types.Environments, *utilsGoServer.Error) {
	err := a.processAuth(ctx)
	if err != nil {
		return nil, err
	}

	return a.Middleware.GetEnvironments(ctx)
}

func (a *AuthMiddleware) UpdateEnvironment(ctx context.Context, id string, name string) (*types.Environment, *utilsGoServer.Error) {
	err := a.processAuth(ctx)
	if err != nil {
		return nil, err
	}

	return a.Middleware.UpdateEnvironment(ctx, id, name)
}

func (a *AuthMiddleware) DeleteEnvironment(ctx context.Context, id string) *utilsGoServer.Error {
	err := a.processAuth(ctx)
	if err != nil {
		return err
	}

	return a.Middleware.DeleteEnvironment(ctx, id)
}

func (a *AuthMiddleware) CreateBlock(
	ctx context.Context,
	envId, name string,
	buildConfig *types.BuildConfig,
	runConfig *types.RunConfig) (string, string, *utilsGoServer.Error) {

	err := a.processAuth(ctx)
	if err != nil {
		return "", "", err
	}

	return a.Middleware.CreateBlock(ctx, envId, name, buildConfig, runConfig)
}

func (a *AuthMiddleware) GetBlock(ctx context.Context, name, envId string) (*types.Block, *utilsGoServer.Error) {
	err := a.processAuth(ctx)
	if err != nil {
		return nil, err
	}

	return a.Middleware.GetBlock(ctx, name, envId)
}

func (a *AuthMiddleware) GetBlocks(ctx context.Context, envId string) (*types.Blocks, *utilsGoServer.Error) {
	err := a.processAuth(ctx)
	if err != nil {
		return nil, err
	}

	return a.Middleware.GetBlocks(ctx, envId)
}

func (a *AuthMiddleware) DeployBlockUpdate(
	ctx context.Context,
	name, envId, baseReleaseId string,
	buildConfig *types.BuildConfig,
	runConfig *types.RunConfig) (string, string, *utilsGoServer.Error) {

	err := a.processAuth(ctx)
	if err != nil {
		return "", "", err
	}

	return a.Middleware.DeployBlockUpdate(ctx, name, envId, baseReleaseId, buildConfig, runConfig)
}

func (a *AuthMiddleware) TriggerDeploy(ctx context.Context, name, envId string) (string, string, *utilsGoServer.Error) {
	err := a.processAuth(ctx)
	if err != nil {
		return "", "", err
	}

	return a.Middleware.TriggerDeploy(ctx, name, envId)
}

func (a *AuthMiddleware) RollbackBlock(ctx context.Context, name, envId, releaseId string) (string, string, *utilsGoServer.Error) {
	err := a.processAuth(ctx)
	if err != nil {
		return "", "", err
	}

	return a.Middleware.RollbackBlock(ctx, name, envId, releaseId)
}

func (a *AuthMiddleware) DeleteBlock(ctx context.Context, name, envId string) *utilsGoServer.Error {
	err := a.processAuth(ctx)
	if err != nil {
		return err
	}

	return a.Middleware.DeleteBlock(ctx, name, envId)
}

func (a *AuthMiddleware) WatchReleasesStatus(ctx context.Context, blockName, envId string, statusChan chan *types.ReleasesStatus) *utilsGoServer.Error {
	err := a.processAuth(ctx)
	if err != nil {
		return err
	}

	return a.Middleware.WatchReleasesStatus(ctx, blockName, envId, statusChan)
}

func (a *AuthMiddleware) GetBlocksHealthStatus(ctx context.Context, envId string) (*types.BlockStatuses, *utilsGoServer.Error) {
	err := a.processAuth(ctx)
	if err != nil {
		return nil, err
	}

	return a.Middleware.GetBlocksHealthStatus(ctx, envId)
}

func (a *AuthMiddleware) WatchJobsStatus(
	ctx context.Context, blockName, envId string, sendClientLogs func(jobStatus *types.JobStatus) error) *utilsGoServer.Error {

	err := a.processAuth(ctx)
	if err != nil {
		return err
	}

	return a.Middleware.WatchJobsStatus(ctx, blockName, envId, sendClientLogs)
}

func (a *AuthMiddleware) GetBlocksMetrics(ctx context.Context, name, envId string) (*types.BlocksMetrics, *utilsGoServer.Error) {
	err := a.processAuth(ctx)
	if err != nil {
		return nil, err
	}

	return a.Middleware.GetBlocksMetrics(ctx, name, envId)
}

func (a *AuthMiddleware) KillBlockInstance(ctx context.Context, id, envId string) *utilsGoServer.Error {
	err := a.processAuth(ctx)
	if err != nil {
		return err
	}

	return a.Middleware.KillBlockInstance(ctx, id, envId)
}

func (a *AuthMiddleware) SuspendBlock(ctx context.Context, blockName, envId string) (string, string, *utilsGoServer.Error) {
	err := a.processAuth(ctx)
	if err != nil {
		return "", "", err
	}

	return a.Middleware.SuspendBlock(ctx, blockName, envId)
}

func (a *AuthMiddleware) WatchBuildLogs(ctx context.Context, releaseId, blockName, envId string, logsChan chan *types.Logs) *utilsGoServer.Error {
	err := a.processAuth(ctx)
	if err != nil {
		return err
	}

	return a.Middleware.WatchBuildLogs(ctx, releaseId, blockName, envId, logsChan)
}

func (a *AuthMiddleware) UpdateBuildStatus(
	ctx context.Context, releaseId, blockName, envId string, buildState types.BuildStatus_State) (*types.Release, *utilsGoServer.Error) {

	err := a.processAuth(ctx)
	if err != nil {
		return nil, err
	}

	return a.Middleware.UpdateBuildStatus(ctx, releaseId, blockName, envId, buildState)
}

func (a *AuthMiddleware) UpdateBuildCommitSha(ctx context.Context, releaseId, blockName, envId, commitSha string) *utilsGoServer.Error {
	err := a.processAuth(ctx)
	if err != nil {
		return err
	}

	return a.Middleware.UpdateBuildCommitSha(ctx, releaseId, blockName, envId, commitSha)
}

func (a *AuthMiddleware) WatchConsoleLogs(ctx context.Context, blockName, envId string, logsChan chan *types.ConsoleLog) *utilsGoServer.Error {
	err := a.processAuth(ctx)
	if err != nil {
		return err
	}

	return a.Middleware.WatchConsoleLogs(ctx, blockName, envId, logsChan)
}

func (a *AuthMiddleware) GetKintoConfiguration(ctx context.Context) (*types.KintoConfiguration, error) {
	return a.Middleware.GetKintoConfiguration(ctx)
}

func (a *AuthMiddleware) AbortRelease(ctx context.Context, blockName, releaseId, envId string) *utilsGoServer.Error {
	err := a.processAuth(ctx)
	if err != nil {
		return err
	}

	return a.Middleware.AbortRelease(ctx, blockName, releaseId, envId)
}

func (a *AuthMiddleware) EnableExternalURL(ctx context.Context, name, envId, releaseId string) *utilsGoServer.Error {
	err := a.processAuth(ctx)
	if err != nil {
		return err
	}

	return a.Middleware.EnableExternalURL(ctx, name, envId, releaseId)
}

func (a *AuthMiddleware) DisableExternalURL(ctx context.Context, name, envId string) *utilsGoServer.Error {
	err := a.processAuth(ctx)
	if err != nil {
		return err
	}

	return a.Middleware.DisableExternalURL(ctx, name, envId)
}

func (a *AuthMiddleware) CreateCustomDomainName(
	ctx context.Context, blockName, envId, domainName string, protocol types.RunConfig_Protocol) *utilsGoServer.Error {

	err := a.processAuth(ctx)
	if err != nil {
		return err
	}

	return a.Middleware.CreateCustomDomainName(ctx, blockName, envId, domainName, protocol)
}

func (a *AuthMiddleware) DeleteCustomDomainName(
	ctx context.Context, blockName, envId, domainName string, protocol types.RunConfig_Protocol) *utilsGoServer.Error {

	err := a.processAuth(ctx)
	if err != nil {
		return err
	}

	return a.Middleware.DeleteCustomDomainName(ctx, blockName, envId, domainName, protocol)
}

func (a *AuthMiddleware) CheckCertificateReadiness(ctx context.Context, blockName, envId string) bool {
	return a.Middleware.CheckCertificateReadiness(ctx, blockName, envId)
}

func (a *AuthMiddleware) StartTeleport(
	ctx context.Context, envId, blockNameToTeleport string) (*types.TeleportServiceData, *utilsGoServer.Error) {

	err := a.processAuth(ctx)
	if err != nil {
		return nil, err
	}

	return a.Middleware.StartTeleport(ctx, envId, blockNameToTeleport)
}

func (a *AuthMiddleware) StopTeleport(ctx context.Context, envId, blockNameTeleported string) *utilsGoServer.Error {
	err := a.processAuth(ctx)
	if err != nil {
		return err
	}

	return a.Middleware.StopTeleport(ctx, envId, blockNameTeleported)
}

func (a *AuthMiddleware) TagRelease(ctx context.Context, tag, blockName, envId, releaseId string) *utilsGoServer.Error {
	err := a.processAuth(ctx)
	if err != nil {
		return err
	}

	return a.Middleware.TagRelease(ctx, tag, blockName, envId, releaseId)
}

func (a *AuthMiddleware) PromoteRelease(ctx context.Context, tag, releaseId, blockName, envId, targetEnvId string) *utilsGoServer.Error {
	err := a.processAuth(ctx)
	if err != nil {
		return err
	}

	return a.Middleware.PromoteRelease(ctx, tag, releaseId, blockName, envId, targetEnvId)
}

func (a *AuthMiddleware) GenReleaseConfigFromKintoFile(
	ctx context.Context, org, repo, branch, envId, githubUserToken string, blockType types.Block_Type) (*types.ReleaseConfig, *utilsGoServer.Error) {

	err := a.processAuth(ctx)
	if err != nil {
		return nil, err
	}

	return a.Middleware.GenReleaseConfigFromKintoFile(ctx, org, repo, branch, envId, githubUserToken, blockType)
}

func (a *AuthMiddleware) CreateEnvironment(ctx context.Context, name string) (*types.Environment, *utilsGoServer.Error) {
	err := a.processAuth(ctx)
	if err != nil {
		return nil, err
	}

	return a.Middleware.CreateEnvironment(ctx, name)
}

func (a *AuthMiddleware) processAuth(ctx context.Context) *utilsGoServer.Error {
	if a.secret == "" {
		return nil
	}

	md, ok := metadata.FromIncomingContext(ctx)

	if !ok {
		return nil
	}

	secret := md.Get("authorization")
	if len(secret) > 0 && secret[0] == a.secret {
		return nil
	}

	return utilsGoServer.NewError(utilsGoServer.StatusCode_Unauthorized, "you are not authorized to query this endpoint")
}
