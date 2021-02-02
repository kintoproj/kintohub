package api

import (
	"context"
	"github.com/kintohub/kinto-core/pkg/types"
	"github.com/kintohub/utils-go/klog"
	utilsGoServer "github.com/kintohub/utils-go/server"
	"github.com/rs/zerolog/log"
)

func (b *BuildAPI) BuildAndDeployRelease(
	buildConfig *types.BuildConfig, blockName, releaseId, envId string, isStaticBuild bool) (string, *utilsGoServer.Error) {

	log.Debug().Msgf("Build and deploy release %s.%s.%s - %v", releaseId, blockName, envId, buildConfig)

	resp, err := b.buildClient.BuildAndDeployRelease(context.Background(), &types.BuildAndDeployRequest{
		BlockName:     blockName,
		ReleaseId:     releaseId,
		Namespace:     envId,
		BuildConfig:   buildConfig,
		IsStaticBuild: isStaticBuild,
	})

	if err != nil {
		return "", utilsGoServer.NewInternalErrorWithErr("error occurred when calling the workflow api", err)
	}

	return resp.Id, nil
}

func (b *BuildAPI) DeployCatalogRelease(
	repo *types.Repository, blockName, releaseId, envId string) (string, *utilsGoServer.Error) {

	resp, err := b.buildClient.DeployReleaseFromCatalog(context.Background(), &types.DeployCatalogRequest{
		BlockName: blockName,
		ReleaseId: releaseId,
		Namespace: envId,
		Repo:      repo,
	})

	if err != nil {
		return "", utilsGoServer.NewInternalErrorWithErr("error occurred when calling the workflow api", err)
	}

	return resp.Id, nil
}

func (b *BuildAPI) DeployRelease(blockName, releaseId, envId string) (string, *utilsGoServer.Error) {

	log.Debug().Msgf("Deploy release %s.%s.%s", releaseId, blockName, envId)

	resp, err := b.buildClient.DeployRelease(context.Background(), &types.DeployRequest{
		BlockName: blockName,
		ReleaseId: releaseId,
		Namespace: envId,
	})

	if err != nil {
		return "", utilsGoServer.NewInternalErrorWithErr("error occurred when calling the workflow api", err)
	}

	return resp.Id, nil
}

func (b *BuildAPI) UndeployRelease(blockName, envId string) (string, *utilsGoServer.Error) {

	log.Debug().Msgf("Undeploy release %s.%s", blockName, envId)

	resp, err := b.buildClient.UndeployRelease(context.Background(), &types.UndeployRequest{
		BlockName: blockName,
		Namespace: envId,
	})

	if err != nil {
		return "", utilsGoServer.NewInternalErrorWithErr("error occurred when calling the workflow api", err)
	}

	return resp.Id, nil
}

func (b *BuildAPI) SuspendRelease(blockName, envId, releaseID string) (string, *utilsGoServer.Error) {
	log.Debug().Msgf("Suspend release %s.%s.%s", releaseID, blockName, envId)

	resp, err := b.buildClient.SuspendRelease(context.Background(), &types.SuspendRequest{
		BlockName: blockName,
		Namespace: envId,
		ReleaseId: releaseID,
	})

	if err != nil {
		return "", utilsGoServer.NewInternalErrorWithErr("error occurred when calling the workflow api", err)
	}

	return resp.Id, nil
}

func (b *BuildAPI) AbortRelease(ctx context.Context, buildId, envId string) *utilsGoServer.Error {
	_, err := b.buildClient.AbortRelease(ctx, &types.AbortReleaseRequest{
		BuildId: buildId,
		EnvId:   envId,
	})

	if err != nil {
		return utilsGoServer.NewInternalErrorWithErr("error calling build service to abort release", err)
	}

	return nil
}

func (b *BuildAPI) GenReleaseConfigFromKintoFile(
	org, repo, branch, envId, githubUserToken string, blockType types.Block_Type) (*types.ReleaseConfig, *utilsGoServer.Error) {

	fileContent, err := b.githubAppClient.GetFile(org, repo, branch, ".kinto", githubUserToken)
	if err != nil {
		return nil, utilsGoServer.NewErrorWithErr(
			utilsGoServer.StatusCode_NotFound, "Kinto file not found", err) // TODO see how we wanna handle that, it could also be an error with github
	}

	releaseConfig, err := types.ConvertYamlToReleaseConfig(fileContent, blockType)
	if err != nil {
		klog.ErrorfWithErr(err, "error converting yaml file into release config")
		return nil, utilsGoServer.NewErrorWithErr(
			utilsGoServer.StatusCode_BadRequest, "Error parsing kinto file", err)
	}

	return releaseConfig, nil
}

// Generate GithubApp Token and add it in the repo param so that it can be store in k8s later
// This token will be used to clone the repository during build step
func (b *BuildAPI) genGithubAppToken(repo *types.Repository) error {
	// TODO check if existing token is still valid or not before generating a new one
	appToken, err := b.githubAppClient.CreateGithubAppToken(repo.GithubUserToken)
	if err != nil {
		return err
	}
	repo.AccessToken = appToken
	return nil
}
