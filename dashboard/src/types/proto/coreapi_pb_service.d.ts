// package: 
// file: coreapi.proto

import * as coreapi_pb from "./coreapi_pb";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";
import * as models_pb from "./models_pb";
import {grpc} from "@improbable-eng/grpc-web";

type KintoCoreServiceGetEnvironment = {
  readonly methodName: string;
  readonly service: typeof KintoCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof coreapi_pb.EnvironmentQueryRequest;
  readonly responseType: typeof models_pb.Environment;
};

type KintoCoreServiceGetEnvironments = {
  readonly methodName: string;
  readonly service: typeof KintoCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof google_protobuf_empty_pb.Empty;
  readonly responseType: typeof models_pb.Environments;
};

type KintoCoreServiceCreateEnvironment = {
  readonly methodName: string;
  readonly service: typeof KintoCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof coreapi_pb.CreateEnvironmentRequest;
  readonly responseType: typeof models_pb.Environment;
};

type KintoCoreServiceUpdateEnvironment = {
  readonly methodName: string;
  readonly service: typeof KintoCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof coreapi_pb.UpdateEnvironmentRequest;
  readonly responseType: typeof models_pb.Environment;
};

type KintoCoreServiceDeleteEnvironment = {
  readonly methodName: string;
  readonly service: typeof KintoCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof coreapi_pb.DeleteEnvironmentRequest;
  readonly responseType: typeof google_protobuf_empty_pb.Empty;
};

type KintoCoreServiceCreateBlock = {
  readonly methodName: string;
  readonly service: typeof KintoCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof coreapi_pb.CreateBlockRequest;
  readonly responseType: typeof coreapi_pb.BlockUpdateResponse;
};

type KintoCoreServiceDeployBlockUpdate = {
  readonly methodName: string;
  readonly service: typeof KintoCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof coreapi_pb.DeployBlockRequest;
  readonly responseType: typeof coreapi_pb.BlockUpdateResponse;
};

type KintoCoreServiceTriggerDeploy = {
  readonly methodName: string;
  readonly service: typeof KintoCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof coreapi_pb.TriggerDeployRequest;
  readonly responseType: typeof coreapi_pb.BlockUpdateResponse;
};

type KintoCoreServiceRollbackBlock = {
  readonly methodName: string;
  readonly service: typeof KintoCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof coreapi_pb.RollbackBlockRequest;
  readonly responseType: typeof coreapi_pb.BlockUpdateResponse;
};

type KintoCoreServiceGetBlocks = {
  readonly methodName: string;
  readonly service: typeof KintoCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof coreapi_pb.BlockQueryRequest;
  readonly responseType: typeof models_pb.Blocks;
};

type KintoCoreServiceGetBlock = {
  readonly methodName: string;
  readonly service: typeof KintoCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof coreapi_pb.BlockQueryRequest;
  readonly responseType: typeof models_pb.Block;
};

type KintoCoreServiceDeleteBlock = {
  readonly methodName: string;
  readonly service: typeof KintoCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof coreapi_pb.DeleteBlockRequest;
  readonly responseType: typeof google_protobuf_empty_pb.Empty;
};

type KintoCoreServiceSuspendBlock = {
  readonly methodName: string;
  readonly service: typeof KintoCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof coreapi_pb.SuspendBlockRequest;
  readonly responseType: typeof coreapi_pb.BlockUpdateResponse;
};

type KintoCoreServiceWatchReleasesStatus = {
  readonly methodName: string;
  readonly service: typeof KintoCoreService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof coreapi_pb.BlockQueryRequest;
  readonly responseType: typeof models_pb.ReleasesStatus;
};

type KintoCoreServiceKillBlockInstance = {
  readonly methodName: string;
  readonly service: typeof KintoCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof coreapi_pb.KillBlockInstanceRequest;
  readonly responseType: typeof google_protobuf_empty_pb.Empty;
};

type KintoCoreServiceAbortRelease = {
  readonly methodName: string;
  readonly service: typeof KintoCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof coreapi_pb.AbortBlockReleaseRequest;
  readonly responseType: typeof google_protobuf_empty_pb.Empty;
};

type KintoCoreServiceTagRelease = {
  readonly methodName: string;
  readonly service: typeof KintoCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof coreapi_pb.TagReleaseRequest;
  readonly responseType: typeof google_protobuf_empty_pb.Empty;
};

type KintoCoreServicePromoteRelease = {
  readonly methodName: string;
  readonly service: typeof KintoCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof coreapi_pb.PromoteReleaseRequest;
  readonly responseType: typeof google_protobuf_empty_pb.Empty;
};

type KintoCoreServiceGenReleaseConfigFromKintoFile = {
  readonly methodName: string;
  readonly service: typeof KintoCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof coreapi_pb.GenReleaseConfigFromKintoFileRepoRequest;
  readonly responseType: typeof models_pb.ReleaseConfig;
};

type KintoCoreServiceWatchBuildLogs = {
  readonly methodName: string;
  readonly service: typeof KintoCoreService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof coreapi_pb.WatchBuildLogsRequest;
  readonly responseType: typeof models_pb.Logs;
};

type KintoCoreServiceUpdateBuildStatus = {
  readonly methodName: string;
  readonly service: typeof KintoCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof coreapi_pb.UpdateBuildStatusRequest;
  readonly responseType: typeof coreapi_pb.UpdateBuildStatusResponse;
};

type KintoCoreServiceUpdateBuildCommitSha = {
  readonly methodName: string;
  readonly service: typeof KintoCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof coreapi_pb.UpdateBuildCommitShaRequest;
  readonly responseType: typeof google_protobuf_empty_pb.Empty;
};

type KintoCoreServiceWatchBlocksHealthStatuses = {
  readonly methodName: string;
  readonly service: typeof KintoCoreService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof coreapi_pb.EnvironmentQueryRequest;
  readonly responseType: typeof models_pb.BlockStatuses;
};

type KintoCoreServiceWatchJobsStatus = {
  readonly methodName: string;
  readonly service: typeof KintoCoreService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof coreapi_pb.BlockQueryRequest;
  readonly responseType: typeof models_pb.JobStatus;
};

type KintoCoreServiceWatchBlocksMetrics = {
  readonly methodName: string;
  readonly service: typeof KintoCoreService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof coreapi_pb.BlockQueryRequest;
  readonly responseType: typeof models_pb.BlocksMetrics;
};

type KintoCoreServiceWatchConsoleLogs = {
  readonly methodName: string;
  readonly service: typeof KintoCoreService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof coreapi_pb.WatchConsoleLogsRequest;
  readonly responseType: typeof models_pb.ConsoleLog;
};

type KintoCoreServiceGetKintoConfiguration = {
  readonly methodName: string;
  readonly service: typeof KintoCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof google_protobuf_empty_pb.Empty;
  readonly responseType: typeof models_pb.KintoConfiguration;
};

type KintoCoreServiceCreateCustomDomainName = {
  readonly methodName: string;
  readonly service: typeof KintoCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof coreapi_pb.CustomDomainNameRequest;
  readonly responseType: typeof google_protobuf_empty_pb.Empty;
};

type KintoCoreServiceDeleteCustomDomainName = {
  readonly methodName: string;
  readonly service: typeof KintoCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof coreapi_pb.CustomDomainNameRequest;
  readonly responseType: typeof google_protobuf_empty_pb.Empty;
};

type KintoCoreServiceCheckCustomDomainName = {
  readonly methodName: string;
  readonly service: typeof KintoCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof coreapi_pb.CustomDomainNameRequest;
  readonly responseType: typeof coreapi_pb.CheckCustomDomainNameResponse;
};

type KintoCoreServiceEnablePublicURL = {
  readonly methodName: string;
  readonly service: typeof KintoCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof coreapi_pb.EnablePublicURLRequest;
  readonly responseType: typeof google_protobuf_empty_pb.Empty;
};

type KintoCoreServiceDisablePublicURL = {
  readonly methodName: string;
  readonly service: typeof KintoCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof coreapi_pb.DisablePublicURLRequest;
  readonly responseType: typeof google_protobuf_empty_pb.Empty;
};

type KintoCoreServiceStartTeleport = {
  readonly methodName: string;
  readonly service: typeof KintoCoreService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof coreapi_pb.TeleportRequest;
  readonly responseType: typeof coreapi_pb.TeleportResponse;
};

type KintoCoreServiceSyncTime = {
  readonly methodName: string;
  readonly service: typeof KintoCoreService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof coreapi_pb.SyncTimeRequest;
  readonly responseType: typeof coreapi_pb.SyncTimeResponse;
};

export class KintoCoreService {
  static readonly serviceName: string;
  static readonly GetEnvironment: KintoCoreServiceGetEnvironment;
  static readonly GetEnvironments: KintoCoreServiceGetEnvironments;
  static readonly CreateEnvironment: KintoCoreServiceCreateEnvironment;
  static readonly UpdateEnvironment: KintoCoreServiceUpdateEnvironment;
  static readonly DeleteEnvironment: KintoCoreServiceDeleteEnvironment;
  static readonly CreateBlock: KintoCoreServiceCreateBlock;
  static readonly DeployBlockUpdate: KintoCoreServiceDeployBlockUpdate;
  static readonly TriggerDeploy: KintoCoreServiceTriggerDeploy;
  static readonly RollbackBlock: KintoCoreServiceRollbackBlock;
  static readonly GetBlocks: KintoCoreServiceGetBlocks;
  static readonly GetBlock: KintoCoreServiceGetBlock;
  static readonly DeleteBlock: KintoCoreServiceDeleteBlock;
  static readonly SuspendBlock: KintoCoreServiceSuspendBlock;
  static readonly WatchReleasesStatus: KintoCoreServiceWatchReleasesStatus;
  static readonly KillBlockInstance: KintoCoreServiceKillBlockInstance;
  static readonly AbortRelease: KintoCoreServiceAbortRelease;
  static readonly TagRelease: KintoCoreServiceTagRelease;
  static readonly PromoteRelease: KintoCoreServicePromoteRelease;
  static readonly GenReleaseConfigFromKintoFile: KintoCoreServiceGenReleaseConfigFromKintoFile;
  static readonly WatchBuildLogs: KintoCoreServiceWatchBuildLogs;
  static readonly UpdateBuildStatus: KintoCoreServiceUpdateBuildStatus;
  static readonly UpdateBuildCommitSha: KintoCoreServiceUpdateBuildCommitSha;
  static readonly WatchBlocksHealthStatuses: KintoCoreServiceWatchBlocksHealthStatuses;
  static readonly WatchJobsStatus: KintoCoreServiceWatchJobsStatus;
  static readonly WatchBlocksMetrics: KintoCoreServiceWatchBlocksMetrics;
  static readonly WatchConsoleLogs: KintoCoreServiceWatchConsoleLogs;
  static readonly GetKintoConfiguration: KintoCoreServiceGetKintoConfiguration;
  static readonly CreateCustomDomainName: KintoCoreServiceCreateCustomDomainName;
  static readonly DeleteCustomDomainName: KintoCoreServiceDeleteCustomDomainName;
  static readonly CheckCustomDomainName: KintoCoreServiceCheckCustomDomainName;
  static readonly EnablePublicURL: KintoCoreServiceEnablePublicURL;
  static readonly DisablePublicURL: KintoCoreServiceDisablePublicURL;
  static readonly StartTeleport: KintoCoreServiceStartTeleport;
  static readonly SyncTime: KintoCoreServiceSyncTime;
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

export class KintoCoreServiceClient {
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

