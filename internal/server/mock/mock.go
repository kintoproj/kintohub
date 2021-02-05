package mock

import (
	"github.com/golang/protobuf/ptypes/empty"
	"github.com/kintoproj/kinto-core/pkg/types"
	"github.com/stretchr/testify/mock"
	"golang.org/x/net/context"
	"google.golang.org/grpc"
)

type MockKintoCoreService struct {
	mock.Mock
}

func (m *MockKintoCoreService) GetServiceInfo() grpc.ServiceInfo {
	server := grpc.NewServer()
	types.RegisterKintoCoreServiceServer(server, m)
	return server.GetServiceInfo()["KintoCoreService"]
}

func (m *MockKintoCoreService) GetEnvironment(ctx context.Context, req *types.EnvironmentQueryRequest) (*types.Environment, error) {
	args := m.Called(ctx, req)

	err := args.Error(1)

	if err != nil {
		return nil, err
	}

	return args.Get(0).(*types.Environment), nil
}

func (m *MockKintoCoreService) GetEnvironments(ctx context.Context, empty *empty.Empty) (*types.Environments, error) {
	args := m.Called(ctx, empty)

	err := args.Error(1)

	if err != nil {
		return nil, err
	}

	return args.Get(0).(*types.Environments), nil
}

func (m *MockKintoCoreService) UpdateEnvironment(ctx context.Context, req *types.UpdateEnvironmentRequest) (*types.Environment, error) {
	args := m.Called(ctx, req)

	err := args.Error(1)

	if err != nil {
		return nil, err
	}

	return args.Get(0).(*types.Environment), nil
}

func (m *MockKintoCoreService) CreateEnvironment(ctx context.Context, req *types.CreateEnvironmentRequest) (*types.Environment, error) {
	args := m.Called(ctx, req)

	err := args.Error(1)

	if err != nil {
		return nil, err
	}

	return args.Get(0).(*types.Environment), nil
}

func (m *MockKintoCoreService) DeleteEnvironment(ctx context.Context, req *types.DeleteEnvironmentRequest) (*empty.Empty, error) {
	args := m.Called(ctx, req)

	err := args.Error(1)

	if err != nil {
		return nil, err
	}

	return args.Get(0).(*empty.Empty), nil
}

func (m *MockKintoCoreService) CreateBlock(ctx context.Context, req *types.CreateBlockRequest) (*types.BlockUpdateResponse, error) {
	args := m.Called(ctx, req)

	err := args.Error(1)

	if err != nil {
		return nil, err
	}

	return args.Get(0).(*types.BlockUpdateResponse), nil
}

func (m *MockKintoCoreService) TriggerDeploy(
	c context.Context, req *types.TriggerDeployRequest) (*types.BlockUpdateResponse, error) {
	args := m.Called(c, req)

	err := args.Error(1)

	if err != nil {
		return nil, err
	}

	return args.Get(0).(*types.BlockUpdateResponse), nil
}

func (m *MockKintoCoreService) DeployBlockUpdate(ctx context.Context, req *types.DeployBlockRequest) (*types.BlockUpdateResponse, error) {
	args := m.Called(ctx, req)

	err := args.Error(1)

	if err != nil {
		return nil, err
	}

	return args.Get(0).(*types.BlockUpdateResponse), nil
}

func (m *MockKintoCoreService) RollbackBlock(ctx context.Context, req *types.RollbackBlockRequest) (*types.BlockUpdateResponse, error) {
	args := m.Called(ctx, req)

	err := args.Error(1)

	if err != nil {
		return nil, err
	}

	return args.Get(0).(*types.BlockUpdateResponse), nil
}

func (m *MockKintoCoreService) GetBlocks(ctx context.Context, req *types.BlockQueryRequest) (*types.Blocks, error) {
	args := m.Called(ctx, req)

	err := args.Error(1)

	if err != nil {
		return nil, err
	}

	return args.Get(0).(*types.Blocks), nil
}

func (m *MockKintoCoreService) GetBlock(ctx context.Context, req *types.BlockQueryRequest) (*types.Block, error) {
	args := m.Called(ctx, req)

	err := args.Error(1)

	if err != nil {
		return nil, err
	}

	return args.Get(0).(*types.Block), nil
}

func (m *MockKintoCoreService) DeleteBlock(ctx context.Context, req *types.DeleteBlockRequest) (*empty.Empty, error) {
	args := m.Called(ctx, req)

	err := args.Error(1)

	if err != nil {
		return nil, err
	}

	return args.Get(0).(*empty.Empty), nil
}

func (m *MockKintoCoreService) WatchReleasesStatus(req *types.BlockQueryRequest, server types.KintoCoreService_WatchReleasesStatusServer) error {
	args := m.Called(req, server)
	return args.Error(0)
}

func (m *MockKintoCoreService) WatchBuildLogs(req *types.WatchBuildLogsRequest, server types.KintoCoreService_WatchBuildLogsServer) error {
	args := m.Called(req, server)
	return args.Error(0)
}

func (m *MockKintoCoreService) UpdateBuildStatus(ctx context.Context, req *types.UpdateBuildStatusRequest) (*types.UpdateBuildStatusResponse, error) {
	args := m.Called(ctx, req)

	err := args.Error(1)

	if err != nil {
		return nil, err
	}

	return args.Get(0).(*types.UpdateBuildStatusResponse), nil
}

func (m *MockKintoCoreService) UpdateBuildCommitSha(ctx context.Context, req *types.UpdateBuildCommitShaRequest) (*empty.Empty, error) {
	args := m.Called(ctx, req)
	err := args.Error(1)
	if err != nil {
		return nil, err
	}
	return args.Get(0).(*empty.Empty), nil
}

func (m *MockKintoCoreService) WatchBlocksHealthStatuses(req *types.EnvironmentQueryRequest, server types.KintoCoreService_WatchBlocksHealthStatusesServer) error {
	args := m.Called(req, server)
	return args.Error(0)
}

func (m *MockKintoCoreService) WatchJobsStatus(
	req *types.BlockQueryRequest, stream types.KintoCoreService_WatchJobsStatusServer) error {
	args := m.Called(req, stream)
	return args.Error(0)
}

func (m *MockKintoCoreService) WatchBlocksMetrics(req *types.BlockQueryRequest, server types.KintoCoreService_WatchBlocksMetricsServer) error {
	args := m.Called(req, server)
	return args.Error(0)
}

func (m *MockKintoCoreService) WatchConsoleLogs(req *types.WatchConsoleLogsRequest, server types.KintoCoreService_WatchConsoleLogsServer) error {
	args := m.Called(req, server)
	return args.Error(0)
}

func (m *MockKintoCoreService) GetKintoConfiguration(ctx context.Context, req *empty.Empty) (*types.KintoConfiguration, error) {
	args := m.Called(ctx, req)

	err := args.Error(1)

	if err != nil {
		return nil, err
	}

	return args.Get(0).(*types.KintoConfiguration), nil
}

func (m *MockKintoCoreService) AbortRelease(
	ctx context.Context, request *types.AbortBlockReleaseRequest) (*empty.Empty, error) {
	args := m.Called(ctx, request)

	err := args.Error(1)

	if err != nil {
		return nil, err
	}

	return args.Get(0).(*empty.Empty), nil
}

func (m *MockKintoCoreService) TagRelease(c context.Context, req *types.TagReleaseRequest) (*empty.Empty, error) {
	args := m.Called(c, req)

	err := args.Error(1)

	if err != nil {
		return nil, err
	}

	return args.Get(0).(*empty.Empty), nil
}

func (m *MockKintoCoreService) KillBlockInstance(
	ctx context.Context, req *types.KillBlockInstanceRequest) (*empty.Empty, error) {
	args := m.Called(ctx, req)

	err := args.Error(1)

	if err != nil {
		return nil, err
	}

	return args.Get(0).(*empty.Empty), nil
}

func (m *MockKintoCoreService) SuspendBlock(
	c context.Context, req *types.SuspendBlockRequest) (*types.BlockUpdateResponse, error) {

	args := m.Called(c, req)

	err := args.Error(1)

	if err != nil {
		return nil, err
	}

	return args.Get(0).(*types.BlockUpdateResponse), nil
}

func (m *MockKintoCoreService) CreateCustomDomainName(c context.Context, req *types.CustomDomainNameRequest) (*empty.Empty, error) {
	args := m.Called(c, req)

	err := args.Error(1)

	if err != nil {
		return nil, err
	}

	return args.Get(0).(*empty.Empty), nil
}

func (m *MockKintoCoreService) DeleteCustomDomainName(c context.Context, req *types.CustomDomainNameRequest) (*empty.Empty, error) {
	args := m.Called(c, req)

	err := args.Error(1)

	if err != nil {
		return nil, err
	}

	return args.Get(0).(*empty.Empty), nil
}

func (m *MockKintoCoreService) CheckCustomDomainName(c context.Context, req *types.CustomDomainNameRequest) (*types.CheckCustomDomainNameResponse, error) {
	args := m.Called(c, req)

	err := args.Error(1)

	if err != nil {
		return nil, err
	}

	return args.Get(0).(*types.CheckCustomDomainNameResponse), nil
}

func (m *MockKintoCoreService) EnablePublicURL(c context.Context, req *types.EnablePublicURLRequest) (*empty.Empty, error) {
	args := m.Called(c, req)

	err := args.Error(1)

	if err != nil {
		return nil, err
	}

	return args.Get(0).(*empty.Empty), nil
}

func (m *MockKintoCoreService) DisablePublicURL(c context.Context, req *types.DisablePublicURLRequest) (*empty.Empty, error) {
	args := m.Called(c, req)

	err := args.Error(1)

	if err != nil {
		return nil, err
	}

	return args.Get(0).(*empty.Empty), nil
}

func (m *MockKintoCoreService) StartTeleport(req *types.TeleportRequest, server types.KintoCoreService_StartTeleportServer) error {
	args := m.Called(req, server)

	return args.Error(0)
}

func (m *MockKintoCoreService) PromoteRelease(c context.Context, req *types.PromoteReleaseRequest) (*empty.Empty, error) {
	args := m.Called(c, req)

	err := args.Error(1)

	if err != nil {
		return nil, err
	}

	return args.Get(0).(*empty.Empty), nil
}

func (m *MockKintoCoreService) GenReleaseConfigFromKintoFile(
	c context.Context, req *types.GenReleaseConfigFromKintoFileRepoRequest) (*types.ReleaseConfig, error) {

	args := m.Called(c, req)

	err := args.Error(1)

	if err != nil {
		return nil, err
	}

	return args.Get(0).(*types.ReleaseConfig), nil
}

func (m *MockKintoCoreService) SyncTime(c context.Context, req *types.SyncTimeRequest) (*types.SyncTimeResponse, error) {

	args := m.Called(c, req)

	err := args.Error(1)

	if err != nil {
		return nil, err
	}

	return args.Get(0).(*types.SyncTimeResponse), nil
}
