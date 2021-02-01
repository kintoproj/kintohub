package build

import (
	"context"
	"github.com/kintohub/kinto-kube-core/pkg/types"
	utilsGoServer "github.com/kintohub/utils-go/server"
)

type BuildClientInterface interface {
	BuildAndDeployRelease(req *types.BuildAndDeployRequest) (*types.WorkflowResponse, *utilsGoServer.Error)
	DeployRelease(req *types.DeployRequest) (*types.WorkflowResponse, *utilsGoServer.Error)
	DeployReleaseFromCatalog(req *types.DeployCatalogRequest) (*types.WorkflowResponse, *utilsGoServer.Error)
	UndeployRelease(req *types.UndeployRequest) (*types.WorkflowResponse, *utilsGoServer.Error)
	SuspendRelease(req *types.SuspendRequest) (*types.WorkflowResponse, *utilsGoServer.Error)
	GetLogs(ctx context.Context, buildId string) ([]byte, *utilsGoServer.Error)
	RunWatchLogs(ctx context.Context, buildId string, sendClientLogs func(data []byte) error) *utilsGoServer.Error
	AbortRelease(ctx context.Context, buildId string) *utilsGoServer.Error
}
