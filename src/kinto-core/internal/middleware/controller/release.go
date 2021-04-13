package controller

import (
	"context"
	"fmt"
	"reflect"
	"strings"

	"github.com/golang/protobuf/ptypes"
	"github.com/google/uuid"
	"github.com/jinzhu/copier"
	"github.com/kintohub/utils-go/klog"
	utilsGoServer "github.com/kintohub/utils-go/server"
	"github.com/kintohub/utils-go/utils"
	"github.com/kintoproj/kinto-core/internal/build"
	"github.com/kintoproj/kinto-core/internal/config"
	"github.com/kintoproj/kinto-core/pkg/types"
	"github.com/rs/zerolog/log"
)

func (c *ControllerMiddleware) UpdateBuildStatus(
	ctx context.Context, releaseId, blockName, envId string, buildState types.BuildStatus_State) (*types.Release, *utilsGoServer.Error) {

	block, err := c.store.GetBlock(blockName, envId)

	if err != nil {
		return nil, utilsGoServer.NewErrorf(utilsGoServer.StatusCode_NotFound,
			"block %s.%s not found", blockName, envId)
	}

	release, ok := block.Releases[releaseId]

	if !ok {
		return nil, utilsGoServer.NewErrorf(utilsGoServer.StatusCode_NotFound,
			"release %s.%s.%s not found", releaseId, blockName, envId)
	}

	if release.Status == nil {
		release.Status = &types.Status{}
	}

	if release.Status.State == types.Status_ABORTED {
		klog.Debug("skipping build status update since status is already aborted")
		return release, nil
	}

	switch buildState {
	case types.BuildStatus_QUEUED, types.BuildStatus_UNKNOWN:
		release.Status.State = types.Status_PENDING
	case types.BuildStatus_WORKING:
		release.Status.State = types.Status_RUNNING
		release.StartedAt = ptypes.TimestampNow()
	case types.BuildStatus_SUCCESS:
		release.Status.State = types.Status_SUCCESS
		release.EndedAt = ptypes.TimestampNow()
	case types.BuildStatus_CANCELLED:
		release.Status.State = types.Status_ABORTED
		release.EndedAt = ptypes.TimestampNow()
	default:
		release.Status.State = types.Status_FAIL
		release.EndedAt = ptypes.TimestampNow()
	}

	err = c.store.UpsertBlock(block)

	if err != nil {
		return nil, utilsGoServer.NewErrorWithErr(utilsGoServer.StatusCode_InternalServerError,
			fmt.Sprintf("error happened when upserting release %s.%s.%s",
				releaseId, blockName, envId), err.Error)
	}

	log.Debug().Msgf("successfully updated block %v", block)

	return release, nil
}

func (c *ControllerMiddleware) UpdateBuildCommitSha(
	ctx context.Context, releaseId, blockName, envId, commitSha string) *utilsGoServer.Error {

	block, err := c.store.GetBlock(blockName, envId)
	if err != nil {
		return utilsGoServer.NewErrorf(utilsGoServer.StatusCode_NotFound,
			"block %s.%s not found", blockName, envId)
	}

	release, ok := block.Releases[releaseId]
	if !ok {
		return utilsGoServer.NewErrorf(utilsGoServer.StatusCode_NotFound,
			"release %s.%s.%s not found", releaseId, blockName, envId)
	}

	release.CommitSha = commitSha
	err = c.store.UpsertBlock(block)
	if err != nil {
		return utilsGoServer.NewErrorWithErr(utilsGoServer.StatusCode_InternalServerError,
			fmt.Sprintf("Error happened when upserting release for adding commit sha %s.%s.%s",
				releaseId, blockName, envId), err.Error)
	}
	return nil
}

func (c *ControllerMiddleware) WatchReleasesStatus(
	ctx context.Context, blockName, envId string, logsChan chan *types.ReleasesStatus) *utilsGoServer.Error {

	return c.store.WatchBlockReleaseStatus(blockName, envId, ctx, logsChan)
}

func (c *ControllerMiddleware) AbortRelease(ctx context.Context, blockName, releaseId, envId string) *utilsGoServer.Error {
	// Need to consider refak GetRelease and have release reference its parent block
	// This code is duplicated everywhere...
	block, err := c.store.GetBlock(blockName, envId)

	if err != nil {
		return err
	}

	release, ok := block.Releases[releaseId]

	if !ok {
		return utilsGoServer.NewErrorf(utilsGoServer.StatusCode_NotFound,
			"release %s.%s.%s not found", releaseId, blockName, envId)
	}

	if release.Status != nil &&
		release.Status.State == types.Status_ABORTED ||
		release.Status.State == types.Status_FAIL ||
		release.Status.State == types.Status_SUCCESS {
		return utilsGoServer.NewErrorf(
			utilsGoServer.StatusCode_BadRequest,
			"release is already completed with state %s",
			release.Status.State.String())
	}

	err = c.build.AbortRelease(ctx, release.BuildConfig.Id, envId)

	if err != nil {
		return err
	}

	if release.Status == nil {
		release.Status = &types.Status{}
	}

	release.Status.State = types.Status_ABORTED

	return c.store.UpsertBlock(block)
}

func (c *ControllerMiddleware) TagRelease(ctx context.Context, tag, blockName, envId, releaseId string) *utilsGoServer.Error {
	block, err := c.store.GetBlock(blockName, envId)
	if err != nil {
		return err
	}
	release, ok := block.Releases[releaseId]
	if !ok {
		klog.Errorf("Release %s.%s.%s not found", releaseId, blockName, envId)
		return utilsGoServer.NewErrorf(utilsGoServer.StatusCode_BadRequest, "Problem happened when tagging the release.")
	}
	if doesTagExistInBlock(block.Releases, tag) {
		return utilsGoServer.NewErrorf(utilsGoServer.StatusCode_BadRequest, "Tag already created.")
	}

	block.Releases[releaseId].Tags = append(release.Tags, tag)
	return c.store.UpsertBlock(block)
}

func (c *ControllerMiddleware) PromoteRelease(
	ctx context.Context, tag, releaseId, blockName, envId, targetEnvId string) *utilsGoServer.Error {

	block, err := c.store.GetBlock(blockName, envId)
	if err != nil {
		return err
	}
	release, ok := block.Releases[releaseId]
	// if release doesn't exist or the tag is not in that release then throw
	if !ok || !hasTag(release, tag) {
		return utilsGoServer.NewError(utilsGoServer.StatusCode_BadRequest, "Incorrect Tag.")
	}
	// if that release is not a successful deploy/rollback then throw (also allow NOT_SET for backward compatiblity)
	if release.Type != types.Release_DEPLOY &&
		release.Type != types.Release_ROLLBACK &&
		release.Type != types.Release_NOT_SET {
		return utilsGoServer.NewError(utilsGoServer.StatusCode_BadRequest, "The release hasn't been successfully deployed.")
	}

	targetBlock, errB := c.store.GetBlock(blockName, targetEnvId)
	if errB != nil && errB.StatusCode == utilsGoServer.StatusCode_InternalServerError {
		return errB
	}

	promotedBlock, errp := populatePromotedBlock(block, targetBlock, release, tag, targetEnvId)
	if errp != nil {
		return utilsGoServer.NewError(utilsGoServer.StatusCode_BadRequest, errp.Error())
	}
	// if this is a first promote to the `targetEnvId` upsert will create a new block, if its a second promote we will only
	// append the release to the existing block
	err = c.store.UpsertBlock(promotedBlock)
	if err != nil {
		klog.ErrorWithErr(err.Error, "PromoteTag UpsertBlock error")
		return utilsGoServer.NewError(utilsGoServer.StatusCode_InternalServerError, "Problem happened when promoting your tag.")
	}
	return nil
}

func populatePromotedBlock(originalBlock *types.Block, targetBlock *types.Block, taggedRelease *types.Release, tag, targetEnvId string) (*types.Block, error) {
	block := types.Block{}
	err := copier.Copy(&block, originalBlock)

	if err != nil {
		return nil, fmt.Errorf("Couldn't create the copy version of the promote.")
	}

	// validation
	if targetBlock != nil {
		// if a different block is already deployed throw an error
		if targetBlock.ParentBlockName != block.Name || targetBlock.ParentBlockEnvId != block.EnvId {
			return nil, fmt.Errorf("A service with the same name already created in the promoted environment.")
		}
		// if the same tag is promoted before throw an error
		if doesTagExistInBlock(targetBlock.Releases, tag) {
			return nil, fmt.Errorf("This tag was promoted before.")
		}
	}

	// if the tagged release has multiple tags, then overwite them and only add the promoted tag to that release
	taggedRelease.Tags = []string{tag}
	// if release was a rollback we change it to deploy in the promoted version
	taggedRelease.Type = types.Release_DEPLOY
	// we always set state to "REVIEW_DEPLOY"
	taggedRelease.Status.State = types.Status_REVIEW_DEPLOY
	// after you promote the service is not live, you need to click deploy to regenerate the url
	taggedRelease.RunConfig.Host = ""

	if targetBlock != nil {
		latestRelease := types.GetLatestSuccessfulRelease(targetBlock.Releases)
		if latestRelease != nil {
			klog.Debugf("Found an existing service with a successful release when promoting, copying env vars for release: %s", latestRelease.Id)
			taggedRelease.RunConfig.EnvVars = latestRelease.RunConfig.EnvVars
			taggedRelease.RunConfig.Resources = latestRelease.RunConfig.Resources
			taggedRelease.RunConfig.AutoScaling = latestRelease.RunConfig.AutoScaling
			taggedRelease.RunConfig.JobSpec = latestRelease.RunConfig.JobSpec
			taggedRelease.RunConfig.SleepModeEnabled = latestRelease.RunConfig.SleepModeEnabled
			taggedRelease.RunConfig.SleepModeTTLSeconds = latestRelease.RunConfig.SleepModeTTLSeconds
			taggedRelease.RunConfig.TimeoutInSec = latestRelease.RunConfig.TimeoutInSec
			taggedRelease.RunConfig.Port = latestRelease.RunConfig.Port
		} else {
			klog.Debugf("Found an existing service when promoting with no successful release, block: %s, env: %s", targetBlock.Name, targetEnvId)
		}
		// if the block in the promoted env exists, then append the release on it
		targetBlock.Releases[taggedRelease.Id] = taggedRelease
		return targetBlock, nil
	} else {
		// if it doesn't then use the original block but delete all releases except the promoted one
		block.Releases = map[string]*types.Release{
			taggedRelease.Id: taggedRelease,
		}
		block.ParentBlockName = block.Name
		block.ParentBlockEnvId = block.EnvId
		block.EnvId = targetEnvId
		return &block, nil
	}
}

func doesTagExistInBlock(releases map[string]*types.Release, tag string) bool {
	for _, r := range releases {
		if hasTag(r, tag) {
			return true
		}
	}
	return false
}
func hasTag(release *types.Release, tag string) bool {
	for _, t := range release.Tags {
		if t == tag {
			return true
		}
	}
	return false
}

func isWebApplication(t types.Block_Type) bool {
	return t == types.Block_WEB_APP ||
		t == types.Block_BACKEND_API ||
		t == types.Block_JAMSTACK ||
		t == types.Block_STATIC_SITE
}

// create a new release object
// does not store anything
// validate the repo name/url is not in our blacklist
func genRelease(
	blockName, envId string, typeDeployment types.Release_Type,
	buildConfig *types.BuildConfig, runConfig *types.RunConfig) (*types.Release, *utilsGoServer.Error) {

	if runConfig != nil && runConfig.Host == "" &&
		isWebApplication(runConfig.Type) {
		envHash, err := utils.ShortenHexString(envId, 6)

		if err != nil {
			return nil, utilsGoServer.NewInternalErrorWithErr("error occurred when checking for existing build", err)
		}

		runConfig.Host = fmt.Sprintf(
			"%s-%s.%s",
			blockName, strings.ToLower(envHash), config.KintoDomain)
	}

	if buildConfig != nil && buildConfig.Repository != nil && !isValidRepoUrl(buildConfig.Repository.Url) {
		klog.Infof("Blocked the following repo for having invalid URL: %s", buildConfig.Repository.Url)
		return nil, utilsGoServer.NewError(utilsGoServer.StatusCode_BadRequest, "Error Occurred, please contact customer support.")
	}

	return &types.Release{
		Id:        uuid.New().String(),
		CreatedAt: ptypes.TimestampNow(),
		Status: &types.Status{
			State: types.Status_PENDING,
		},
		BuildConfig: buildConfig,
		RunConfig:   runConfig,
		Type:        typeDeployment,
	}, nil
}

// compare buildConfig with all the buildConfig in releases
// and if find an equality, return the buildId
func getExistingBuildIdIfPossible(
	buildConfig *types.BuildConfig, releases map[string]*types.Release) (*types.BuildConfig, *utilsGoServer.Error) {
	copyBuild := types.BuildConfig{}

	err := copier.Copy(&copyBuild, buildConfig)

	if err != nil {
		return nil, utilsGoServer.NewInternalErrorWithErr("error occurred when checking for existing build", err)
	}

	for _, rel := range releases {
		// TODO we should have a build success status here instead of a global success
		if rel.Status != nil && rel.Status.State == types.Status_SUCCESS {
			copyBuild.Id = rel.BuildConfig.Id       // need to set the ID because it is nil
			copyBuild.Image = rel.BuildConfig.Image // need to set the image because it is nil
			if reflect.DeepEqual(copyBuild, *rel.BuildConfig) {
				return rel.BuildConfig, nil
			}
		}
	}

	return nil, nil
}

func submitReleaseWorkflow(
	buildInterface build.BuildInterface,
	block *types.Block, release *types.Release, isDeployOnly bool) (string, *utilsGoServer.Error) {

	buildId := ""
	var submitWorkflowErr *utilsGoServer.Error

	// this happens when is rollback or when base release has review deploy status
	if isDeployOnly {
		buildId, submitWorkflowErr = buildInterface.DeployRelease(block.Name, release.Id, block.EnvId)
	} else if release.Type == types.Release_DEPLOY {
		if release.RunConfig.Type == types.Block_CATALOG {
			buildId, submitWorkflowErr =
				buildInterface.DeployCatalogRelease(release.BuildConfig.Repository, block.Name, release.Id, block.EnvId)
		} else {
			release.BuildConfig.Image =
				fmt.Sprintf("%s:%s", block.Name, stripeReleaseId(release.Id))

			isStaticBuild := release.RunConfig.Type == types.Block_JAMSTACK || release.RunConfig.Type == types.Block_STATIC_SITE
			buildId, submitWorkflowErr =
				buildInterface.BuildAndDeployRelease(release.BuildConfig, block.Name, release.Id, block.EnvId, isStaticBuild)
		}
	} else if release.Type == types.Release_SUSPEND {
		buildId, submitWorkflowErr = buildInterface.SuspendRelease(block.Name, block.EnvId, release.Id)
	}

	return buildId, submitWorkflowErr
}
