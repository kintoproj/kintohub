package server

import (
	"context"
	"github.com/golang/protobuf/ptypes/empty"
	"github.com/kintohub/utils-go/klog"
	utilsGoGrpc "github.com/kintohub/utils-go/server/grpc"
	"github.com/kintoproj/kinto-build/internal/build"
	"github.com/kintoproj/kinto-core/pkg/types"
)

type KintoBuildService struct {
	buildClient build.BuildClientInterface
}

func NewKintoBuildService(client build.BuildClientInterface) *KintoBuildService {
	return &KintoBuildService{
		buildClient: client,
	}
}

func (k *KintoBuildService) BuildAndDeployRelease(
	ctx context.Context, req *types.BuildAndDeployRequest) (*types.WorkflowResponse, error) {

	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		return nil, err
	}

	resp, err := k.buildClient.BuildAndDeployRelease(req)

	if err != nil {
		return nil, utilsGoGrpc.ConvertToGrpcError(ctx, err)
	}

	return resp, nil
}

func (k *KintoBuildService) DeployRelease(
	ctx context.Context, req *types.DeployRequest) (*types.WorkflowResponse, error) {

	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		return nil, err
	}

	resp, err := k.buildClient.DeployRelease(req)

	if err != nil {
		return nil, utilsGoGrpc.ConvertToGrpcError(ctx, err)
	}

	return resp, nil
}

func (k *KintoBuildService) DeployReleaseFromCatalog(
	ctx context.Context, req *types.DeployCatalogRequest) (*types.WorkflowResponse, error) {

	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		return nil, err
	}

	resp, err := k.buildClient.DeployReleaseFromCatalog(req)

	if err != nil {
		klog.ErrorfWithErr(err.Error, "Error deploying release from catalog")
		return nil, utilsGoGrpc.ConvertToGrpcError(ctx, err)
	}

	return resp, nil
}

func (k *KintoBuildService) UndeployRelease(
	ctx context.Context, req *types.UndeployRequest) (*types.WorkflowResponse, error) {

	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		return nil, err
	}

	resp, err := k.buildClient.UndeployRelease(req)

	if err != nil {
		return nil, utilsGoGrpc.ConvertToGrpcError(ctx, err)
	}

	return resp, nil
}

func (k *KintoBuildService) SuspendRelease(c context.Context, req *types.SuspendRequest) (*types.WorkflowResponse, error) {
	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		return nil, err
	}

	resp, err := k.buildClient.SuspendRelease(req)

	if err != nil {
		return nil, utilsGoGrpc.ConvertToGrpcError(c, err)
	}

	return resp, nil
}

func (k *KintoBuildService) GetWorkflowLogs(ctx context.Context, req *types.WorkflowLogsRequest) (*types.Logs, error) {
	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		return nil, err
	}

	logData, err := k.buildClient.GetLogs(ctx, req.BuildId)

	if err != nil {
		return nil, utilsGoGrpc.ConvertToGrpcError(ctx, err)
	}

	return &types.Logs{
		Data: logData,
	}, nil
}

func (k *KintoBuildService) WatchWorkflowLogs(
	req *types.WorkflowLogsRequest, stream types.WorkflowAPIService_WatchWorkflowLogsServer) error {

	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		return err
	}

	err := k.buildClient.RunWatchLogs(stream.Context(), req.BuildId, func(data []byte) error {
		return stream.Send(&types.Logs{
			Data: data,
		})
	})

	if err != nil {
		return utilsGoGrpc.ConvertToGrpcError(stream.Context(), err)
	}

	return nil
}

func (k *KintoBuildService) AbortRelease(ctx context.Context, req *types.AbortReleaseRequest) (*empty.Empty, error) {
	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		return nil, err
	}

	err := k.buildClient.AbortRelease(ctx, req.BuildId)

	if err != nil {
		return nil, utilsGoGrpc.ConvertToGrpcError(ctx, err)
	}

	return &empty.Empty{}, nil
}
