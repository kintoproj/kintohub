package cmd_release

import (
	"errors"
	"fmt"
	"github.com/golang/protobuf/ptypes"
	"github.com/kintoproj/kinto-core/pkg/types"
)

func UpdateReleaseStatus(
	kintoCoreHost, envId, blockName, releaseId, status string, kintoCoreOverTls bool, kintoCoreSecretKey string) error {
	buildStatus, err := convertToBuildStatusRequest(envId, blockName, releaseId, status)
	if err != nil {
		return err
	}

	kintoCoreClient, err := newKintoCoreReleaseClient(kintoCoreHost, kintoCoreOverTls, kintoCoreSecretKey)
	if err != nil {
		return err
	}

	fmt.Printf("DEBUG Sending build status - %v\n", buildStatus)
	_, err = kintoCoreClient.updateBuildStatus(buildStatus)

	return err
}

func convertToBuildStatusRequest(envId, blockName, releaseId, state string) (*types.UpdateBuildStatusRequest, error) {
	buildState, err := convertStringStateToBuildState(state)
	if err != nil {
		return nil, err
	}

	buildStatusRequest := &types.UpdateBuildStatusRequest{
		BlockName: blockName,
		EnvId:     envId,
		ReleaseId: releaseId,
		Status: &types.BuildStatus{
			State: buildState,
		},
	}

	if buildState == types.BuildStatus_WORKING {
		buildStatusRequest.Status.StartTime = ptypes.TimestampNow()
	} else if buildState != types.BuildStatus_QUEUED {
		buildStatusRequest.Status.FinishTime = ptypes.TimestampNow()
	}

	return buildStatusRequest, nil
}

func convertStringStateToBuildState(state string) (types.BuildStatus_State, error) {
	if intState, ok := types.BuildStatus_State_value[state]; ok {
		return types.BuildStatus_State(intState), nil
	}

	return types.BuildStatus_NOT_SET, errors.New(fmt.Sprintf("Cannot convert %s into BuildStatus_State", state))
}
