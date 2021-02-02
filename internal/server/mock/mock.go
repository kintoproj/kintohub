package mock

import (
	"github.com/golang/protobuf/ptypes/empty"
	"github.com/kintohub/kinto-core/pkg/types"
	"github.com/stretchr/testify/mock"
	"golang.org/x/net/context"
	"google.golang.org/grpc"
)

type MockKintoKubeCoreService struct {
	mock.Mock
}

func (m *MockKintoKubeCoreService) GetServiceInfo() grpc.ServiceInfo {
	server := grpc.NewServer()
	types.RegisterKintoKubeCoreServiceServer(server, m)
	return server.GetServiceInfo()["KintoKubeCoreService"]
}

func (m *MockKintoKubeCoreService) GetEnvironment(ctx context.Context, req *types.EnvironmentQueryRequest) (*types.Environment, error) {
	args := m.Called(ctx, req)

	err := args.Error(1)

	if err != nil {
		return nil, err
	}

	return args.Get(0).(*types.Environment), nil
}

func (m *MockKintoKubeCoreService) GetEnvironments(ctx context.Context, empty *empty.Empty) (*types.Environments, error) {
	args := m.Called(ctx, empty)

	err := args.Error(1)

	if err != nil {
		return nil, err
	}

	return args.Get(0).(*types.Environments), nil
}

func (m *MockKintoKubeCoreService) UpdateEnvironment(ctx context.Context, req *types.UpdateEnvironmentRequest) (*types.Environment, error) {
	args := m.Called(ctx, req)

	err := args.Error(1)

	if err != nil {
		return nil, err
	}

	return args.Get(0).(*types.Environment), nil
}

func (m *MockKintoKubeCoreService) CreateEnvironment(ctx context.Context, req *types.CreateEnvironmentRequest) (*types.Environment, error) {
	args := m.Called(ctx, req)

	err := args.Error(1)

	if err != nil {
		return nil, err
	}

	return args.Get(0).(*types.Environment), nil
}

func (m *MockKintoKubeCoreService) DeleteEnvironment(ctx context.Context, req *types.DeleteEnvironmentRequest) (*empty.Empty, error) {
	args := m.Called(ctx, req)

	err := args.Error(1)

	if err != nil {
		return nil, err
	}

	return args.Get(0).(*empty.Empty), nil
}

func (m *MockKintoKubeCoreService) CreateBlock(ctx context.Context, req *types.CreateBlockRequest) (*types.BlockUpdateResponse, error) {
	args := m.Called(ctx, req)

	err := args.Error(1)

	if err != nil {
		return nil, err
	}

	return args.Get(0).(*types.BlockUpdateResponse), nil
}

func (m *MockKintoKubeCoreService) TriggerDeploy(
	c context.Context, req *types.TriggerDeployRequest) (*types.BlockUpdateResponse, error) {
	args := m.Called(c, req)

	err := args.Error(1)

	if err != nil {
		return nil, err
	}

	return args.Get(0).(*types.BlockUpdateResponse), nil
}

func (m *MockKintoKubeCoreService) DeployBlockUpdate(ctx context.Context, req *types.DeployBlockRequest) (*types.BlockUpdateResponse, error) {
	args := m.Called(ctx, req)

	err := args.Error(1)

	if err != nil {
		return nil, err
	}

	return args.Get(0).(*types.BlockUpdateResponse), nil
}

func (m *MockKintoKubeCoreService) RollbackBlock(ctx context.Context, req *types.RollbackBlockRequest) (*types.BlockUpdateResponse, error) {
	args := m.Called(ctx, req)

	err := args.Error(1)

	if err != nil {
		return nil, err
	}

	return args.Get(0).(*types.BlockUpdateResponse), nil
}

func (m *MockKintoKubeCoreService) GetBlocks(ctx context.Context, req *types.BlockQueryRequest) (*types.Blocks, error) {
	args := m.Called(ctx, req)

	err := args.Error(1)

	if err != nil {
		return nil, err
	}

	return args.Get(0).(*types.Blocks), nil
}

func (m *MockKintoKubeCoreService) GetBlock(ctx context.Context, req *types.BlockQueryRequest) (*types.Block, error) {
	args := m.Called(ctx, req)

	err := args.Error(1)

	if err != nil {
		return nil, err
	}

	return args.Get(0).(*types.Block), nil
}

func (m *MockKintoKubeCoreService) DeleteBlock(ctx context.Context, req *types.DeleteBlockRequest) (*empty.Empty, error) {
	args := m.Called(ctx, req)

	err := args.Error(1)

	if err != nil {
		return nil, err
	}

	return args.Get(0).(*empty.Empty), nil
}

func (m *MockKintoKubeCoreService) WatchReleasesStatus(req *types.BlockQueryRequest, server types.KintoKubeCoreService_WatchReleasesStatusServer) error {
	args := m.Called(req, server)
	return args.Error(0)
}

func (m *MockKintoKubeCoreService) WatchBuildLogs(req *types.WatchBuildLogsRequest, server types.KintoKubeCoreService_WatchBuildLogsServer) error {
	args := m.Called(req, server)
	return args.Error(0)
}

func (m *MockKintoKubeCoreService) UpdateBuildStatus(ctx context.Context, req *types.UpdateBuildStatusRequest) (*types.UpdateBuildStatusResponse, error) {
	args := m.Called(ctx, req)

	err := args.Error(1)

	if err != nil {
		return nil, err
	}

	return args.Get(0).(*types.UpdateBuildStatusResponse), nil
}

func (m *MockKintoKubeCoreService) UpdateBuildCommitSha(ctx context.Context, req *types.UpdateBuildCommitShaRequest) (*empty.Empty, error) {
	args := m.Called(ctx, req)
	err := args.Error(1)
	if err != nil {
		return nil, err
	}
	return args.Get(0).(*empty.Empty), nil
}

func (m *MockKintoKubeCoreService) WatchBlocksHealthStatuses(req *types.EnvironmentQueryRequest, server types.KintoKubeCoreService_WatchBlocksHealthStatusesServer) error {
	args := m.Called(req, server)
	return args.Error(0)
}

func (m *MockKintoKubeCoreService) WatchJobsStatus(
	req *types.BlockQueryRequest, stream types.KintoKubeCoreService_WatchJobsStatusServer) error {
	args := m.Called(req, stream)
	return args.Error(0)
}

func (m *MockKintoKubeCoreService) WatchBlocksMetrics(req *types.BlockQueryRequest, server types.KintoKubeCoreService_WatchBlocksMetricsServer) error {
	args := m.Called(req, server)
	return args.Error(0)
}

func (m *MockKintoKubeCoreService) WatchConsoleLogs(req *types.WatchConsoleLogsRequest, server types.KintoKubeCoreService_WatchConsoleLogsServer) error {
	args := m.Called(req, server)
	return args.Error(0)
}

func (m *MockKintoKubeCoreService) GetKintoConfiguration(ctx context.Context, req *empty.Empty) (*types.KintoConfiguration, error) {
	args := m.Called(ctx, req)

	err := args.Error(1)

	if err != nil {
		return nil, err
	}

	return args.Get(0).(*types.KintoConfiguration), nil
}

func (m *MockKintoKubeCoreService) AbortRelease(
	ctx context.Context, request *types.AbortBlockReleaseRequest) (*empty.Empty, error) {
	args := m.Called(ctx, request)

	err := args.Error(1)

	if err != nil {
		return nil, err
	}

	return args.Get(0).(*empty.Empty), nil
}

func (m *MockKintoKubeCoreService) TagRelease(c context.Context, req *types.TagReleaseRequest) (*empty.Empty, error) {
	args := m.Called(c, req)

	err := args.Error(1)

	if err != nil {
		return nil, err
	}

	return args.Get(0).(*empty.Empty), nil
}

func (m *MockKintoKubeCoreService) KillBlockInstance(
	ctx context.Context, req *types.KillBlockInstanceRequest) (*empty.Empty, error) {
	args := m.Called(ctx, req)

	err := args.Error(1)

	if err != nil {
		return nil, err
	}

	return args.Get(0).(*empty.Empty), nil
}

func (m *MockKintoKubeCoreService) SuspendBlock(
	c context.Context, req *types.SuspendBlockRequest) (*types.BlockUpdateResponse, error) {

	args := m.Called(c, req)

	err := args.Error(1)

	if err != nil {
		return nil, err
	}

	return args.Get(0).(*types.BlockUpdateResponse), nil
}

func (m *MockKintoKubeCoreService) CreateCustomDomainName(c context.Context, req *types.CustomDomainNameRequest) (*empty.Empty, error) {
	args := m.Called(c, req)

	err := args.Error(1)

	if err != nil {
		return nil, err
	}

	return args.Get(0).(*empty.Empty), nil
}

func (m *MockKintoKubeCoreService) DeleteCustomDomainName(c context.Context, req *types.CustomDomainNameRequest) (*empty.Empty, error) {
	args := m.Called(c, req)

	err := args.Error(1)

	if err != nil {
		return nil, err
	}

	return args.Get(0).(*empty.Empty), nil
}

func (m *MockKintoKubeCoreService) CheckCustomDomainName(c context.Context, req *types.CustomDomainNameRequest) (*types.CheckCustomDomainNameResponse, error) {
	args := m.Called(c, req)

	err := args.Error(1)

	if err != nil {
		return nil, err
	}

	return args.Get(0).(*types.CheckCustomDomainNameResponse), nil
}

func (m *MockKintoKubeCoreService) EnablePublicURL(c context.Context, req *types.EnablePublicURLRequest) (*empty.Empty, error) {
	args := m.Called(c, req)

	err := args.Error(1)

	if err != nil {
		return nil, err
	}

	return args.Get(0).(*empty.Empty), nil
}

func (m *MockKintoKubeCoreService) DisablePublicURL(c context.Context, req *types.DisablePublicURLRequest) (*empty.Empty, error) {
	args := m.Called(c, req)

	err := args.Error(1)

	if err != nil {
		return nil, err
	}

	return args.Get(0).(*empty.Empty), nil
}

func (m *MockKintoKubeCoreService) StartTeleport(req *types.TeleportRequest, server types.KintoKubeCoreService_StartTeleportServer) error {
	args := m.Called(req, server)

	return args.Error(0)
}

func (m *MockKintoKubeCoreService) PromoteRelease(c context.Context, req *types.PromoteReleaseRequest) (*empty.Empty, error) {
	args := m.Called(c, req)

	err := args.Error(1)

	if err != nil {
		return nil, err
	}

	return args.Get(0).(*empty.Empty), nil
}

func (m *MockKintoKubeCoreService) GenReleaseConfigFromKintoFile(
	c context.Context, req *types.GenReleaseConfigFromKintoFileRepoRequest) (*types.ReleaseConfig, error) {

	args := m.Called(c, req)

	err := args.Error(1)

	if err != nil {
		return nil, err
	}

	return args.Get(0).(*types.ReleaseConfig), nil
}

func (m *MockKintoKubeCoreService) SyncTime(c context.Context, req *types.SyncTimeRequest) (*types.SyncTimeResponse, error) {

	args := m.Called(c, req)

	err := args.Error(1)

	if err != nil {
		return nil, err
	}

	return args.Get(0).(*types.SyncTimeResponse), nil
}
