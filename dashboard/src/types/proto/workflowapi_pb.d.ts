// package: 
// file: workflowapi.proto

import * as jspb from "google-protobuf";
import * as models_pb from "./models_pb";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";

export class WorkflowLogsRequest extends jspb.Message {
  getBuildid(): string;
  setBuildid(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WorkflowLogsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: WorkflowLogsRequest): WorkflowLogsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: WorkflowLogsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WorkflowLogsRequest;
  static deserializeBinaryFromReader(message: WorkflowLogsRequest, reader: jspb.BinaryReader): WorkflowLogsRequest;
}

export namespace WorkflowLogsRequest {
  export type AsObject = {
    buildid: string,
  }
}

export class BuildAndDeployRequest extends jspb.Message {
  hasBuildconfig(): boolean;
  clearBuildconfig(): void;
  getBuildconfig(): models_pb.BuildConfig | undefined;
  setBuildconfig(value?: models_pb.BuildConfig): void;

  getBlockname(): string;
  setBlockname(value: string): void;

  getReleaseid(): string;
  setReleaseid(value: string): void;

  getNamespace(): string;
  setNamespace(value: string): void;

  getIsstaticbuild(): boolean;
  setIsstaticbuild(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BuildAndDeployRequest.AsObject;
  static toObject(includeInstance: boolean, msg: BuildAndDeployRequest): BuildAndDeployRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BuildAndDeployRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BuildAndDeployRequest;
  static deserializeBinaryFromReader(message: BuildAndDeployRequest, reader: jspb.BinaryReader): BuildAndDeployRequest;
}

export namespace BuildAndDeployRequest {
  export type AsObject = {
    buildconfig?: models_pb.BuildConfig.AsObject,
    blockname: string,
    releaseid: string,
    namespace: string,
    isstaticbuild: boolean,
  }
}

export class DeployRequest extends jspb.Message {
  getBlockname(): string;
  setBlockname(value: string): void;

  getReleaseid(): string;
  setReleaseid(value: string): void;

  getNamespace(): string;
  setNamespace(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeployRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DeployRequest): DeployRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DeployRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeployRequest;
  static deserializeBinaryFromReader(message: DeployRequest, reader: jspb.BinaryReader): DeployRequest;
}

export namespace DeployRequest {
  export type AsObject = {
    blockname: string,
    releaseid: string,
    namespace: string,
  }
}

export class DeployCatalogRequest extends jspb.Message {
  getBlockname(): string;
  setBlockname(value: string): void;

  getReleaseid(): string;
  setReleaseid(value: string): void;

  getNamespace(): string;
  setNamespace(value: string): void;

  hasRepo(): boolean;
  clearRepo(): void;
  getRepo(): models_pb.Repository | undefined;
  setRepo(value?: models_pb.Repository): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeployCatalogRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DeployCatalogRequest): DeployCatalogRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DeployCatalogRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeployCatalogRequest;
  static deserializeBinaryFromReader(message: DeployCatalogRequest, reader: jspb.BinaryReader): DeployCatalogRequest;
}

export namespace DeployCatalogRequest {
  export type AsObject = {
    blockname: string,
    releaseid: string,
    namespace: string,
    repo?: models_pb.Repository.AsObject,
  }
}

export class UndeployRequest extends jspb.Message {
  getBlockname(): string;
  setBlockname(value: string): void;

  getNamespace(): string;
  setNamespace(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UndeployRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UndeployRequest): UndeployRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UndeployRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UndeployRequest;
  static deserializeBinaryFromReader(message: UndeployRequest, reader: jspb.BinaryReader): UndeployRequest;
}

export namespace UndeployRequest {
  export type AsObject = {
    blockname: string,
    namespace: string,
  }
}

export class SuspendRequest extends jspb.Message {
  getBlockname(): string;
  setBlockname(value: string): void;

  getNamespace(): string;
  setNamespace(value: string): void;

  getReleaseid(): string;
  setReleaseid(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SuspendRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SuspendRequest): SuspendRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SuspendRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SuspendRequest;
  static deserializeBinaryFromReader(message: SuspendRequest, reader: jspb.BinaryReader): SuspendRequest;
}

export namespace SuspendRequest {
  export type AsObject = {
    blockname: string,
    namespace: string,
    releaseid: string,
  }
}

export class WorkflowResponse extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WorkflowResponse.AsObject;
  static toObject(includeInstance: boolean, msg: WorkflowResponse): WorkflowResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: WorkflowResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WorkflowResponse;
  static deserializeBinaryFromReader(message: WorkflowResponse, reader: jspb.BinaryReader): WorkflowResponse;
}

export namespace WorkflowResponse {
  export type AsObject = {
    id: string,
  }
}

export class AbortReleaseRequest extends jspb.Message {
  getBuildid(): string;
  setBuildid(value: string): void;

  getEnvid(): string;
  setEnvid(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AbortReleaseRequest.AsObject;
  static toObject(includeInstance: boolean, msg: AbortReleaseRequest): AbortReleaseRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AbortReleaseRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AbortReleaseRequest;
  static deserializeBinaryFromReader(message: AbortReleaseRequest, reader: jspb.BinaryReader): AbortReleaseRequest;
}

export namespace AbortReleaseRequest {
  export type AsObject = {
    buildid: string,
    envid: string,
  }
}

