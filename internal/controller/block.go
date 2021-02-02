package controller

import (
	"github.com/google/uuid"
	"github.com/kintohub/kinto-core/internal/build"
	"github.com/kintohub/kinto-core/internal/store"
	"github.com/kintohub/kinto-core/pkg/types"
	utilsGoServer "github.com/kintohub/utils-go/server"
	"github.com/rs/zerolog/log"
	"strings"
)

func (c *Controller) CreateBlock(
	envId, name string,
	buildConfig *types.BuildConfig,
	runConfig *types.RunConfig) (string, string, *utilsGoServer.Error) {

	lowerCaseName := strings.ToLower(name)

	_, err := c.store.GetBlock(lowerCaseName, envId)

	if err != nil {
		if err.StatusCode != utilsGoServer.StatusCode_NotFound {
			return "", "", err
		}
	} else {
		return "", "", utilsGoServer.NewError(
			utilsGoServer.StatusCode_BadRequest, "a service with this name already exists in this environment")
	}

	release, err := genRelease(lowerCaseName, envId, types.Release_DEPLOY, buildConfig, runConfig)

	if err != nil {
		return "", "", err
	}

	block := &types.Block{
		Id:    uuid.New().String(), // keeping it here but it's useless, the id is [envId-name]
		EnvId: envId,
		Name:  lowerCaseName,
		//TODO: Consider deprecating Display Name unless we plan to add it at some point
		DisplayName: lowerCaseName,
		Releases: map[string]*types.Release{
			release.Id: release,
		},
	}

	if isWebApplication(runConfig.Type) {
		block.IsPublicURL = true // TODO this should be disabled by default
		// TODO but Static Website/JAMSTACK is always public?
	}

	err = upsertBlockAndSubmitWorkflow(c.build, c.store, block, release, false)

	if err != nil {
		return "", "", err
	}

	return lowerCaseName, release.Id, nil
}

func (c *Controller) GetBlock(name, envId string) (*types.Block, *utilsGoServer.Error) {
	return c.store.GetBlock(name, envId)
}

func (c *Controller) GetBlocks(envId string) (*types.Blocks, *utilsGoServer.Error) {
	blocks, err := c.store.GetBlocks(envId)

	if err != nil {
		return nil, err
	}

	return &types.Blocks{
		Items: blocks,
	}, nil
}

func (c *Controller) DeployBlockUpdate(
	name, envId, baseReleaseId string,
	buildConfig *types.BuildConfig,
	runConfig *types.RunConfig) (string, string, *utilsGoServer.Error) {

	block, err := c.GetBlock(name, envId)
	if err != nil {
		return "", "", err
	}

	if isReleaseDeploying(block) {
		return "", "", utilsGoServer.NewError(
			utilsGoServer.StatusCode_ExpectationFailed, "A release is already deploying.")
	}

	baseRelease, ok := block.Releases[baseReleaseId]
	if !ok {
		return "", "", utilsGoServer.NewError(utilsGoServer.StatusCode_ExpectationFailed, "Couldn't find the release.")
	}

	block, release, isDeployOnly := deployBlock(block, baseRelease, buildConfig, runConfig)

	err = upsertBlockAndSubmitWorkflow(c.build, c.store, block, release, isDeployOnly)

	if err != nil {
		return "", "", err
	}

	return block.Name, release.Id, nil
}

func (c *Controller) TriggerDeploy(
	name, envId string) (string, string, *utilsGoServer.Error) {

	block, err := c.GetBlock(name, envId)
	if err != nil {
		return "", "", err
	}

	if isReleaseDeploying(block) {
		return "", "", utilsGoServer.NewError(
			utilsGoServer.StatusCode_ExpectationFailed, "A release is already deploying.")
	}

	latestRelease := types.GetLatestSuccessfulRelease(block.Releases)

	if latestRelease == nil {
		return "", "", utilsGoServer.NewError(utilsGoServer.StatusCode_ExpectationFailed, "Couldn't find the release.")
	}

	block, release, isDeployOnly := deployBlock(block, latestRelease, latestRelease.BuildConfig, latestRelease.RunConfig)

	err = upsertBlockAndSubmitWorkflow(c.build, c.store, block, release, isDeployOnly)

	if err != nil {
		return "", "", err
	}

	return block.Name, release.Id, nil
}

func deployBlock(block *types.Block,
	baseRelease *types.Release,
	buildConfig *types.BuildConfig,
	runConfig *types.RunConfig) (*types.Block, *types.Release, bool) {

	release, err := genRelease(block.Name, block.EnvId, types.Release_DEPLOY, buildConfig, runConfig)
	if err != nil {
		return nil, nil, false
	}

	// Review deployment happens when you promote a service to another env and then try to deploy it
	// we don't need to rebuild an image in that case
	isReviewDeployment := baseRelease.Status.State == types.Status_REVIEW_DEPLOY
	isPromoteBlock := block.ParentBlockName != ""
	isSuspendDeployment := baseRelease.Type == types.Release_SUSPEND

	isDeployOnly := isReviewDeployment || isPromoteBlock || isSuspendDeployment

	// when no builds is required we want to copy the tags, tags are only related to new builds
	if isDeployOnly {
		release.Tags = baseRelease.Tags
	}
	// the only case were we want to update existing release (not create a new one) is when the user clicks deploy and status is "REVIEW_DEPLOY"
	if isReviewDeployment {
		delete(block.Releases, baseRelease.Id)
	}

	block.Releases[release.Id] = release

	return block, release, isDeployOnly
}

func (c *Controller) RollbackBlock(name, envId, releaseId string) (string, string, *utilsGoServer.Error) {
	block, err := c.GetBlock(name, envId)

	if err != nil {
		return "", "", err
	}

	if isReleaseDeploying(block) {
		return "", "", utilsGoServer.NewError(
			utilsGoServer.StatusCode_ExpectationFailed, "a release is already deploying")
	}

	releaseToRollback, ok := block.Releases[releaseId]

	if !ok {
		return "", "", utilsGoServer.NewErrorf(utilsGoServer.StatusCode_NotFound, "release id %s not found", releaseId)
	}

	release, err := genRelease(
		block.Name, block.EnvId, types.Release_ROLLBACK, releaseToRollback.BuildConfig, releaseToRollback.RunConfig)
	// when rolling back, it wont trigger a new build, we want to copy the tags coz they are only related to new builds
	release.Tags = releaseToRollback.Tags

	if err != nil {
		return "", "", err
	}

	block.Releases[release.Id] = release

	err = upsertBlockAndSubmitWorkflow(c.build, c.store, block, release, true)

	if err != nil {
		return "", "", err
	}

	return block.Name, release.Id, nil
}

func (c *Controller) SuspendBlock(name, envId string) (string, string, *utilsGoServer.Error) {
	block, err := c.GetBlock(name, envId)

	if err != nil {
		return "", "", err
	}

	if isReleaseDeploying(block) {
		return "", "", utilsGoServer.NewError(
			utilsGoServer.StatusCode_ExpectationFailed, "a release is already deploying")
	}

	// we create "empty" buildConfig since it will contain the `buildId`
	buildConfig := &types.BuildConfig{}
	release, err := genRelease(block.Name, block.EnvId, types.Release_SUSPEND, buildConfig, nil)

	if err != nil {
		return "", "", err
	}

	block.Releases[release.Id] = release

	err = upsertBlockAndSubmitWorkflow(c.build, c.store, block, release, false)

	if err != nil {
		return "", "", err
	}

	return block.Name, release.Id, nil
}

func upsertBlockAndSubmitWorkflow(
	buildInterface build.BuildInterface, storeInterface store.StoreInterface,
	block *types.Block, release *types.Release, isDeployOnly bool) *utilsGoServer.Error {

	// we write the block + release in the store before calling the workflow because the workflow retrieves the release
	// from the store
	err := storeInterface.UpsertBlock(block)

	if err != nil {
		return err
	}

	buildId, err := submitReleaseWorkflow(buildInterface, block, release, isDeployOnly)

	if err != nil {
		log.Error().Err(err.Error).Msgf("Error submitting workflow for block %s.%s", block.Name, block.EnvId)
		return err
	} else {
		release.BuildConfig.Id = buildId

		// we write the block a second time in the store but this time with the build id
		err = storeInterface.UpsertBlock(block)

		if err != nil {
			return err
		}
	}

	if block.IsPublicURL && release.RunConfig != nil && isWebApplication(release.RunConfig.Type) {
		err = upsertExternalURL(storeInterface, block.Name, block.EnvId, release)

		if err != nil {
			return err
		}
	}

	return nil
}

/*
 * Return true if the block already has an ongoing release deployment
 * Use this function to prevent the user from running multiple deployments at the time that could fuck up their services
 */
func isReleaseDeploying(block *types.Block) bool {
	for _, r := range block.Releases {
		if r.Status.State == types.Status_PENDING || r.Status.State == types.Status_RUNNING {
			return true
		}
	}

	return false
}

func (c *Controller) DeleteBlock(name, envId string) *utilsGoServer.Error {
	_, err := c.build.UndeployRelease(name, envId)

	if err != nil {
		return err
	}

	// no need to provide the `host` since we are deleting the block
	err = c.store.DeleteCustomDomainNames(envId, name, "")

	if err != nil {
		return err
	}

	err = c.store.DisablePublicURL(envId, name)

	if err != nil {
		return err
	}

	return c.store.DeleteBlock(name, envId)
}

func (c *Controller) GetBlocksHealthStatus(envId string) (*types.BlockStatuses, *utilsGoServer.Error) {

	blocks, err := c.store.GetBlocks(envId)

	if err != nil {
		return nil, err
	}

	var blockStatus []*types.BlockStatus

	for _, block := range blocks {
		release := types.GetLatestSuccessfulRelease(block.Releases)

		if release == nil {
			log.Debug().Msgf("could not find a successful release in block %s.%s", block.Name, block.EnvId)
			continue
		}

		state, err := c.store.GetBlockHeathState(block.Name, block.EnvId, release)

		if err != nil {
			log.Error().Err(err).Msgf("Error getting block health state for block %s", block.Name)
			continue
		}

		blockStatus = append(
			blockStatus,
			&types.BlockStatus{
				BlockName: block.Name,
				EnvId:     envId,
				ReleaseId: release.Id,
				State:     state,
			},
		)
	}

	return &types.BlockStatuses{
		BlockStatuses: blockStatus,
	}, nil
}

func (c *Controller) KillBlockInstance(id, envId string) *utilsGoServer.Error {
	return c.store.KillBlockInstance(id, envId)
}

func (c *Controller) GenReleaseConfigFromKintoFile(
	org, repo, branch, envId, githubUserToken string, blockType types.Block_Type) (*types.ReleaseConfig, *utilsGoServer.Error) {
	return c.build.GenReleaseConfigFromKintoFile(org, repo, branch, envId, githubUserToken, blockType)
}
