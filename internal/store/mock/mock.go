package mock

import (
	"context"
	utilsGoServer "github.com/kintohub/utils-go/server"

	pkgTypes "github.com/kintoproj/kinto-core/pkg/types"
	"github.com/stretchr/testify/mock"
)

type MockStore struct {
	mock.Mock
}

func (m *MockStore) CreateEnvironment(env *pkgTypes.Environment) *utilsGoServer.Error {
	args := m.Called(env)
	err := args.Get(0)

	if err != nil {
		return err.(*utilsGoServer.Error)
	}

	return nil
}

func (m *MockStore) GetEnvironment(id string) (*pkgTypes.Environment, *utilsGoServer.Error) {
	args := m.Called(id)
	err := args.Get(1)

	if err != nil {
		return nil, err.(*utilsGoServer.Error)
	}

	return args.Get(0).(*pkgTypes.Environment), nil
}

func (m *MockStore) DeleteEnvironment(id string) *utilsGoServer.Error {
	args := m.Called(id)
	err := args.Get(0)

	if err != nil {
		return err.(*utilsGoServer.Error)
	}

	return nil
}

func (m *MockStore) UpsertBlock(block *pkgTypes.Block) *utilsGoServer.Error {
	args := m.Called(block)
	err := args.Get(0)

	if err != nil {
		return err.(*utilsGoServer.Error)
	}

	return nil
}

func (m *MockStore) GetBlock(name, envId string) (*pkgTypes.Block, *utilsGoServer.Error) {
	args := m.Called(name, envId)
	err := args.Get(1)

	if err != nil {
		return nil, err.(*utilsGoServer.Error)
	}

	return args.Get(0).(*pkgTypes.Block), nil
}

func (m *MockStore) GetBlocks(envId string) ([]*pkgTypes.Block, *utilsGoServer.Error) {
	args := m.Called(envId)
	err := args.Get(1)

	if err != nil {
		return nil, err.(*utilsGoServer.Error)
	}

	return args.Get(0).([]*pkgTypes.Block), nil
}

func (m *MockStore) DeleteBlock(name, envId string) *utilsGoServer.Error {
	args := m.Called(name, envId)
	err := args.Get(0)

	if err != nil {
		return err.(*utilsGoServer.Error)
	}

	return nil
}

func (m *MockStore) GetBlockHeathState(
	blockName, envId string, latestSuccessfulRelease *pkgTypes.Release) (pkgTypes.BlockStatus_State, error) {

	args := m.Called(blockName, envId, latestSuccessfulRelease)

	err := args.Get(1)

	if err != nil {
		return pkgTypes.BlockStatus_NOT_SET, err.(error)
	}

	return args.Get(0).(pkgTypes.BlockStatus_State), nil
}

func (m *MockStore) GetBlocksMetrics(name, envId string) (*pkgTypes.BlocksMetrics, *utilsGoServer.Error) {
	panic("implement me")
}

func (m *MockStore) WatchConsoleLogs(blockName, envId string, context context.Context, logsChan chan *pkgTypes.ConsoleLog) *utilsGoServer.Error {
	args := m.Called(blockName, envId, context, logsChan)
	err := args.Get(0)

	if err != nil {
		return err.(*utilsGoServer.Error)
	}

	return nil
}

func (m *MockStore) WatchBlockReleaseStatus(
	blockName, envId string, context context.Context, statusChan chan *pkgTypes.ReleasesStatus) *utilsGoServer.Error {
	args := m.Called(blockName, envId, context, statusChan)
	err := args.Get(0)

	if err != nil {
		return err.(*utilsGoServer.Error)
	}

	return nil
}

func (m *MockStore) KillBlockInstance(id, envId string) *utilsGoServer.Error {
	args := m.Called(id, envId)

	err := args.Get(0)

	if err != nil {
		return err.(*utilsGoServer.Error)
	}

	return nil
}

func (m *MockStore) EnablePublicURL(
	envId, blockName string, protocol pkgTypes.RunConfig_Protocol, hosts ...string) *utilsGoServer.Error {

	args := m.Called(envId, blockName, protocol, hosts)
	err := args.Get(0)

	if err != nil {
		return err.(*utilsGoServer.Error)
	}

	return nil
}

func (m *MockStore) DisablePublicURL(envId, blockName string) *utilsGoServer.Error {
	args := m.Called(envId, blockName)
	err := args.Get(0)

	if err != nil {
		return err.(*utilsGoServer.Error)
	}

	return nil
}

func (m *MockStore) UpsertCustomDomainNames(
	envId, blockName string,
	protocol pkgTypes.RunConfig_Protocol,
	kintoHost string, domainNames ...string) *utilsGoServer.Error {

	args := m.Called(envId, blockName, protocol, kintoHost, domainNames)
	err := args.Get(0)

	if err != nil {
		return err.(*utilsGoServer.Error)
	}

	return nil
}

func (m *MockStore) DeleteCustomDomainNames(envId, blockName, kintoHost string) *utilsGoServer.Error {
	args := m.Called(envId, blockName, kintoHost)
	err := args.Get(0)

	if err != nil {
		return err.(*utilsGoServer.Error)
	}

	return nil
}

func (m *MockStore) DoesCustomDomainExistInStore(host string) (bool, *utilsGoServer.Error) {
	args := m.Called(host)
	err := args.Get(1)

	if err != nil {
		return false, err.(*utilsGoServer.Error)
	}

	return args.Get(0).(bool), nil
}

func (m *MockStore) CheckCertificateReadiness(blockName, envId string) (bool, *utilsGoServer.Error) {
	args := m.Called(blockName, envId)
	err := args.Get(1)

	if err != nil {
		return false, err.(*utilsGoServer.Error)
	}

	return args.Get(0).(bool), nil
}

func (m *MockStore) WatchJobsStatus(
	blockName, envId string,
	ctx context.Context,
	sendClientLogs func(jobStatus *pkgTypes.JobStatus) error) *utilsGoServer.Error {

	args := m.Called(blockName, envId, ctx, sendClientLogs)
	err := args.Get(0)

	if err != nil {
		return err.(*utilsGoServer.Error)
	}

	return nil
}

func (m *MockStore) StartChiselService(ctx context.Context, envId, blockName string) (*pkgTypes.TeleportServiceData, *utilsGoServer.Error) {
	args := m.Called(ctx, envId, blockName)
	err := args.Get(1)

	if err != nil {
		return nil, err.(*utilsGoServer.Error)
	}

	return args.Get(0).(*pkgTypes.TeleportServiceData), nil
}

func (m *MockStore) StopChiselService(envId, blockName string) *utilsGoServer.Error {
	args := m.Called(envId, blockName)
	err := args.Get(0)

	if err != nil {
		return err.(*utilsGoServer.Error)
	}

	return nil
}
