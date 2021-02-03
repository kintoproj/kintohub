// package: 
// file: metricshistory.proto

import * as metricshistory_pb from "./metricshistory_pb";
import {grpc} from "@improbable-eng/grpc-web";

type MetricsHistoryServiceGetEnvironmentMetrics = {
  readonly methodName: string;
  readonly service: typeof MetricsHistoryService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof metricshistory_pb.EnvironmentMetricsQueryRequest;
  readonly responseType: typeof metricshistory_pb.MetricsHistory;
};

type MetricsHistoryServiceGetBlockMetrics = {
  readonly methodName: string;
  readonly service: typeof MetricsHistoryService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof metricshistory_pb.BlockMetricsQueryRequest;
  readonly responseType: typeof metricshistory_pb.MetricsHistory;
};

type MetricsHistoryServiceGetInstanceMetrics = {
  readonly methodName: string;
  readonly service: typeof MetricsHistoryService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof metricshistory_pb.InstanceMetricsQueryRequest;
  readonly responseType: typeof metricshistory_pb.MetricsHistory;
};

export class MetricsHistoryService {
  static readonly serviceName: string;
  static readonly GetEnvironmentMetrics: MetricsHistoryServiceGetEnvironmentMetrics;
  static readonly GetBlockMetrics: MetricsHistoryServiceGetBlockMetrics;
  static readonly GetInstanceMetrics: MetricsHistoryServiceGetInstanceMetrics;
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

export class MetricsHistoryServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  getEnvironmentMetrics(
    requestMessage: metricshistory_pb.EnvironmentMetricsQueryRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: metricshistory_pb.MetricsHistory|null) => void
  ): UnaryResponse;
  getEnvironmentMetrics(
    requestMessage: metricshistory_pb.EnvironmentMetricsQueryRequest,
    callback: (error: ServiceError|null, responseMessage: metricshistory_pb.MetricsHistory|null) => void
  ): UnaryResponse;
  getBlockMetrics(
    requestMessage: metricshistory_pb.BlockMetricsQueryRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: metricshistory_pb.MetricsHistory|null) => void
  ): UnaryResponse;
  getBlockMetrics(
    requestMessage: metricshistory_pb.BlockMetricsQueryRequest,
    callback: (error: ServiceError|null, responseMessage: metricshistory_pb.MetricsHistory|null) => void
  ): UnaryResponse;
  getInstanceMetrics(
    requestMessage: metricshistory_pb.InstanceMetricsQueryRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: metricshistory_pb.MetricsHistory|null) => void
  ): UnaryResponse;
  getInstanceMetrics(
    requestMessage: metricshistory_pb.InstanceMetricsQueryRequest,
    callback: (error: ServiceError|null, responseMessage: metricshistory_pb.MetricsHistory|null) => void
  ): UnaryResponse;
}

