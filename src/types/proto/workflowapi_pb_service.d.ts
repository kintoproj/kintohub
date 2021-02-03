// package: 
// file: workflowapi.proto

import * as workflowapi_pb from "./workflowapi_pb";
import * as models_pb from "./models_pb";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";
import {grpc} from "@improbable-eng/grpc-web";

type WorkflowAPIServiceBuildAndDeployRelease = {
  readonly methodName: string;
  readonly service: typeof WorkflowAPIService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof workflowapi_pb.BuildAndDeployRequest;
  readonly responseType: typeof workflowapi_pb.WorkflowResponse;
};

type WorkflowAPIServiceDeployRelease = {
  readonly methodName: string;
  readonly service: typeof WorkflowAPIService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof workflowapi_pb.DeployRequest;
  readonly responseType: typeof workflowapi_pb.WorkflowResponse;
};

type WorkflowAPIServiceDeployReleaseFromCatalog = {
  readonly methodName: string;
  readonly service: typeof WorkflowAPIService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof workflowapi_pb.DeployCatalogRequest;
  readonly responseType: typeof workflowapi_pb.WorkflowResponse;
};

type WorkflowAPIServiceUndeployRelease = {
  readonly methodName: string;
  readonly service: typeof WorkflowAPIService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof workflowapi_pb.UndeployRequest;
  readonly responseType: typeof workflowapi_pb.WorkflowResponse;
};

type WorkflowAPIServiceSuspendRelease = {
  readonly methodName: string;
  readonly service: typeof WorkflowAPIService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof workflowapi_pb.SuspendRequest;
  readonly responseType: typeof workflowapi_pb.WorkflowResponse;
};

type WorkflowAPIServiceAbortRelease = {
  readonly methodName: string;
  readonly service: typeof WorkflowAPIService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof workflowapi_pb.AbortReleaseRequest;
  readonly responseType: typeof google_protobuf_empty_pb.Empty;
};

type WorkflowAPIServiceGetWorkflowLogs = {
  readonly methodName: string;
  readonly service: typeof WorkflowAPIService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof workflowapi_pb.WorkflowLogsRequest;
  readonly responseType: typeof models_pb.Logs;
};

type WorkflowAPIServiceWatchWorkflowLogs = {
  readonly methodName: string;
  readonly service: typeof WorkflowAPIService;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof workflowapi_pb.WorkflowLogsRequest;
  readonly responseType: typeof models_pb.Logs;
};

export class WorkflowAPIService {
  static readonly serviceName: string;
  static readonly BuildAndDeployRelease: WorkflowAPIServiceBuildAndDeployRelease;
  static readonly DeployRelease: WorkflowAPIServiceDeployRelease;
  static readonly DeployReleaseFromCatalog: WorkflowAPIServiceDeployReleaseFromCatalog;
  static readonly UndeployRelease: WorkflowAPIServiceUndeployRelease;
  static readonly SuspendRelease: WorkflowAPIServiceSuspendRelease;
  static readonly AbortRelease: WorkflowAPIServiceAbortRelease;
  static readonly GetWorkflowLogs: WorkflowAPIServiceGetWorkflowLogs;
  static readonly WatchWorkflowLogs: WorkflowAPIServiceWatchWorkflowLogs;
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

export class WorkflowAPIServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  buildAndDeployRelease(
    requestMessage: workflowapi_pb.BuildAndDeployRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: workflowapi_pb.WorkflowResponse|null) => void
  ): UnaryResponse;
  buildAndDeployRelease(
    requestMessage: workflowapi_pb.BuildAndDeployRequest,
    callback: (error: ServiceError|null, responseMessage: workflowapi_pb.WorkflowResponse|null) => void
  ): UnaryResponse;
  deployRelease(
    requestMessage: workflowapi_pb.DeployRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: workflowapi_pb.WorkflowResponse|null) => void
  ): UnaryResponse;
  deployRelease(
    requestMessage: workflowapi_pb.DeployRequest,
    callback: (error: ServiceError|null, responseMessage: workflowapi_pb.WorkflowResponse|null) => void
  ): UnaryResponse;
  deployReleaseFromCatalog(
    requestMessage: workflowapi_pb.DeployCatalogRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: workflowapi_pb.WorkflowResponse|null) => void
  ): UnaryResponse;
  deployReleaseFromCatalog(
    requestMessage: workflowapi_pb.DeployCatalogRequest,
    callback: (error: ServiceError|null, responseMessage: workflowapi_pb.WorkflowResponse|null) => void
  ): UnaryResponse;
  undeployRelease(
    requestMessage: workflowapi_pb.UndeployRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: workflowapi_pb.WorkflowResponse|null) => void
  ): UnaryResponse;
  undeployRelease(
    requestMessage: workflowapi_pb.UndeployRequest,
    callback: (error: ServiceError|null, responseMessage: workflowapi_pb.WorkflowResponse|null) => void
  ): UnaryResponse;
  suspendRelease(
    requestMessage: workflowapi_pb.SuspendRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: workflowapi_pb.WorkflowResponse|null) => void
  ): UnaryResponse;
  suspendRelease(
    requestMessage: workflowapi_pb.SuspendRequest,
    callback: (error: ServiceError|null, responseMessage: workflowapi_pb.WorkflowResponse|null) => void
  ): UnaryResponse;
  abortRelease(
    requestMessage: workflowapi_pb.AbortReleaseRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  abortRelease(
    requestMessage: workflowapi_pb.AbortReleaseRequest,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  getWorkflowLogs(
    requestMessage: workflowapi_pb.WorkflowLogsRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: models_pb.Logs|null) => void
  ): UnaryResponse;
  getWorkflowLogs(
    requestMessage: workflowapi_pb.WorkflowLogsRequest,
    callback: (error: ServiceError|null, responseMessage: models_pb.Logs|null) => void
  ): UnaryResponse;
  watchWorkflowLogs(requestMessage: workflowapi_pb.WorkflowLogsRequest, metadata?: grpc.Metadata): ResponseStream<models_pb.Logs>;
}

