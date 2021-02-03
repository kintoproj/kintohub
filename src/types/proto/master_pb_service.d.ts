// package: 
// file: master.proto

import * as master_pb from "./master_pb";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";
import {grpc} from "@improbable-eng/grpc-web";

type MasterServiceRegisterNewCluster = {
  readonly methodName: string;
  readonly service: typeof MasterService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof master_pb.RegisterClusterRequest;
  readonly responseType: typeof master_pb.RegisterClusterResponse;
};

type MasterServiceAuthCluster = {
  readonly methodName: string;
  readonly service: typeof MasterService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof master_pb.AuthClusterRequest;
  readonly responseType: typeof google_protobuf_empty_pb.Empty;
};

type MasterServiceReportHealthPingRequest = {
  readonly methodName: string;
  readonly service: typeof MasterService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof master_pb.ReportHealthRequest;
  readonly responseType: typeof master_pb.ReportHealthResponse;
};

type MasterServiceReportEvent = {
  readonly methodName: string;
  readonly service: typeof MasterService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof master_pb.ReportEventRequest;
  readonly responseType: typeof google_protobuf_empty_pb.Empty;
};

export class MasterService {
  static readonly serviceName: string;
  static readonly RegisterNewCluster: MasterServiceRegisterNewCluster;
  static readonly AuthCluster: MasterServiceAuthCluster;
  static readonly ReportHealthPingRequest: MasterServiceReportHealthPingRequest;
  static readonly ReportEvent: MasterServiceReportEvent;
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

export class MasterServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  registerNewCluster(
    requestMessage: master_pb.RegisterClusterRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: master_pb.RegisterClusterResponse|null) => void
  ): UnaryResponse;
  registerNewCluster(
    requestMessage: master_pb.RegisterClusterRequest,
    callback: (error: ServiceError|null, responseMessage: master_pb.RegisterClusterResponse|null) => void
  ): UnaryResponse;
  authCluster(
    requestMessage: master_pb.AuthClusterRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  authCluster(
    requestMessage: master_pb.AuthClusterRequest,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  reportHealthPingRequest(
    requestMessage: master_pb.ReportHealthRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: master_pb.ReportHealthResponse|null) => void
  ): UnaryResponse;
  reportHealthPingRequest(
    requestMessage: master_pb.ReportHealthRequest,
    callback: (error: ServiceError|null, responseMessage: master_pb.ReportHealthResponse|null) => void
  ): UnaryResponse;
  reportEvent(
    requestMessage: master_pb.ReportEventRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
  reportEvent(
    requestMessage: master_pb.ReportEventRequest,
    callback: (error: ServiceError|null, responseMessage: google_protobuf_empty_pb.Empty|null) => void
  ): UnaryResponse;
}

