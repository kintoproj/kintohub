// package: 
// file: metricshistory.proto

import * as jspb from "google-protobuf";
import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb";

export class MetricsHistory extends jspb.Message {
  clearEntitiesList(): void;
  getEntitiesList(): Array<MetricsEntity>;
  setEntitiesList(value: Array<MetricsEntity>): void;
  addEntities(value?: MetricsEntity, index?: number): MetricsEntity;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MetricsHistory.AsObject;
  static toObject(includeInstance: boolean, msg: MetricsHistory): MetricsHistory.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MetricsHistory, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MetricsHistory;
  static deserializeBinaryFromReader(message: MetricsHistory, reader: jspb.BinaryReader): MetricsHistory;
}

export namespace MetricsHistory {
  export type AsObject = {
    entitiesList: Array<MetricsEntity.AsObject>,
  }
}

export class MetricsEntity extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getNodename(): string;
  setNodename(value: string): void;

  clearDataList(): void;
  getDataList(): Array<MetricsData>;
  setDataList(value: Array<MetricsData>): void;
  addData(value?: MetricsData, index?: number): MetricsData;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MetricsEntity.AsObject;
  static toObject(includeInstance: boolean, msg: MetricsEntity): MetricsEntity.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MetricsEntity, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MetricsEntity;
  static deserializeBinaryFromReader(message: MetricsEntity, reader: jspb.BinaryReader): MetricsEntity;
}

export namespace MetricsEntity {
  export type AsObject = {
    name: string,
    nodename: string,
    dataList: Array<MetricsData.AsObject>,
  }
}

export class MetricsData extends jspb.Message {
  hasStarttime(): boolean;
  clearStarttime(): void;
  getStarttime(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setStarttime(value?: google_protobuf_timestamp_pb.Timestamp): void;

  hasEndtime(): boolean;
  clearEndtime(): void;
  getEndtime(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setEndtime(value?: google_protobuf_timestamp_pb.Timestamp): void;

  getCpurequests(): number;
  setCpurequests(value: number): void;

  getCpuusage(): number;
  setCpuusage(value: number): void;

  getMemrequests(): number;
  setMemrequests(value: number): void;

  getMemusage(): number;
  setMemusage(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MetricsData.AsObject;
  static toObject(includeInstance: boolean, msg: MetricsData): MetricsData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MetricsData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MetricsData;
  static deserializeBinaryFromReader(message: MetricsData, reader: jspb.BinaryReader): MetricsData;
}

export namespace MetricsData {
  export type AsObject = {
    starttime?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    endtime?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    cpurequests: number,
    cpuusage: number,
    memrequests: number,
    memusage: number,
  }
}

export class EnvironmentMetricsQueryRequest extends jspb.Message {
  getEnvid(): string;
  setEnvid(value: string): void;

  hasStarttime(): boolean;
  clearStarttime(): void;
  getStarttime(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setStarttime(value?: google_protobuf_timestamp_pb.Timestamp): void;

  hasEndtime(): boolean;
  clearEndtime(): void;
  getEndtime(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setEndtime(value?: google_protobuf_timestamp_pb.Timestamp): void;

  getAggregation(): AggregationMap[keyof AggregationMap];
  setAggregation(value: AggregationMap[keyof AggregationMap]): void;

  getAggregationintervalseconds(): number;
  setAggregationintervalseconds(value: number): void;

  getIgnoreemptydata(): boolean;
  setIgnoreemptydata(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EnvironmentMetricsQueryRequest.AsObject;
  static toObject(includeInstance: boolean, msg: EnvironmentMetricsQueryRequest): EnvironmentMetricsQueryRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EnvironmentMetricsQueryRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EnvironmentMetricsQueryRequest;
  static deserializeBinaryFromReader(message: EnvironmentMetricsQueryRequest, reader: jspb.BinaryReader): EnvironmentMetricsQueryRequest;
}

export namespace EnvironmentMetricsQueryRequest {
  export type AsObject = {
    envid: string,
    starttime?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    endtime?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    aggregation: AggregationMap[keyof AggregationMap],
    aggregationintervalseconds: number,
    ignoreemptydata: boolean,
  }
}

export class BlockMetricsQueryRequest extends jspb.Message {
  getEnvid(): string;
  setEnvid(value: string): void;

  getBlockname(): string;
  setBlockname(value: string): void;

  hasStarttime(): boolean;
  clearStarttime(): void;
  getStarttime(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setStarttime(value?: google_protobuf_timestamp_pb.Timestamp): void;

  hasEndtime(): boolean;
  clearEndtime(): void;
  getEndtime(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setEndtime(value?: google_protobuf_timestamp_pb.Timestamp): void;

  getAggregation(): AggregationMap[keyof AggregationMap];
  setAggregation(value: AggregationMap[keyof AggregationMap]): void;

  getAggregationintervalseconds(): number;
  setAggregationintervalseconds(value: number): void;

  getIgnoreemptydata(): boolean;
  setIgnoreemptydata(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BlockMetricsQueryRequest.AsObject;
  static toObject(includeInstance: boolean, msg: BlockMetricsQueryRequest): BlockMetricsQueryRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BlockMetricsQueryRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BlockMetricsQueryRequest;
  static deserializeBinaryFromReader(message: BlockMetricsQueryRequest, reader: jspb.BinaryReader): BlockMetricsQueryRequest;
}

export namespace BlockMetricsQueryRequest {
  export type AsObject = {
    envid: string,
    blockname: string,
    starttime?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    endtime?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    aggregation: AggregationMap[keyof AggregationMap],
    aggregationintervalseconds: number,
    ignoreemptydata: boolean,
  }
}

export class InstanceMetricsQueryRequest extends jspb.Message {
  getEnvid(): string;
  setEnvid(value: string): void;

  getBlockname(): string;
  setBlockname(value: string): void;

  getInstanceid(): string;
  setInstanceid(value: string): void;

  hasStarttime(): boolean;
  clearStarttime(): void;
  getStarttime(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setStarttime(value?: google_protobuf_timestamp_pb.Timestamp): void;

  hasEndtime(): boolean;
  clearEndtime(): void;
  getEndtime(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setEndtime(value?: google_protobuf_timestamp_pb.Timestamp): void;

  getAggregation(): AggregationMap[keyof AggregationMap];
  setAggregation(value: AggregationMap[keyof AggregationMap]): void;

  getAggregationintervalseconds(): number;
  setAggregationintervalseconds(value: number): void;

  getIgnoreemptydata(): boolean;
  setIgnoreemptydata(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InstanceMetricsQueryRequest.AsObject;
  static toObject(includeInstance: boolean, msg: InstanceMetricsQueryRequest): InstanceMetricsQueryRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: InstanceMetricsQueryRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InstanceMetricsQueryRequest;
  static deserializeBinaryFromReader(message: InstanceMetricsQueryRequest, reader: jspb.BinaryReader): InstanceMetricsQueryRequest;
}

export namespace InstanceMetricsQueryRequest {
  export type AsObject = {
    envid: string,
    blockname: string,
    instanceid: string,
    starttime?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    endtime?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    aggregation: AggregationMap[keyof AggregationMap],
    aggregationintervalseconds: number,
    ignoreemptydata: boolean,
  }
}

export interface AggregationMap {
  AGGREGATION_NOT_SET: 0;
  SUM: 1;
  AVERAGE: 2;
  MAX: 3;
  MIN: 4;
}

export const Aggregation: AggregationMap;

