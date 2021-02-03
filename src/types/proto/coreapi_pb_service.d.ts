// package: 
// file: coreapi.proto

import * as coreapi_pb from "./coreapi_pb";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";
import * as models_pb from "./models_pb";
import {grpc} from "@improbable-eng/grpc-web";

type KintoKubeCoreServiceGetEnvironment = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof coreapi_pb.EnvironmentQueryRequest;
  readonly responseType: typeof models_pb.Environment;
};

type KintoKubeCoreServiceGetEnvironments = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof google_protobuf_empty_pb.Empty;
  readonly responseType: typeof models_pb.Environments;
};

type KintoKubeCoreServiceCreateEnvironment = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof coreapi_pb.CreateEnvironmentRequest;
  readonly responseType: typeof models_pb.Environment;
};

type KintoKubeCoreServiceUpdateEnvironment = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof coreapi_pb.UpdateEnvironmentRequest;
  readonly responseType: typeof models_pb.Environment;
};

type KintoKubeCoreServiceDeleteEnvironment = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof coreapi_pb.DeleteEnvironmentRequest;
  readonly responseType: typeof google_protobuf_empty_pb.Empty;
};

type KintoKubeCoreServiceCreateBlock = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof coreapi_pb.CreateBlockRequest;
  readonly responseType: typeof coreapi_pb.BlockUpdateResponse;
};

type KintoKubeCoreServiceDeployBlockUpdate = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof coreapi_pb.DeployBlockRequest;
  readonly responseType: typeof coreapi_pb.BlockUpdateResponse;
};

type KintoKubeCoreServiceTriggerDeploy = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof coreapi_pb.TriggerDeployRequest;
  readonly responseType: typeof coreapi_pb.BlockUpdateResponse;
};

type KintoKubeCoreServiceRollbackBlock = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof coreapi_pb.RollbackBlockRequest;
  readonly responseType: typeof coreapi_pb.BlockUpdateResponse;
};

type KintoKubeCoreServiceGetBlocks = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof coreapi_pb.BlockQueryRequest;
  readonly responseType: typeof models_pb.Blocks;
};

type KintoKubeCoreServiceGetBlock = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof coreapi_pb.BlockQueryRequest;
  readonly responseType: typeof models_pb.Block;
};

type KintoKubeCoreServiceDeleteBlock = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof coreapi_pb.DeleteBlockRequest;
  readonly responseType: typeof google_protobuf_empty_pb.Empty;
};

type KintoKubeCoreServiceSuspendBlock = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof coreapi_pb.SuspendBlockRequest;
  readonly responseType: typeof coreapi_pb.BlockUpdateResponse;
};

type KintoKubeCoreServiceWatchReleasesStatus = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof coreapi_pb.BlockQueryRequest;
  readonly responseType: typeof models_pb.ReleasesStatus;
};

type KintoKubeCoreServiceKillBlockInstance = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof coreapi_pb.KillBlockInstanceRequest;
  readonly responseType: typeof google_protobuf_empty_pb.Empty;
};

type KintoKubeCoreServiceAbortRelease = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof coreapi_pb.AbortBlockReleaseRequest;
  readonly responseType: typeof google_protobuf_empty_pb.Empty;
};

type KintoKubeCoreServiceTagRelease = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof coreapi_pb.TagReleaseRequest;
  readonly responseType: typeof google_protobuf_empty_pb.Empty;
};

type KintoKubeCoreServicePromoteRelease = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof coreapi_pb.PromoteReleaseRequest;
  readonly responseType: typeof google_protobuf_empty_pb.Empty;
};

type KintoKubeCoreServiceGenReleaseConfigFromKintoFile = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof coreapi_pb.GenReleaseConfigFromKintoFileRepoRequest;
  readonly responseType: typeof models_pb.ReleaseConfig;
};

type KintoKubeCoreServiceWatchBuildLogs = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof coreapi_pb.WatchBuildLogsRequest;
  readonly responseType: typeof models_pb.Logs;
};

type KintoKubeCoreServiceUpdateBuildStatus = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof coreapi_pb.UpdateBuildStatusRequest;
  readonly responseType: typeof coreapi_pb.UpdateBuildStatusResponse;
};

type KintoKubeCoreServiceUpdateBuildCommitSha = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof coreapi_pb.UpdateBuildCommitShaRequest;
  readonly responseType: typeof google_protobuf_empty_pb.Empty;
};

type KintoKubeCoreServiceWatchBlocksHealthStatuses = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof coreapi_pb.EnvironmentQueryRequest;
  readonly responseType: typeof models_pb.BlockStatuses;
};

type KintoKubeCoreServiceWatchJobsStatus = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof coreapi_pb.BlockQueryRequest;
  readonly responseType: typeof models_pb.JobStatus;
};

type KintoKubeCoreServiceWatchBlocksMetrics = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof coreapi_pb.BlockQueryRequest;
  readonly responseType: typeof models_pb.BlocksMetrics;
};

type KintoKubeCoreServiceWatchConsoleLogs = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof coreapi_pb.WatchConsoleLogsRequest;
  readonly responseType: typeof models_pb.ConsoleLog;
};

type KintoKubeCoreServiceGetKintoConfiguration = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof google_protobuf_empty_pb.Empty;
  readonly responseType: typeof models_pb.KintoConfiguration;
};

type KintoKubeCoreServiceCreateCustomDomainName = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof coreapi_pb.CustomDomainNameRequest;
  readonly responseType: typeof google_protobuf_empty_pb.Empty;
};

type KintoKubeCoreServiceDeleteCustomDomainName = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof coreapi_pb.CustomDomainNameRequest;
  readonly responseType: typeof google_protobuf_empty_pb.Empty;
};

type KintoKubeCoreServiceCheckCustomDomainName = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof coreapi_pb.CustomDomainNameRequest;
  readonly responseType: typeof coreapi_pb.CheckCustomDomainNameResponse;
};

type KintoKubeCoreServiceEnablePublicURL = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof coreapi_pb.EnablePublicURLRequest;
  readonly responseType: typeof google_protobuf_empty_pb.Empty;
};

type KintoKubeCoreServiceDisablePublicURL = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof coreapi_pb.DisablePublicURLRequest;
  readonly responseType: typeof google_protobuf_empty_pb.Empty;
};

type KintoKubeCoreServiceStartTeleport = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof coreapi_pb.TeleportRequest;
  readonly responseType: typeof coreapi_pb.TeleportResponse;
};

type KintoKubeCoreServiceSyncTime = {
  readonly methodName: string;
  readonly service: typeof KintoKubeCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof coreapi_pb.SyncTimeRequest;
  readonly responseType: typeof coreapi_pb.SyncTimeResponse;
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
    requestMessage: coreapi_pb.EnvironmentQueryRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: models_pb.Environment|null) => void
  ): UnaryResponse;
  getEnvironment(
    requestMessage: coreapi_pb.EnvironmentQueryRequest,
    callback: (error: ServiceError|null, responseMessage: models_pb.Environment|null) => void
  ): UnaryResponse;
  getEnvironments(
    requestMessage: google_protobuf_empty_pb.Empty,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: models_pb.Environments|null) => void
  ): UnaryResponse;
  getEnvironments(
    requestMessage: google_protobuf_empty_pb.Empty,
    callback: (error: ServiceError|null, responseMessage: models_pb.Environments|null) => void
  ): UnaryResponse;
  createEnvironment(
    requestMessage: coreapi_pb.CreateEnvironmentRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: models_pb.Environment|null) => void
  ): UnaryResponse;
  createEnvironment(
    requestMessage: coreapi_pb.CreateEnvironmentRequest,
    callback: (error: ServiceError|null, responseMessage: models_pb.Environment|null) => void
  ): UnaryResponse;
  updateEnvironment(
    requestMessage: coreapi_pb.UpdateEnvironmentRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: models_pb.Environment|null) => void
  ): UnaryResponse;
  updateEnvironment(
    requestMessage: coreapi_pb.UpdateEnvironmentRequest,
    callback: (error: ServiceError|null, responseMessage: models_pb.Environment|null) => void
  ): UnaryResponse;
  deleteEnvironment(
    requestMessage: coreapi_pb.DeleteEnvironmentRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  deleteEnvironment(
    requestMessage: coreapi_pb.DeleteEnvironmentRequest,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  createBlock(
    requestMessage: coreapi_pb.CreateBlockRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: coreapi_pb.BlockUpdateResponse|null) => void
  ): UnaryResponse;
  createBlock(
    requestMessage: coreapi_pb.CreateBlockRequest,
    callback: (error: ServiceError|null, responseMessage: coreapi_pb.BlockUpdateResponse|null) => void
  ): UnaryResponse;
  deployBlockUpdate(
    requestMessage: coreapi_pb.DeployBlockRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: coreapi_pb.BlockUpdateResponse|null) => void
  ): UnaryResponse;
  deployBlockUpdate(
    requestMessage: coreapi_pb.DeployBlockRequest,
    callback: (error: ServiceError|null, responseMessage: coreapi_pb.BlockUpdateResponse|null) => void
  ): UnaryResponse;
  triggerDeploy(
    requestMessage: coreapi_pb.TriggerDeployRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: coreapi_pb.BlockUpdateResponse|null) => void
  ): UnaryResponse;
  triggerDeploy(
    requestMessage: coreapi_pb.TriggerDeployRequest,
    callback: (error: ServiceError|null, responseMessage: coreapi_pb.BlockUpdateResponse|null) => void
  ): UnaryResponse;
  rollbackBlock(
    requestMessage: coreapi_pb.RollbackBlockRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: coreapi_pb.BlockUpdateResponse|null) => void
  ): UnaryResponse;
  rollbackBlock(
    requestMessage: coreapi_pb.RollbackBlockRequest,
    callback: (error: ServiceError|null, responseMessage: coreapi_pb.BlockUpdateResponse|null) => void
  ): UnaryResponse;
  getBlocks(
    requestMessage: coreapi_pb.BlockQueryRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: models_pb.Blocks|null) => void
  ): UnaryResponse;
  getBlocks(
    requestMessage: coreapi_pb.BlockQueryRequest,
    callback: (error: ServiceError|null, responseMessage: models_pb.Blocks|null) => void
  ): UnaryResponse;
  getBlock(
    requestMessage: coreapi_pb.BlockQueryRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: models_pb.Block|null) => void
  ): UnaryResponse;
  getBlock(
    requestMessage: coreapi_pb.BlockQueryRequest,
    callback: (error: ServiceError|null, responseMessage: models_pb.Block|null) => void
  ): UnaryResponse;
  deleteBlock(
    requestMessage: coreapi_pb.DeleteBlockRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  deleteBlock(
    requestMessage: coreapi_pb.DeleteBlockRequest,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  suspendBlock(
    requestMessage: coreapi_pb.SuspendBlockRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: coreapi_pb.BlockUpdateResponse|null) => void
  ): UnaryResponse;
  suspendBlock(
    requestMessage: coreapi_pb.SuspendBlockRequest,
    callback: (error: ServiceError|null, responseMessage: coreapi_pb.BlockUpdateResponse|null) => void
  ): UnaryResponse;
  watchReleasesStatus(requestMessage: coreapi_pb.BlockQueryRequest, metadata?: grpc.Metadata): ResponseStream<models_pb.ReleasesStatus>;
  killBlockInstance(
    requestMessage: coreapi_pb.KillBlockInstanceRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  killBlockInstance(
    requestMessage: coreapi_pb.KillBlockInstanceRequest,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  abortRelease(
    requestMessage: coreapi_pb.AbortBlockReleaseRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  abortRelease(
    requestMessage: coreapi_pb.AbortBlockReleaseRequest,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  tagRelease(
    requestMessage: coreapi_pb.TagReleaseRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  tagRelease(
    requestMessage: coreapi_pb.TagReleaseRequest,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  promoteRelease(
    requestMessage: coreapi_pb.PromoteReleaseRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  promoteRelease(
    requestMessage: coreapi_pb.PromoteReleaseRequest,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  genReleaseConfigFromKintoFile(
    requestMessage: coreapi_pb.GenReleaseConfigFromKintoFileRepoRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: models_pb.ReleaseConfig|null) => void
  ): UnaryResponse;
  genReleaseConfigFromKintoFile(
    requestMessage: coreapi_pb.GenReleaseConfigFromKintoFileRepoRequest,
    callback: (error: ServiceError|null, responseMessage: models_pb.ReleaseConfig|null) => void
  ): UnaryResponse;
  watchBuildLogs(requestMessage: coreapi_pb.WatchBuildLogsRequest, metadata?: grpc.Metadata): ResponseStream<models_pb.Logs>;
  updateBuildStatus(
    requestMessage: coreapi_pb.UpdateBuildStatusRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: coreapi_pb.UpdateBuildStatusResponse|null) => void
  ): UnaryResponse;
  updateBuildStatus(
    requestMessage: coreapi_pb.UpdateBuildStatusRequest,
    callback: (error: ServiceError|null, responseMessage: coreapi_pb.UpdateBuildStatusResponse|null) => void
  ): UnaryResponse;
  updateBuildCommitSha(
    requestMessage: coreapi_pb.UpdateBuildCommitShaRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  updateBuildCommitSha(
    requestMessage: coreapi_pb.UpdateBuildCommitShaRequest,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  watchBlocksHealthStatuses(requestMessage: coreapi_pb.EnvironmentQueryRequest, metadata?: grpc.Metadata): ResponseStream<models_pb.BlockStatuses>;
  watchJobsStatus(requestMessage: coreapi_pb.BlockQueryRequest, metadata?: grpc.Metadata): ResponseStream<models_pb.JobStatus>;
  watchBlocksMetrics(requestMessage: coreapi_pb.BlockQueryRequest, metadata?: grpc.Metadata): ResponseStream<models_pb.BlocksMetrics>;
  watchConsoleLogs(requestMessage: coreapi_pb.WatchConsoleLogsRequest, metadata?: grpc.Metadata): ResponseStream<models_pb.ConsoleLog>;
  getKintoConfiguration(
    requestMessage: google_protobuf_empty_pb.Empty,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: models_pb.KintoConfiguration|null) => void
  ): UnaryResponse;
  getKintoConfiguration(
    requestMessage: google_protobuf_empty_pb.Empty,
    callback: (error: ServiceError|null, responseMessage: models_pb.KintoConfiguration|null) => void
  ): UnaryResponse;
  createCustomDomainName(
    requestMessage: coreapi_pb.CustomDomainNameRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  createCustomDomainName(
    requestMessage: coreapi_pb.CustomDomainNameRequest,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  deleteCustomDomainName(
    requestMessage: coreapi_pb.CustomDomainNameRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  deleteCustomDomainName(
    requestMessage: coreapi_pb.CustomDomainNameRequest,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  checkCustomDomainName(
    requestMessage: coreapi_pb.CustomDomainNameRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: coreapi_pb.CheckCustomDomainNameResponse|null) => void
  ): UnaryResponse;
  checkCustomDomainName(
    requestMessage: coreapi_pb.CustomDomainNameRequest,
    callback: (error: ServiceError|null, responseMessage: coreapi_pb.CheckCustomDomainNameResponse|null) => void
  ): UnaryResponse;
  enablePublicURL(
    requestMessage: coreapi_pb.EnablePublicURLRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  enablePublicURL(
    requestMessage: coreapi_pb.EnablePublicURLRequest,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  disablePublicURL(
    requestMessage: coreapi_pb.DisablePublicURLRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  disablePublicURL(
    requestMessage: coreapi_pb.DisablePublicURLRequest,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  startTeleport(requestMessage: coreapi_pb.TeleportRequest, metadata?: grpc.Metadata): ResponseStream<coreapi_pb.TeleportResponse>;
  syncTime(
    requestMessage: coreapi_pb.SyncTimeRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: coreapi_pb.SyncTimeResponse|null) => void
  ): UnaryResponse;
  syncTime(
    requestMessage: coreapi_pb.SyncTimeRequest,
    callback: (error: ServiceError|null, responseMessage: coreapi_pb.SyncTimeResponse|null) => void
  ): UnaryResponse;
}

