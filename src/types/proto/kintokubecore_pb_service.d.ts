// package: 
// file: kintokubecore.proto

import * as kintokubecore_pb from "./kintokubecore_pb";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";
import * as kkc_models_pb from "./kkc_models_pb";
import {grpc} from "@improbable-eng/grpc-web";

type KintoKubeCoreServiceGetEnvironment = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof kintokubecore_pb.EnvironmentQueryRequest;
  readonly responseType: typeof kkc_models_pb.Environment;
};

type KintoKubeCoreServiceGetEnvironments = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof google_protobuf_empty_pb.Empty;
  readonly responseType: typeof kkc_models_pb.Environments;
};

type KintoKubeCoreServiceCreateEnvironment = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof kintokubecore_pb.CreateEnvironmentRequest;
  readonly responseType: typeof kkc_models_pb.Environment;
};

type KintoKubeCoreServiceUpdateEnvironment = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof kintokubecore_pb.UpdateEnvironmentRequest;
  readonly responseType: typeof kkc_models_pb.Environment;
};

type KintoKubeCoreServiceDeleteEnvironment = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof kintokubecore_pb.DeleteEnvironmentRequest;
  readonly responseType: typeof google_protobuf_empty_pb.Empty;
};

type KintoKubeCoreServiceCreateBlock = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof kintokubecore_pb.CreateBlockRequest;
  readonly responseType: typeof kintokubecore_pb.BlockUpdateResponse;
};

type KintoKubeCoreServiceDeployBlockUpdate = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof kintokubecore_pb.DeployBlockRequest;
  readonly responseType: typeof kintokubecore_pb.BlockUpdateResponse;
};

type KintoKubeCoreServiceTriggerDeploy = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof kintokubecore_pb.TriggerDeployRequest;
  readonly responseType: typeof kintokubecore_pb.BlockUpdateResponse;
};

type KintoKubeCoreServiceRollbackBlock = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof kintokubecore_pb.RollbackBlockRequest;
  readonly responseType: typeof kintokubecore_pb.BlockUpdateResponse;
};

type KintoKubeCoreServiceGetBlocks = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof kintokubecore_pb.BlockQueryRequest;
  readonly responseType: typeof kkc_models_pb.Blocks;
};

type KintoKubeCoreServiceGetBlock = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof kintokubecore_pb.BlockQueryRequest;
  readonly responseType: typeof kkc_models_pb.Block;
};

type KintoKubeCoreServiceDeleteBlock = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof kintokubecore_pb.DeleteBlockRequest;
  readonly responseType: typeof google_protobuf_empty_pb.Empty;
};

type KintoKubeCoreServiceSuspendBlock = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof kintokubecore_pb.SuspendBlockRequest;
  readonly responseType: typeof kintokubecore_pb.BlockUpdateResponse;
};

type KintoKubeCoreServiceWatchReleasesStatus = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof kintokubecore_pb.BlockQueryRequest;
  readonly responseType: typeof kkc_models_pb.ReleasesStatus;
};

type KintoKubeCoreServiceKillBlockInstance = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof kintokubecore_pb.KillBlockInstanceRequest;
  readonly responseType: typeof google_protobuf_empty_pb.Empty;
};

type KintoKubeCoreServiceAbortRelease = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof kintokubecore_pb.AbortBlockReleaseRequest;
  readonly responseType: typeof google_protobuf_empty_pb.Empty;
};

type KintoKubeCoreServiceTagRelease = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof kintokubecore_pb.TagReleaseRequest;
  readonly responseType: typeof google_protobuf_empty_pb.Empty;
};

type KintoKubeCoreServicePromoteRelease = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof kintokubecore_pb.PromoteReleaseRequest;
  readonly responseType: typeof google_protobuf_empty_pb.Empty;
};

type KintoKubeCoreServiceGenReleaseConfigFromKintoFile = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof kintokubecore_pb.GenReleaseConfigFromKintoFileRepoRequest;
  readonly responseType: typeof kkc_models_pb.ReleaseConfig;
};

type KintoKubeCoreServiceWatchBuildLogs = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof kintokubecore_pb.WatchBuildLogsRequest;
  readonly responseType: typeof kkc_models_pb.Logs;
};

type KintoKubeCoreServiceUpdateBuildStatus = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof kintokubecore_pb.UpdateBuildStatusRequest;
  readonly responseType: typeof kintokubecore_pb.UpdateBuildStatusResponse;
};

type KintoKubeCoreServiceUpdateBuildCommitSha = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof kintokubecore_pb.UpdateBuildCommitShaRequest;
  readonly responseType: typeof google_protobuf_empty_pb.Empty;
};

type KintoKubeCoreServiceWatchBlocksHealthStatuses = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof kintokubecore_pb.EnvironmentQueryRequest;
  readonly responseType: typeof kkc_models_pb.BlockStatuses;
};

type KintoKubeCoreServiceWatchJobsStatus = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof kintokubecore_pb.BlockQueryRequest;
  readonly responseType: typeof kkc_models_pb.JobStatus;
};

type KintoKubeCoreServiceWatchBlocksMetrics = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof kintokubecore_pb.BlockQueryRequest;
  readonly responseType: typeof kkc_models_pb.BlocksMetrics;
};

type KintoKubeCoreServiceWatchConsoleLogs = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof kintokubecore_pb.WatchConsoleLogsRequest;
  readonly responseType: typeof kkc_models_pb.ConsoleLog;
};

type KintoKubeCoreServiceGetKintoConfiguration = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof google_protobuf_empty_pb.Empty;
  readonly responseType: typeof kkc_models_pb.KintoConfiguration;
};

type KintoKubeCoreServiceCreateCustomDomainName = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof kintokubecore_pb.CustomDomainNameRequest;
  readonly responseType: typeof google_protobuf_empty_pb.Empty;
};

type KintoKubeCoreServiceDeleteCustomDomainName = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof kintokubecore_pb.CustomDomainNameRequest;
  readonly responseType: typeof google_protobuf_empty_pb.Empty;
};

type KintoKubeCoreServiceCheckCustomDomainName = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof kintokubecore_pb.CustomDomainNameRequest;
  readonly responseType: typeof kintokubecore_pb.CheckCustomDomainNameResponse;
};

type KintoKubeCoreServiceEnablePublicURL = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof kintokubecore_pb.EnablePublicURLRequest;
  readonly responseType: typeof google_protobuf_empty_pb.Empty;
};

type KintoKubeCoreServiceDisablePublicURL = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof kintokubecore_pb.DisablePublicURLRequest;
  readonly responseType: typeof google_protobuf_empty_pb.Empty;
};

type KintoKubeCoreServiceStartTeleport = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof kintokubecore_pb.TeleportRequest;
  readonly responseType: typeof kintokubecore_pb.TeleportResponse;
};

type KintoKubeCoreServiceSyncTime = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof kintokubecore_pb.SyncTimeRequest;
  readonly responseType: typeof kintokubecore_pb.SyncTimeResponse;
};

export class KintoKubeCoreService {
  static readonly serviceName: string;
  static readonly GetEnvironment: KintoKubeCoreServiceGetEnvironment;
  static readonly GetEnvironments: KintoKubeCoreServiceGetEnvironments;
  static readonly CreateEnvironment: KintoKubeCoreServiceCreateEnvironment;
  static readonly UpdateEnvironment: KintoKubeCoreServiceUpdateEnvironment;
  static readonly DeleteEnvironment: KintoKubeCoreServiceDeleteEnvironment;
  static readonly CreateBlock: KintoKubeCoreServiceCreateBlock;
  static readonly DeployBlockUpdate: KintoKubeCoreServiceDeployBlockUpdate;
  static readonly TriggerDeploy: KintoKubeCoreServiceTriggerDeploy;
  static readonly RollbackBlock: KintoKubeCoreServiceRollbackBlock;
  static readonly GetBlocks: KintoKubeCoreServiceGetBlocks;
  static readonly GetBlock: KintoKubeCoreServiceGetBlock;
  static readonly DeleteBlock: KintoKubeCoreServiceDeleteBlock;
  static readonly SuspendBlock: KintoKubeCoreServiceSuspendBlock;
  static readonly WatchReleasesStatus: KintoKubeCoreServiceWatchReleasesStatus;
  static readonly KillBlockInstance: KintoKubeCoreServiceKillBlockInstance;
  static readonly AbortRelease: KintoKubeCoreServiceAbortRelease;
  static readonly TagRelease: KintoKubeCoreServiceTagRelease;
  static readonly PromoteRelease: KintoKubeCoreServicePromoteRelease;
  static readonly GenReleaseConfigFromKintoFile: KintoKubeCoreServiceGenReleaseConfigFromKintoFile;
  static readonly WatchBuildLogs: KintoKubeCoreServiceWatchBuildLogs;
  static readonly UpdateBuildStatus: KintoKubeCoreServiceUpdateBuildStatus;
  static readonly UpdateBuildCommitSha: KintoKubeCoreServiceUpdateBuildCommitSha;
  static readonly WatchBlocksHealthStatuses: KintoKubeCoreServiceWatchBlocksHealthStatuses;
  static readonly WatchJobsStatus: KintoKubeCoreServiceWatchJobsStatus;
  static readonly WatchBlocksMetrics: KintoKubeCoreServiceWatchBlocksMetrics;
  static readonly WatchConsoleLogs: KintoKubeCoreServiceWatchConsoleLogs;
  static readonly GetKintoConfiguration: KintoKubeCoreServiceGetKintoConfiguration;
  static readonly CreateCustomDomainName: KintoKubeCoreServiceCreateCustomDomainName;
  static readonly DeleteCustomDomainName: KintoKubeCoreServiceDeleteCustomDomainName;
  static readonly CheckCustomDomainName: KintoKubeCoreServiceCheckCustomDomainName;
  static readonly EnablePublicURL: KintoKubeCoreServiceEnablePublicURL;
  static readonly DisablePublicURL: KintoKubeCoreServiceDisablePublicURL;
  static readonly StartTeleport: KintoKubeCoreServiceStartTeleport;
  static readonly SyncTime: KintoKubeCoreServiceSyncTime;
}

export type ServiceError = { message: string, code: number; metadata: grpc.Metadata }
export type Status = { details: string, code: number; metadata: grpc.Metadata }

interface UnaryResponse {
  cancel(): void;
}
interface ResponseStream<T> {
  cancel(): void;
  on(type: 'data', handler: (message: T) => void): ResponseStream<T>;
  on(type: 'end', handler: (status?: Status) => void): ResponseStream<T>;
  on(type: 'status', handler: (status: Status) => void): ResponseStream<T>;
}
interface RequestStream<T> {
  write(message: T): RequestStream<T>;
  end(): void;
  cancel(): void;
  on(type: 'end', handler: (status?: Status) => void): RequestStream<T>;
  on(type: 'status', handler: (status: Status) => void): RequestStream<T>;
}
interface BidirectionalStream<ReqT, ResT> {
  write(message: ReqT): BidirectionalStream<ReqT, ResT>;
  end(): void;
  cancel(): void;
  on(type: 'data', handler: (message: ResT) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'end', handler: (status?: Status) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'status', handler: (status: Status) => void): BidirectionalStream<ReqT, ResT>;
}

export class KintoKubeCoreServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  getEnvironment(
    requestMessage: kintokubecore_pb.EnvironmentQueryRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: kkc_models_pb.Environment|null) => void
  ): UnaryResponse;
  getEnvironment(
    requestMessage: kintokubecore_pb.EnvironmentQueryRequest,
    callback: (error: ServiceError|null, responseMessage: kkc_models_pb.Environment|null) => void
  ): UnaryResponse;
  getEnvironments(
    requestMessage: google_protobuf_empty_pb.Empty,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: kkc_models_pb.Environments|null) => void
  ): UnaryResponse;
  getEnvironments(
    requestMessage: google_protobuf_empty_pb.Empty,
    callback: (error: ServiceError|null, responseMessage: kkc_models_pb.Environments|null) => void
  ): UnaryResponse;
  createEnvironment(
    requestMessage: kintokubecore_pb.CreateEnvironmentRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: kkc_models_pb.Environment|null) => void
  ): UnaryResponse;
  createEnvironment(
    requestMessage: kintokubecore_pb.CreateEnvironmentRequest,
    callback: (error: ServiceError|null, responseMessage: kkc_models_pb.Environment|null) => void
  ): UnaryResponse;
  updateEnvironment(
    requestMessage: kintokubecore_pb.UpdateEnvironmentRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: kkc_models_pb.Environment|null) => void
  ): UnaryResponse;
  updateEnvironment(
    requestMessage: kintokubecore_pb.UpdateEnvironmentRequest,
    callback: (error: ServiceError|null, responseMessage: kkc_models_pb.Environment|null) => void
  ): UnaryResponse;
  deleteEnvironment(
    requestMessage: kintokubecore_pb.DeleteEnvironmentRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  deleteEnvironment(
    requestMessage: kintokubecore_pb.DeleteEnvironmentRequest,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  createBlock(
    requestMessage: kintokubecore_pb.CreateBlockRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: kintokubecore_pb.BlockUpdateResponse|null) => void
  ): UnaryResponse;
  createBlock(
    requestMessage: kintokubecore_pb.CreateBlockRequest,
    callback: (error: ServiceError|null, responseMessage: kintokubecore_pb.BlockUpdateResponse|null) => void
  ): UnaryResponse;
  deployBlockUpdate(
    requestMessage: kintokubecore_pb.DeployBlockRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: kintokubecore_pb.BlockUpdateResponse|null) => void
  ): UnaryResponse;
  deployBlockUpdate(
    requestMessage: kintokubecore_pb.DeployBlockRequest,
    callback: (error: ServiceError|null, responseMessage: kintokubecore_pb.BlockUpdateResponse|null) => void
  ): UnaryResponse;
  triggerDeploy(
    requestMessage: kintokubecore_pb.TriggerDeployRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: kintokubecore_pb.BlockUpdateResponse|null) => void
  ): UnaryResponse;
  triggerDeploy(
    requestMessage: kintokubecore_pb.TriggerDeployRequest,
    callback: (error: ServiceError|null, responseMessage: kintokubecore_pb.BlockUpdateResponse|null) => void
  ): UnaryResponse;
  rollbackBlock(
    requestMessage: kintokubecore_pb.RollbackBlockRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: kintokubecore_pb.BlockUpdateResponse|null) => void
  ): UnaryResponse;
  rollbackBlock(
    requestMessage: kintokubecore_pb.RollbackBlockRequest,
    callback: (error: ServiceError|null, responseMessage: kintokubecore_pb.BlockUpdateResponse|null) => void
  ): UnaryResponse;
  getBlocks(
    requestMessage: kintokubecore_pb.BlockQueryRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: kkc_models_pb.Blocks|null) => void
  ): UnaryResponse;
  getBlocks(
    requestMessage: kintokubecore_pb.BlockQueryRequest,
    callback: (error: ServiceError|null, responseMessage: kkc_models_pb.Blocks|null) => void
  ): UnaryResponse;
  getBlock(
    requestMessage: kintokubecore_pb.BlockQueryRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: kkc_models_pb.Block|null) => void
  ): UnaryResponse;
  getBlock(
    requestMessage: kintokubecore_pb.BlockQueryRequest,
    callback: (error: ServiceError|null, responseMessage: kkc_models_pb.Block|null) => void
  ): UnaryResponse;
  deleteBlock(
    requestMessage: kintokubecore_pb.DeleteBlockRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  deleteBlock(
    requestMessage: kintokubecore_pb.DeleteBlockRequest,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  suspendBlock(
    requestMessage: kintokubecore_pb.SuspendBlockRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: kintokubecore_pb.BlockUpdateResponse|null) => void
  ): UnaryResponse;
  suspendBlock(
    requestMessage: kintokubecore_pb.SuspendBlockRequest,
    callback: (error: ServiceError|null, responseMessage: kintokubecore_pb.BlockUpdateResponse|null) => void
  ): UnaryResponse;
  watchReleasesStatus(requestMessage: kintokubecore_pb.BlockQueryRequest, metadata?: grpc.Metadata): ResponseStream<kkc_models_pb.ReleasesStatus>;
  killBlockInstance(
    requestMessage: kintokubecore_pb.KillBlockInstanceRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  killBlockInstance(
    requestMessage: kintokubecore_pb.KillBlockInstanceRequest,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  abortRelease(
    requestMessage: kintokubecore_pb.AbortBlockReleaseRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  abortRelease(
    requestMessage: kintokubecore_pb.AbortBlockReleaseRequest,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  tagRelease(
    requestMessage: kintokubecore_pb.TagReleaseRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  tagRelease(
    requestMessage: kintokubecore_pb.TagReleaseRequest,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  promoteRelease(
    requestMessage: kintokubecore_pb.PromoteReleaseRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  promoteRelease(
    requestMessage: kintokubecore_pb.PromoteReleaseRequest,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  genReleaseConfigFromKintoFile(
    requestMessage: kintokubecore_pb.GenReleaseConfigFromKintoFileRepoRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: kkc_models_pb.ReleaseConfig|null) => void
  ): UnaryResponse;
  genReleaseConfigFromKintoFile(
    requestMessage: kintokubecore_pb.GenReleaseConfigFromKintoFileRepoRequest,
    callback: (error: ServiceError|null, responseMessage: kkc_models_pb.ReleaseConfig|null) => void
  ): UnaryResponse;
  watchBuildLogs(requestMessage: kintokubecore_pb.WatchBuildLogsRequest, metadata?: grpc.Metadata): ResponseStream<kkc_models_pb.Logs>;
  updateBuildStatus(
    requestMessage: kintokubecore_pb.UpdateBuildStatusRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: kintokubecore_pb.UpdateBuildStatusResponse|null) => void
  ): UnaryResponse;
  updateBuildStatus(
    requestMessage: kintokubecore_pb.UpdateBuildStatusRequest,
    callback: (error: ServiceError|null, responseMessage: kintokubecore_pb.UpdateBuildStatusResponse|null) => void
  ): UnaryResponse;
  updateBuildCommitSha(
    requestMessage: kintokubecore_pb.UpdateBuildCommitShaRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  updateBuildCommitSha(
    requestMessage: kintokubecore_pb.UpdateBuildCommitShaRequest,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  watchBlocksHealthStatuses(requestMessage: kintokubecore_pb.EnvironmentQueryRequest, metadata?: grpc.Metadata): ResponseStream<kkc_models_pb.BlockStatuses>;
  watchJobsStatus(requestMessage: kintokubecore_pb.BlockQueryRequest, metadata?: grpc.Metadata): ResponseStream<kkc_models_pb.JobStatus>;
  watchBlocksMetrics(requestMessage: kintokubecore_pb.BlockQueryRequest, metadata?: grpc.Metadata): ResponseStream<kkc_models_pb.BlocksMetrics>;
  watchConsoleLogs(requestMessage: kintokubecore_pb.WatchConsoleLogsRequest, metadata?: grpc.Metadata): ResponseStream<kkc_models_pb.ConsoleLog>;
  getKintoConfiguration(
    requestMessage: google_protobuf_empty_pb.Empty,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: kkc_models_pb.KintoConfiguration|null) => void
  ): UnaryResponse;
  getKintoConfiguration(
    requestMessage: google_protobuf_empty_pb.Empty,
    callback: (error: ServiceError|null, responseMessage: kkc_models_pb.KintoConfiguration|null) => void
  ): UnaryResponse;
  createCustomDomainName(
    requestMessage: kintokubecore_pb.CustomDomainNameRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  createCustomDomainName(
    requestMessage: kintokubecore_pb.CustomDomainNameRequest,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  deleteCustomDomainName(
    requestMessage: kintokubecore_pb.CustomDomainNameRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  deleteCustomDomainName(
    requestMessage: kintokubecore_pb.CustomDomainNameRequest,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  checkCustomDomainName(
    requestMessage: kintokubecore_pb.CustomDomainNameRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: kintokubecore_pb.CheckCustomDomainNameResponse|null) => void
  ): UnaryResponse;
  checkCustomDomainName(
    requestMessage: kintokubecore_pb.CustomDomainNameRequest,
    callback: (error: ServiceError|null, responseMessage: kintokubecore_pb.CheckCustomDomainNameResponse|null) => void
  ): UnaryResponse;
  enablePublicURL(
    requestMessage: kintokubecore_pb.EnablePublicURLRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  enablePublicURL(
    requestMessage: kintokubecore_pb.EnablePublicURLRequest,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  disablePublicURL(
    requestMessage: kintokubecore_pb.DisablePublicURLRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  disablePublicURL(
    requestMessage: kintokubecore_pb.DisablePublicURLRequest,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  startTeleport(requestMessage: kintokubecore_pb.TeleportRequest, metadata?: grpc.Metadata): ResponseStream<kintokubecore_pb.TeleportResponse>;
  syncTime(
    requestMessage: kintokubecore_pb.SyncTimeRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: kintokubecore_pb.SyncTimeResponse|null) => void
  ): UnaryResponse;
  syncTime(
    requestMessage: kintokubecore_pb.SyncTimeRequest,
    callback: (error: ServiceError|null, responseMessage: kintokubecore_pb.SyncTimeResponse|null) => void
  ): UnaryResponse;
}

