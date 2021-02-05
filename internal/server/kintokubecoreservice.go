package server

import (
	"context"
	"fmt"
	"net"
	"time"

	"github.com/golang/protobuf/ptypes/empty"
	"github.com/kintohub/utils-go/klog"
	utilsGoServer "github.com/kintohub/utils-go/server"
	utilsGoGrpc "github.com/kintohub/utils-go/server/grpc"
	"github.com/kintoproj/kinto-core/internal/config"
	"github.com/kintoproj/kinto-core/internal/controller"
	"github.com/kintoproj/kinto-core/pkg/types"
	"github.com/rs/zerolog/log"
	"google.golang.org/grpc"
)

type KintoCoreService struct {
	controller controller.ControllerInterface
}

func NewKintoCoreService(
	controller controller.ControllerInterface,
) *KintoCoreService {

	return &KintoCoreService{
		controller: controller,
	}
}

func (k *KintoCoreService) RegisterToServer(s *grpc.Server) {
	types.RegisterKintoCoreServiceServer(s, k)
}

func (k *KintoCoreService) GetEnvironment(
	c context.Context, req *types.EnvironmentQueryRequest) (*types.Environment, error) {
	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		return nil, err
	}

	env, err := k.controller.GetEnvironment(req.Id)

	if err != nil {
		return nil, utilsGoGrpc.ConvertToGrpcError(c, err)
	}

	return env, nil
}

func (k *KintoCoreService) GetEnvironments(
	c context.Context, empty *empty.Empty) (*types.Environments, error) {

	env, err := k.controller.GetEnvironments()

	if err != nil {
		return nil, utilsGoGrpc.ConvertToGrpcError(c, err)
	}

	return env, nil
}

func (k *KintoCoreService) CreateEnvironment(
	c context.Context, req *types.CreateEnvironmentRequest) (*types.Environment, error) {
	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		return nil, err
	}
	env, err := k.controller.CreateEnvironment(req.Name)

	if err != nil {
		return nil, utilsGoGrpc.ConvertToGrpcError(c, err)
	}

	return env, nil
}

func (k *KintoCoreService) UpdateEnvironment(
	c context.Context, req *types.UpdateEnvironmentRequest) (*types.Environment, error) {
	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		return nil, err
	}

	env, err := k.controller.UpdateEnvironment(req.Id, req.Name)

	if err != nil {
		return nil, utilsGoGrpc.ConvertToGrpcError(c, err)
	}

	return env, nil
}

func (k *KintoCoreService) DeleteEnvironment(
	c context.Context, req *types.DeleteEnvironmentRequest) (*empty.Empty, error) {
	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		return nil, err
	}

	err := k.controller.DeleteEnvironment(req.Id)

	if err != nil {
		return nil, utilsGoGrpc.ConvertToGrpcError(c, err)
	}

	return &empty.Empty{}, nil
}

func (k *KintoCoreService) CreateBlock(
	c context.Context, req *types.CreateBlockRequest) (*types.BlockUpdateResponse, error) {
	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		return nil, err
	}

	blockName, releaseId, err := k.controller.CreateBlock(
		req.EnvId,
		req.Name,
		req.BuildConfig,
		req.RunConfig,
	)

	if err != nil {
		return nil, utilsGoGrpc.ConvertToGrpcError(c, err)
	}

	return &types.BlockUpdateResponse{
		Name:      blockName,
		ReleaseId: releaseId,
	}, nil
}

func (k *KintoCoreService) DeployBlockUpdate(
	c context.Context, req *types.DeployBlockRequest) (*types.BlockUpdateResponse, error) {
	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		return nil, err
	}

	blockName, releaseId, err := k.controller.DeployBlockUpdate(
		req.Name,
		req.EnvId,
		req.BaseReleaseId,
		req.BuildConfig,
		req.RunConfig,
	)

	if err != nil {
		return nil, utilsGoGrpc.ConvertToGrpcError(c, err)
	}

	return &types.BlockUpdateResponse{
		Name:      blockName,
		ReleaseId: releaseId,
	}, nil
}

func (k *KintoCoreService) TriggerDeploy(
	c context.Context, req *types.TriggerDeployRequest) (*types.BlockUpdateResponse, error) {
	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		return nil, err
	}

	blockName, releaseId, err := k.controller.TriggerDeploy(
		req.Name,
		req.EnvId)

	if err != nil {
		return nil, utilsGoGrpc.ConvertToGrpcError(c, err)
	}

	return &types.BlockUpdateResponse{
		Name:      blockName,
		ReleaseId: releaseId,
	}, nil
}

func (k *KintoCoreService) RollbackBlock(
	c context.Context, req *types.RollbackBlockRequest) (*types.BlockUpdateResponse, error) {
	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		return nil, err
	}

	blockName, releaseId, err := k.controller.RollbackBlock(req.Name, req.EnvId, req.ReleaseId)

	if err != nil {
		return nil, utilsGoGrpc.ConvertToGrpcError(c, err)
	}

	return &types.BlockUpdateResponse{
		Name:      blockName,
		ReleaseId: releaseId,
	}, nil
}

func (k *KintoCoreService) GetBlocks(c context.Context, req *types.BlockQueryRequest) (*types.Blocks, error) {
	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		return nil, err
	}

	blocks, err := k.controller.GetBlocks(req.EnvId)

	if err != nil {
		return nil, utilsGoGrpc.ConvertToGrpcError(c, err)
	}

	return blocks, nil
}

func (k *KintoCoreService) GetBlock(c context.Context, req *types.BlockQueryRequest) (*types.Block, error) {
	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		return nil, err
	}

	block, err := k.controller.GetBlock(req.Name, req.EnvId)

	if err != nil {
		return nil, utilsGoGrpc.ConvertToGrpcError(c, err)
	}

	return block, nil
}

func (k *KintoCoreService) DeleteBlock(c context.Context, req *types.DeleteBlockRequest) (*empty.Empty, error) {
	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		return nil, err
	}

	err := k.controller.DeleteBlock(req.Name, req.EnvId)

	if err != nil {
		return nil, utilsGoGrpc.ConvertToGrpcError(c, err)
	}

	return &empty.Empty{}, nil
}

func (k *KintoCoreService) SuspendBlock(
	c context.Context, req *types.SuspendBlockRequest) (*types.BlockUpdateResponse, error) {

	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		return nil, err
	}

	blockName, releaseID, err := k.controller.SuspendBlock(req.Name, req.EnvId)

	if err != nil {
		return nil, utilsGoGrpc.ConvertToGrpcError(c, err)
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

	err := k.controller.WatchBuildLogs(req.ReleaseId, req.BlockName, req.EnvId, stream.Context(), logsChan)
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

	err := k.controller.WatchConsoleLogs(req.BlockName, req.EnvId, stream.Context(), logsChan)

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
	c context.Context, req *types.UpdateBuildStatusRequest) (*types.UpdateBuildStatusResponse, error) {
	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		log.Err(err).Msgf("Error validating UpdateBuildStatusRequest in UpdateBuildStatus")
		return nil, err
	}

	release, err := k.controller.UpdateBuildStatus(req.ReleaseId, req.BlockName, req.EnvId, req.Status.State)

	if err != nil {
		return nil, utilsGoGrpc.ConvertToGrpcError(c, err)
	}

	return &types.UpdateBuildStatusResponse{
		Id: release.Id,
	}, nil
}

func (k *KintoCoreService) UpdateBuildCommitSha(c context.Context, req *types.UpdateBuildCommitShaRequest) (*empty.Empty, error) {
	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		klog.ErrorWithErr(err, "Error validating UpdateBuildCommitShaRequest in UpdateBuildCommitSha")
		return nil, err
	}

	err := k.controller.UpdateBuildCommitSha(req.ReleaseId, req.BlockName, req.EnvId, req.CommitSha)
	if err != nil {
		return nil, utilsGoGrpc.ConvertToGrpcError(c, err)
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

		response, err := k.controller.GetBlocksHealthStatus(req.Id)

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

	err := k.controller.WatchJobsStatus(
		req.Name, req.EnvId,
		stream.Context(),
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

		response, err := k.controller.GetBlocksMetrics(req.Name, req.EnvId)

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

	err := k.controller.WatchReleasesStatus(req.Name, req.EnvId, stream.Context(), statusChan)

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
	c context.Context, empty *empty.Empty) (*types.KintoConfiguration, error) {

	return k.controller.GetKintoConfiguration()
}

func (k *KintoCoreService) KillBlockInstance(
	c context.Context, req *types.KillBlockInstanceRequest) (*empty.Empty, error) {
	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		return nil, err
	}

	err := k.controller.KillBlockInstance(req.Id, req.EnvId)

	if err != nil {
		return nil, utilsGoGrpc.ConvertToGrpcError(c, err)
	}

	return &empty.Empty{}, nil
}

func (k *KintoCoreService) AbortRelease(c context.Context, req *types.AbortBlockReleaseRequest) (*empty.Empty, error) {
	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		return nil, err
	}

	err := k.controller.AbortRelease(c, req.BlockName, req.ReleaseId, req.EnvId)

	if err != nil {
		return nil, utilsGoGrpc.ConvertToGrpcError(c, err)
	}

	return &empty.Empty{}, nil
}

func (k *KintoCoreService) TagRelease(c context.Context, req *types.TagReleaseRequest) (*empty.Empty, error) {
	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		return nil, err
	}

	err := k.controller.TagRelease(req.Tag, req.BlockName, req.EnvId, req.ReleaseId)
	if err != nil {
		return nil, utilsGoGrpc.ConvertToGrpcError(c, err)
	}

	return &empty.Empty{}, nil
}

func (k *KintoCoreService) PromoteRelease(c context.Context, req *types.PromoteReleaseRequest) (*empty.Empty, error) {
	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		return nil, err
	}
	err := k.controller.PromoteRelease(req.Tag, req.ReleaseId, req.BlockName, req.EnvId, req.TargetEnvId)
	if err != nil {
		return nil, utilsGoGrpc.ConvertToGrpcError(c, err)
	}
	return &empty.Empty{}, nil
}

func (k *KintoCoreService) CreateCustomDomainName(c context.Context, req *types.CustomDomainNameRequest) (*empty.Empty, error) {
	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		return nil, err
	}

	if err := k.controller.CreateCustomDomainName(req.BlockName, req.EnvId, req.CustomDomainName, req.Protocol); err != nil {
		return nil, utilsGoGrpc.ConvertToGrpcError(c, err)
	}

	return &empty.Empty{}, nil
}

func (k *KintoCoreService) DeleteCustomDomainName(c context.Context, req *types.CustomDomainNameRequest) (*empty.Empty, error) {
	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		return nil, err
	}

	if err := k.controller.DeleteCustomDomainName(req.BlockName, req.EnvId, req.CustomDomainName, req.Protocol); err != nil {
		return nil, utilsGoGrpc.ConvertToGrpcError(c, err)
	}

	return &empty.Empty{}, nil
}

func (k *KintoCoreService) CheckCustomDomainName(c context.Context, req *types.CustomDomainNameRequest) (*types.CheckCustomDomainNameResponse, error) {
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
		IsCertificateReady: k.controller.CheckCertificateReadiness(req.BlockName, req.EnvId),
	}, nil
}

func (k *KintoCoreService) EnablePublicURL(c context.Context, req *types.EnablePublicURLRequest) (*empty.Empty, error) {
	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		return nil, err
	}

	if err := k.controller.EnableExternalURL(req.BlockName, req.EnvId, req.ReleaseId); err != nil {
		return nil, utilsGoGrpc.ConvertToGrpcError(c, err)
	}

	return &empty.Empty{}, nil
}

func (k *KintoCoreService) DisablePublicURL(c context.Context, req *types.DisablePublicURLRequest) (*empty.Empty, error) {
	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		return nil, err
	}

	if err := k.controller.DisableExternalURL(req.BlockName, req.EnvId); err != nil {
		return nil, utilsGoGrpc.ConvertToGrpcError(c, err)
	}

	return &empty.Empty{}, nil
}

func (k *KintoCoreService) StartTeleport(req *types.TeleportRequest, stream types.KintoCoreService_StartTeleportServer) error {
	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		return err
	}

	data, uErr := k.controller.StartTeleport(stream.Context(), req.EnvId, req.BlockName)

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

			err := k.controller.StopTeleport(req.EnvId, req.BlockName)

			if err != nil {
				return utilsGoGrpc.ConvertToGrpcError(stream.Context(), err)
			}

			return nil
		}
	}
}

func (k *KintoCoreService) GenReleaseConfigFromKintoFile(
	c context.Context, req *types.GenReleaseConfigFromKintoFileRepoRequest) (*types.ReleaseConfig, error) {

	if err := utilsGoGrpc.ValidateGrpcRequest(req); err != nil {
		return nil, err
	}

	releaseConfig, err := k.controller.GenReleaseConfigFromKintoFile(
		req.Org, req.Repo, req.Branch, req.EnvId, req.GithubUserToken, req.BlockType)
	if err != nil {
		return nil, utilsGoGrpc.ConvertToGrpcError(c, err)
	}

	return releaseConfig, nil
}

func (k *KintoCoreService) SyncTime(ctx context.Context, req *types.SyncTimeRequest) (*types.SyncTimeResponse, error) {
	return &types.SyncTimeResponse{
		ClientTimestampMs: req.SendTimeMs,
		ServerTimestampMs: time.Now().UnixNano() / 1e6,
	}, nil
}
