package server

import (
	"context"
	"fmt"
	"net"
	"time"

	"github.com/golang/protobuf/ptypes/empty"
	"github.com/kintoproj/go-utils/klog"
	utilsGoServer "github.com/kintoproj/go-utils/server"
	utilsGoGrpc "github.com/kintoproj/go-utils/server/grpc"
	"github.com/kintoproj/kintohub/core/internal/config"
	"github.com/kintoproj/kintohub/core/internal/middleware"
	"github.com/kintoproj/kintohub/core/pkg/types"
	"github.com/rs/zerolog/log"
	"google.golang.org/grpc"
)

type KintoCoreService struct {
	middleware middleware.Interface
}

func NewKintoCoreService(middleware middleware.Interface) *KintoCoreService {
	return &KintoCoreService{
		middleware: middleware,
	}
}

func (k *KintoCoreService) RegisterToServer(s *grpc.Server) {
	types.RegisterKintoCoreServiceServer(s, k)
}

func (k *KintoCoreService) GetEnvironment(
	ctx context.Context, req *types.EnvironmentQueryRequest) (*types.Environment, error) {
	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		return nil, err
	}

	env, err := k.middleware.GetEnvironment(ctx, req.Id)

	if err != nil {
		return nil, utilsGoGrpc.ConvertToGrpcError(ctx, err)
	}

	return env, nil
}

func (k *KintoCoreService) GetEnvironments(
	ctx context.Context, empty *empty.Empty) (*types.Environments, error) {
	env, err := k.middleware.GetEnvironments(ctx)

	if err != nil {
		return nil, utilsGoGrpc.ConvertToGrpcError(ctx, err)
	}

	return env, nil
}

func (k *KintoCoreService) CreateEnvironment(
	ctx context.Context, req *types.CreateEnvironmentRequest) (*types.Environment, error) {
	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		return nil, err
	}
	env, err := k.middleware.CreateEnvironment(ctx, req.Name)

	if err != nil {
		return nil, utilsGoGrpc.ConvertToGrpcError(ctx, err)
	}

	return env, nil
}

func (k *KintoCoreService) UpdateEnvironment(
	ctx context.Context, req *types.UpdateEnvironmentRequest) (*types.Environment, error) {
	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		return nil, err
	}

	env, err := k.middleware.UpdateEnvironment(ctx, req.Id, req.Name)

	if err != nil {
		return nil, utilsGoGrpc.ConvertToGrpcError(ctx, err)
	}

	return env, nil
}

func (k *KintoCoreService) DeleteEnvironment(
	ctx context.Context, req *types.DeleteEnvironmentRequest) (*empty.Empty, error) {
	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		return nil, err
	}

	err := k.middleware.DeleteEnvironment(ctx, req.Id)

	if err != nil {
		return nil, utilsGoGrpc.ConvertToGrpcError(ctx, err)
	}

	return &empty.Empty{}, nil
}

func (k *KintoCoreService) CreateBlock(
	ctx context.Context, req *types.CreateBlockRequest) (*types.BlockUpdateResponse, error) {
	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		return nil, err
	}

	blockName, releaseId, err := k.middleware.CreateBlock(
		ctx, req.EnvId, req.Name, req.BuildConfig, req.RunConfig)

	if err != nil {
		return nil, utilsGoGrpc.ConvertToGrpcError(ctx, err)
	}

	return &types.BlockUpdateResponse{
		Name:      blockName,
		ReleaseId: releaseId,
	}, nil
}

func (k *KintoCoreService) DeployBlockUpdate(
	ctx context.Context, req *types.DeployBlockRequest) (*types.BlockUpdateResponse, error) {
	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		return nil, err
	}

	blockName, releaseId, err := k.middleware.DeployBlockUpdate(
		ctx, req.Name, req.EnvId, req.BaseReleaseId, req.BuildConfig, req.RunConfig)

	if err != nil {
		return nil, utilsGoGrpc.ConvertToGrpcError(ctx, err)
	}

	return &types.BlockUpdateResponse{
		Name:      blockName,
		ReleaseId: releaseId,
	}, nil
}

func (k *KintoCoreService) TriggerDeploy(
	ctx context.Context, req *types.TriggerDeployRequest) (*types.BlockUpdateResponse, error) {
	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		return nil, err
	}

	blockName, releaseId, err := k.middleware.TriggerDeploy(ctx, req.Name, req.EnvId)

	if err != nil {
		return nil, utilsGoGrpc.ConvertToGrpcError(ctx, err)
	}

	return &types.BlockUpdateResponse{
		Name:      blockName,
		ReleaseId: releaseId,
	}, nil
}

func (k *KintoCoreService) RollbackBlock(
	ctx context.Context, req *types.RollbackBlockRequest) (*types.BlockUpdateResponse, error) {
	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		return nil, err
	}

	blockName, releaseId, err := k.middleware.RollbackBlock(ctx, req.Name, req.EnvId, req.ReleaseId)

	if err != nil {
		return nil, utilsGoGrpc.ConvertToGrpcError(ctx, err)
	}

	return &types.BlockUpdateResponse{
		Name:      blockName,
		ReleaseId: releaseId,
	}, nil
}

func (k *KintoCoreService) GetBlocks(ctx context.Context, req *types.BlockQueryRequest) (*types.Blocks, error) {
	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		return nil, err
	}

	blocks, err := k.middleware.GetBlocks(ctx, req.EnvId)

	if err != nil {
		return nil, utilsGoGrpc.ConvertToGrpcError(ctx, err)
	}

	return blocks, nil
}

func (k *KintoCoreService) GetBlock(ctx context.Context, req *types.BlockQueryRequest) (*types.Block, error) {
	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		return nil, err
	}

	block, err := k.middleware.GetBlock(ctx, req.Name, req.EnvId)

	if err != nil {
		return nil, utilsGoGrpc.ConvertToGrpcError(ctx, err)
	}

	return block, nil
}

func (k *KintoCoreService) DeleteBlock(ctx context.Context, req *types.DeleteBlockRequest) (*empty.Empty, error) {
	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		return nil, err
	}

	err := k.middleware.DeleteBlock(ctx, req.Name, req.EnvId)

	if err != nil {
		return nil, utilsGoGrpc.ConvertToGrpcError(ctx, err)
	}

	return &empty.Empty{}, nil
}

func (k *KintoCoreService) SuspendBlock(
	ctx context.Context, req *types.SuspendBlockRequest) (*types.BlockUpdateResponse, error) {

	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		return nil, err
	}

	blockName, releaseID, err := k.middleware.SuspendBlock(ctx, req.Name, req.EnvId)

	if err != nil {
		return nil, utilsGoGrpc.ConvertToGrpcError(ctx, err)
	}

	return &types.BlockUpdateResponse{
		Name:      blockName,
		ReleaseId: releaseID,
	}, nil
}

func (k *KintoCoreService) WatchBuildLogs(
	req *types.WatchBuildLogsRequest, stream types.KintoCoreService_WatchBuildLogsServer) error {

	// TODO: this is a hacky fix until we have a proper refactoring on whole channel system
	// make(chan *types.Logs) => make(chan *types.Logs, 1)
	// this is because the channel with default size 0 are blocked for writing unless someone is reading
	// Closed by store/kube/logs.go
	logsChan := make(chan *types.Logs, 1)

	err := k.middleware.WatchBuildLogs(stream.Context(), req.ReleaseId, req.BlockName, req.EnvId, logsChan)
	if err != nil {
		return utilsGoGrpc.ConvertToGrpcError(stream.Context(), err)
	}

	for {
		logs, more := <-logsChan

		if !more {
			return nil
		} else {
			err := stream.Send(logs)

			if err != nil {
				return err
			}
		}
	}
}

func (k *KintoCoreService) WatchConsoleLogs(
	req *types.WatchConsoleLogsRequest, stream types.KintoCoreService_WatchConsoleLogsServer) error {
	logsChan := make(chan *types.ConsoleLog)

	err := k.middleware.WatchConsoleLogs(stream.Context(), req.BlockName, req.EnvId, logsChan)

	if err != nil {
		return utilsGoGrpc.ConvertToGrpcError(stream.Context(), err)
	}

	for {
		logs, more := <-logsChan

		if !more {
			return nil
		} else {
			err := stream.Send(logs)

			if err != nil {
				return err
			}
		}
	}
}

func (k *KintoCoreService) UpdateBuildStatus(
	ctx context.Context, req *types.UpdateBuildStatusRequest) (*types.UpdateBuildStatusResponse, error) {
	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		log.Err(err).Msgf("Error validating UpdateBuildStatusRequest in UpdateBuildStatus")
		return nil, err
	}

	release, err := k.middleware.UpdateBuildStatus(ctx, req.ReleaseId, req.BlockName, req.EnvId, req.Status.State)

	if err != nil {
		return nil, utilsGoGrpc.ConvertToGrpcError(ctx, err)
	}

	return &types.UpdateBuildStatusResponse{
		Id: release.Id,
	}, nil
}

func (k *KintoCoreService) UpdateBuildCommitSha(ctx context.Context, req *types.UpdateBuildCommitShaRequest) (*empty.Empty, error) {
	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		klog.ErrorWithErr(err, "Error validating UpdateBuildCommitShaRequest in UpdateBuildCommitSha")
		return nil, err
	}

	err := k.middleware.UpdateBuildCommitSha(ctx, req.ReleaseId, req.BlockName, req.EnvId, req.CommitSha)
	if err != nil {
		return nil, utilsGoGrpc.ConvertToGrpcError(ctx, err)
	}

	return &empty.Empty{}, nil
}

func (k *KintoCoreService) WatchBlocksHealthStatuses(
	req *types.EnvironmentQueryRequest, stream types.KintoCoreService_WatchBlocksHealthStatusesServer) error {

	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		return err
	}

	for {
		if stream.Context().Err() != nil {
			log.Ctx(stream.Context()).Debug().Msg("client no longer listening to block health status... exiting")
			return nil
		}

		response, err := k.middleware.GetBlocksHealthStatus(stream.Context(), req.Id)

		if err != nil {
			return utilsGoGrpc.ConvertToGrpcError(stream.Context(), err)
		}

		streamErr := stream.Send(response)

		if streamErr != nil {
			log.Ctx(stream.Context()).Debug().Err(streamErr).Msgf(
				"could not send data to client. probably disconnected?!")
			return nil
		}

		time.Sleep(time.Duration(config.HealthUpdateTickSeconds) * time.Second)
	}
}

func (k *KintoCoreService) WatchJobsStatus(
	req *types.BlockQueryRequest, stream types.KintoCoreService_WatchJobsStatusServer) error {
	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		return err
	}

	err := k.middleware.WatchJobsStatus(
		stream.Context(), req.Name, req.EnvId,
		func(jobStatus *types.JobStatus) error {
			return stream.Send(jobStatus)
		},
	)

	if err != nil {
		return utilsGoGrpc.ConvertToGrpcError(stream.Context(), err)
	}

	return nil
}

func (k *KintoCoreService) WatchBlocksMetrics(
	req *types.BlockQueryRequest, stream types.KintoCoreService_WatchBlocksMetricsServer) error {
	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		return err
	}

	for {
		if stream.Context().Err() != nil {
			log.Ctx(stream.Context()).Debug().Msgf(
				"client no longer listening to block metrics... exiting")
			return nil
		}

		response, err := k.middleware.GetBlocksMetrics(stream.Context(), req.Name, req.EnvId)

		if err != nil {
			return utilsGoGrpc.ConvertToGrpcError(stream.Context(), err)
		}

		streamErr := stream.Send(response)

		if streamErr != nil {
			log.Ctx(stream.Context()).Debug().Err(streamErr).Msgf(
				"could not send data to client. probably disconnected?!")
			return nil
		}

		time.Sleep(time.Duration(config.MetricsUpdateTickSeconds) * time.Second)
	}
}

func (k *KintoCoreService) WatchReleasesStatus(
	req *types.BlockQueryRequest, stream types.KintoCoreService_WatchReleasesStatusServer) error {
	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		return err
	}

	// this channel will be close in the below function internal/store/*/release/WatchReleasesStatus
	statusChan := make(chan *types.ReleasesStatus)

	err := k.middleware.WatchReleasesStatus(stream.Context(), req.Name, req.EnvId, statusChan)

	if err != nil {
		close(statusChan)
		return utilsGoGrpc.ConvertToGrpcError(stream.Context(), err)
	}

	for {
		status, more := <-statusChan

		if !more {
			return nil
		} else {
			err := stream.Send(status)

			if err != nil {
				return err
			}
		}
	}
}

func (k *KintoCoreService) GetKintoConfiguration(
	ctx context.Context, empty *empty.Empty) (*types.KintoConfiguration, error) {

	return k.middleware.GetKintoConfiguration(ctx)
}

func (k *KintoCoreService) KillBlockInstance(
	ctx context.Context, req *types.KillBlockInstanceRequest) (*empty.Empty, error) {
	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		return nil, err
	}

	err := k.middleware.KillBlockInstance(ctx, req.Id, req.EnvId)

	if err != nil {
		return nil, utilsGoGrpc.ConvertToGrpcError(ctx, err)
	}

	return &empty.Empty{}, nil
}

func (k *KintoCoreService) AbortRelease(ctx context.Context, req *types.AbortBlockReleaseRequest) (*empty.Empty, error) {
	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		return nil, err
	}

	err := k.middleware.AbortRelease(ctx, req.BlockName, req.ReleaseId, req.EnvId)

	if err != nil {
		return nil, utilsGoGrpc.ConvertToGrpcError(ctx, err)
	}

	return &empty.Empty{}, nil
}

func (k *KintoCoreService) TagRelease(ctx context.Context, req *types.TagReleaseRequest) (*empty.Empty, error) {
	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		return nil, err
	}

	err := k.middleware.TagRelease(ctx, req.Tag, req.BlockName, req.EnvId, req.ReleaseId)
	if err != nil {
		return nil, utilsGoGrpc.ConvertToGrpcError(ctx, err)
	}

	return &empty.Empty{}, nil
}

func (k *KintoCoreService) PromoteRelease(ctx context.Context, req *types.PromoteReleaseRequest) (*empty.Empty, error) {
	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		return nil, err
	}
	err := k.middleware.PromoteRelease(ctx, req.Tag, req.ReleaseId, req.BlockName, req.EnvId, req.TargetEnvId)
	if err != nil {
		return nil, utilsGoGrpc.ConvertToGrpcError(ctx, err)
	}
	return &empty.Empty{}, nil
}

func (k *KintoCoreService) CreateCustomDomainName(ctx context.Context, req *types.CustomDomainNameRequest) (*empty.Empty, error) {
	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		return nil, err
	}

	if err := k.middleware.CreateCustomDomainName(ctx, req.BlockName, req.EnvId, req.CustomDomainName, req.Protocol); err != nil {
		return nil, utilsGoGrpc.ConvertToGrpcError(ctx, err)
	}

	return &empty.Empty{}, nil
}

func (k *KintoCoreService) DeleteCustomDomainName(ctx context.Context, req *types.CustomDomainNameRequest) (*empty.Empty, error) {
	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		return nil, err
	}

	if err := k.middleware.DeleteCustomDomainName(ctx, req.BlockName, req.EnvId, req.CustomDomainName, req.Protocol); err != nil {
		return nil, utilsGoGrpc.ConvertToGrpcError(ctx, err)
	}

	return &empty.Empty{}, nil
}

func (k *KintoCoreService) CheckCustomDomainName(ctx context.Context, req *types.CustomDomainNameRequest) (*types.CheckCustomDomainNameResponse, error) {
	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		return nil, err
	}

	cname, err := net.LookupCNAME(req.CustomDomainName)

	if err != nil {
		log.Error().Err(err).Msgf("Could not lookup domain name %s", req.CustomDomainName)
	}

	return &types.CheckCustomDomainNameResponse{
		IsCNAMEOK:          fmt.Sprintf("%s.", req.CNAME) == cname,
		CNAMEWanted:        req.CNAME,
		CNAMEFound:         cname,
		IsCertificateReady: k.middleware.CheckCertificateReadiness(ctx, req.BlockName, req.EnvId),
	}, nil
}

func (k *KintoCoreService) EnablePublicURL(ctx context.Context, req *types.EnablePublicURLRequest) (*empty.Empty, error) {
	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		return nil, err
	}

	if err := k.middleware.EnableExternalURL(ctx, req.BlockName, req.EnvId, req.ReleaseId); err != nil {
		return nil, utilsGoGrpc.ConvertToGrpcError(ctx, err)
	}

	return &empty.Empty{}, nil
}

func (k *KintoCoreService) DisablePublicURL(ctx context.Context, req *types.DisablePublicURLRequest) (*empty.Empty, error) {
	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		return nil, err
	}

	if err := k.middleware.DisableExternalURL(ctx, req.BlockName, req.EnvId); err != nil {
		return nil, utilsGoGrpc.ConvertToGrpcError(ctx, err)
	}

	return &empty.Empty{}, nil
}

func (k *KintoCoreService) StartTeleport(req *types.TeleportRequest, stream types.KintoCoreService_StartTeleportServer) error {
	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		return err
	}

	data, uErr := k.middleware.StartTeleport(stream.Context(), req.EnvId, req.BlockName)

	if uErr != nil {
		return utilsGoGrpc.ConvertToGrpcError(stream.Context(), uErr)
	}

	err := stream.Send(&types.TeleportResponse{
		Data: data,
	})

	if err != nil {
		return utilsGoGrpc.ConvertToGrpcError(
			stream.Context(), utilsGoServer.NewInternalErrorWithErr("can't initiate teleport stream", err))
	}

	for {
		if stream.Context().Err() != nil {
			log.Ctx(stream.Context()).Debug().Msgf("client has closed teleport cli connection")

			err := k.middleware.StopTeleport(stream.Context(), req.EnvId, req.BlockName)

			if err != nil {
				return utilsGoGrpc.ConvertToGrpcError(stream.Context(), err)
			}

			return nil
		}
	}
}

func (k *KintoCoreService) GenReleaseConfigFromKintoFile(
	ctx context.Context, req *types.GenReleaseConfigFromKintoFileRepoRequest) (*types.ReleaseConfig, error) {

	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		return nil, err
	}

	releaseConfig, err := k.middleware.GenReleaseConfigFromKintoFile(
		ctx, req.Org, req.Repo, req.Branch, req.EnvId, req.GithubUserToken, req.BlockType)
	if err != nil {
		return nil, utilsGoGrpc.ConvertToGrpcError(ctx, err)
	}

	return releaseConfig, nil
}

func (k *KintoCoreService) SyncTime(ctx context.Context, req *types.SyncTimeRequest) (*types.SyncTimeResponse, error) {
	return &types.SyncTimeResponse{
		ClientTimestampMs: req.SendTimeMs,
		ServerTimestampMs: time.Now().UnixNano() / 1e6,
	}, nil
}
