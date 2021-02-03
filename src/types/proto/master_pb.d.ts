// package: 
// file: master.proto

import * as jspb from "google-protobuf";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";

export class ClusterInfo extends jspb.Message {
  getHostname(): string;
  setHostname(value: string): void;

  getDisplayname(): string;
  setDisplayname(value: string): void;

  getWebhostname(): string;
  setWebhostname(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClusterInfo.AsObject;
  static toObject(includeInstance: boolean, msg: ClusterInfo): ClusterInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClusterInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClusterInfo;
  static deserializeBinaryFromReader(message: ClusterInfo, reader: jspb.BinaryReader): ClusterInfo;
}

export namespace ClusterInfo {
  export type AsObject = {
    hostname: string,
    displayname: string,
    webhostname: string,
  }
}

export class RegisterClusterRequest extends jspb.Message {
  hasInfo(): boolean;
  clearInfo(): void;
  getInfo(): ClusterInfo | undefined;
  setInfo(value?: ClusterInfo): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RegisterClusterRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RegisterClusterRequest): RegisterClusterRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RegisterClusterRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RegisterClusterRequest;
  static deserializeBinaryFromReader(message: RegisterClusterRequest, reader: jspb.BinaryReader): RegisterClusterRequest;
}

export namespace RegisterClusterRequest {
  export type AsObject = {
    info?: ClusterInfo.AsObject,
  }
}

export class RegisterClusterResponse extends jspb.Message {
  getClusterid(): string;
  setClusterid(value: string): void;

  getClusterclientsecret(): string;
  setClusterclientsecret(value: string): void;

  getClusteraccesstokensecret(): Uint8Array | string;
  getClusteraccesstokensecret_asU8(): Uint8Array;
  getClusteraccesstokensecret_asB64(): string;
  setClusteraccesstokensecret(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RegisterClusterResponse.AsObject;
  static toObject(includeInstance: boolean, msg: RegisterClusterResponse): RegisterClusterResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RegisterClusterResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RegisterClusterResponse;
  static deserializeBinaryFromReader(message: RegisterClusterResponse, reader: jspb.BinaryReader): RegisterClusterResponse;
}

export namespace RegisterClusterResponse {
  export type AsObject = {
    clusterid: string,
    clusterclientsecret: string,
    clusteraccesstokensecret: Uint8Array | string,
  }
}

export class AuthClusterRequest extends jspb.Message {
  getClusterid(): string;
  setClusterid(value: string): void;

  getClusterclientsecret(): string;
  setClusterclientsecret(value: string): void;

  hasInfo(): boolean;
  clearInfo(): void;
  getInfo(): ClusterInfo | undefined;
  setInfo(value?: ClusterInfo): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AuthClusterRequest.AsObject;
  static toObject(includeInstance: boolean, msg: AuthClusterRequest): AuthClusterRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AuthClusterRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AuthClusterRequest;
  static deserializeBinaryFromReader(message: AuthClusterRequest, reader: jspb.BinaryReader): AuthClusterRequest;
}

export namespace AuthClusterRequest {
  export type AsObject = {
    clusterid: string,
    clusterclientsecret: string,
    info?: ClusterInfo.AsObject,
  }
}

export class ReportHealthRequest extends jspb.Message {
  getClusterid(): string;
  setClusterid(value: string): void;

  getClusterclientsecret(): string;
  setClusterclientsecret(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ReportHealthRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ReportHealthRequest): ReportHealthRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ReportHealthRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ReportHealthRequest;
  static deserializeBinaryFromReader(message: ReportHealthRequest, reader: jspb.BinaryReader): ReportHealthRequest;
}

export namespace ReportHealthRequest {
  export type AsObject = {
    clusterid: string,
    clusterclientsecret: string,
  }
}

export class ReportHealthResponse extends jspb.Message {
  getReporthealthintervalseconds(): number;
  setReporthealthintervalseconds(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ReportHealthResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ReportHealthResponse): ReportHealthResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ReportHealthResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ReportHealthResponse;
  static deserializeBinaryFromReader(message: ReportHealthResponse, reader: jspb.BinaryReader): ReportHealthResponse;
}

export namespace ReportHealthResponse {
  export type AsObject = {
    reporthealthintervalseconds: number,
  }
}

export class ReportEventRequest extends jspb.Message {
  getClusterid(): string;
  setClusterid(value: string): void;

  getClusterclientsecret(): string;
  setClusterclientsecret(value: string): void;

  getEnvid(): string;
  setEnvid(value: string): void;

  getEventname(): string;
  setEventname(value: string): void;

  getPropertiesMap(): jspb.Map<string, string>;
  clearPropertiesMap(): void;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ReportEventRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ReportEventRequest): ReportEventRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ReportEventRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ReportEventRequest;
  static deserializeBinaryFromReader(message: ReportEventRequest, reader: jspb.BinaryReader): ReportEventRequest;
}

export namespace ReportEventRequest {
  export type AsObject = {
    clusterid: string,
    clusterclientsecret: string,
    envid: string,
    eventname: string,
    propertiesMap: Array<[string, string]>,
  }
}

