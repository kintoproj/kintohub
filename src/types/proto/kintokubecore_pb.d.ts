// package: 
// file: kintokubecore.proto

import * as jspb from "google-protobuf";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";
import * as kkc_models_pb from "./kkc_models_pb";

export class EnvironmentQueryRequest extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EnvironmentQueryRequest.AsObject;
  static toObject(includeInstance: boolean, msg: EnvironmentQueryRequest): EnvironmentQueryRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EnvironmentQueryRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EnvironmentQueryRequest;
  static deserializeBinaryFromReader(message: EnvironmentQueryRequest, reader: jspb.BinaryReader): EnvironmentQueryRequest;
}

export namespace EnvironmentQueryRequest {
  export type AsObject = {
    id: string,
  }
}

export class CreateEnvironmentRequest extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateEnvironmentRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateEnvironmentRequest): CreateEnvironmentRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CreateEnvironmentRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateEnvironmentRequest;
  static deserializeBinaryFromReader(message: CreateEnvironmentRequest, reader: jspb.BinaryReader): CreateEnvironmentRequest;
}

export namespace CreateEnvironmentRequest {
  export type AsObject = {
    name: string,
  }
}

export class UpdateEnvironmentRequest extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getName(): string;
  setName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateEnvironmentRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateEnvironmentRequest): UpdateEnvironmentRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UpdateEnvironmentRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateEnvironmentRequest;
  static deserializeBinaryFromReader(message: UpdateEnvironmentRequest, reader: jspb.BinaryReader): UpdateEnvironmentRequest;
}

export namespace UpdateEnvironmentRequest {
  export type AsObject = {
    id: string,
    name: string,
  }
}

export class DeleteEnvironmentRequest extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteEnvironmentRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteEnvironmentRequest): DeleteEnvironmentRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DeleteEnvironmentRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteEnvironmentRequest;
  static deserializeBinaryFromReader(message: DeleteEnvironmentRequest, reader: jspb.BinaryReader): DeleteEnvironmentRequest;
}

export namespace DeleteEnvironmentRequest {
  export type AsObject = {
    id: string,
  }
}

export class CreateBlockRequest extends jspb.Message {
  getEnvid(): string;
  setEnvid(value: string): void;

  getName(): string;
  setName(value: string): void;

  hasRunconfig(): boolean;
  clearRunconfig(): void;
  getRunconfig(): kkc_models_pb.RunConfig | undefined;
  setRunconfig(value?: kkc_models_pb.RunConfig): void;

  hasBuildconfig(): boolean;
  clearBuildconfig(): void;
  getBuildconfig(): kkc_models_pb.BuildConfig | undefined;
  setBuildconfig(value?: kkc_models_pb.BuildConfig): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateBlockRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateBlockRequest): CreateBlockRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CreateBlockRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateBlockRequest;
  static deserializeBinaryFromReader(message: CreateBlockRequest, reader: jspb.BinaryReader): CreateBlockRequest;
}

export namespace CreateBlockRequest {
  export type AsObject = {
    envid: string,
    name: string,
    runconfig?: kkc_models_pb.RunConfig.AsObject,
    buildconfig?: kkc_models_pb.BuildConfig.AsObject,
  }
}

export class DeployBlockRequest extends jspb.Message {
  getEnvid(): string;
  setEnvid(value: string): void;

  getName(): string;
  setName(value: string): void;

  hasRunconfig(): boolean;
  clearRunconfig(): void;
  getRunconfig(): kkc_models_pb.RunConfig | undefined;
  setRunconfig(value?: kkc_models_pb.RunConfig): void;

  hasBuildconfig(): boolean;
  clearBuildconfig(): void;
  getBuildconfig(): kkc_models_pb.BuildConfig | undefined;
  setBuildconfig(value?: kkc_models_pb.BuildConfig): void;

  getBasereleaseid(): string;
  setBasereleaseid(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeployBlockRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DeployBlockRequest): DeployBlockRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DeployBlockRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeployBlockRequest;
  static deserializeBinaryFromReader(message: DeployBlockRequest, reader: jspb.BinaryReader): DeployBlockRequest;
}

export namespace DeployBlockRequest {
  export type AsObject = {
    envid: string,
    name: string,
    runconfig?: kkc_models_pb.RunConfig.AsObject,
    buildconfig?: kkc_models_pb.BuildConfig.AsObject,
    basereleaseid: string,
  }
}

export class TriggerDeployRequest extends jspb.Message {
  getEnvid(): string;
  setEnvid(value: string): void;

  getName(): string;
  setName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TriggerDeployRequest.AsObject;
  static toObject(includeInstance: boolean, msg: TriggerDeployRequest): TriggerDeployRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TriggerDeployRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TriggerDeployRequest;
  static deserializeBinaryFromReader(message: TriggerDeployRequest, reader: jspb.BinaryReader): TriggerDeployRequest;
}

export namespace TriggerDeployRequest {
  export type AsObject = {
    envid: string,
    name: string,
  }
}

export class SuspendBlockRequest extends jspb.Message {
  getEnvid(): string;
  setEnvid(value: string): void;

  getName(): string;
  setName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SuspendBlockRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SuspendBlockRequest): SuspendBlockRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SuspendBlockRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SuspendBlockRequest;
  static deserializeBinaryFromReader(message: SuspendBlockRequest, reader: jspb.BinaryReader): SuspendBlockRequest;
}

export namespace SuspendBlockRequest {
  export type AsObject = {
    envid: string,
    name: string,
  }
}

export class BlockQueryRequest extends jspb.Message {
  getEnvid(): string;
  setEnvid(value: string): void;

  getName(): string;
  setName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BlockQueryRequest.AsObject;
  static toObject(includeInstance: boolean, msg: BlockQueryRequest): BlockQueryRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BlockQueryRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BlockQueryRequest;
  static deserializeBinaryFromReader(message: BlockQueryRequest, reader: jspb.BinaryReader): BlockQueryRequest;
}

export namespace BlockQueryRequest {
  export type AsObject = {
    envid: string,
    name: string,
  }
}

export class DeleteBlockRequest extends jspb.Message {
  getEnvid(): string;
  setEnvid(value: string): void;

  getName(): string;
  setName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteBlockRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteBlockRequest): DeleteBlockRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DeleteBlockRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteBlockRequest;
  static deserializeBinaryFromReader(message: DeleteBlockRequest, reader: jspb.BinaryReader): DeleteBlockRequest;
}

export namespace DeleteBlockRequest {
  export type AsObject = {
    envid: string,
    name: string,
  }
}

export class BlockUpdateResponse extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getReleaseid(): string;
  setReleaseid(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BlockUpdateResponse.AsObject;
  static toObject(includeInstance: boolean, msg: BlockUpdateResponse): BlockUpdateResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BlockUpdateResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BlockUpdateResponse;
  static deserializeBinaryFromReader(message: BlockUpdateResponse, reader: jspb.BinaryReader): BlockUpdateResponse;
}

export namespace BlockUpdateResponse {
  export type AsObject = {
    name: string,
    releaseid: string,
  }
}

export class WatchBuildLogsRequest extends jspb.Message {
  getReleaseid(): string;
  setReleaseid(value: string): void;

  getBlockname(): string;
  setBlockname(value: string): void;

  getEnvid(): string;
  setEnvid(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WatchBuildLogsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: WatchBuildLogsRequest): WatchBuildLogsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: WatchBuildLogsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WatchBuildLogsRequest;
  static deserializeBinaryFromReader(message: WatchBuildLogsRequest, reader: jspb.BinaryReader): WatchBuildLogsRequest;
}

export namespace WatchBuildLogsRequest {
  export type AsObject = {
    releaseid: string,
    blockname: string,
    envid: string,
  }
}

export class WatchConsoleLogsRequest extends jspb.Message {
  getBlockname(): string;
  setBlockname(value: string): void;

  getEnvid(): string;
  setEnvid(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WatchConsoleLogsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: WatchConsoleLogsRequest): WatchConsoleLogsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: WatchConsoleLogsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WatchConsoleLogsRequest;
  static deserializeBinaryFromReader(message: WatchConsoleLogsRequest, reader: jspb.BinaryReader): WatchConsoleLogsRequest;
}

export namespace WatchConsoleLogsRequest {
  export type AsObject = {
    blockname: string,
    envid: string,
  }
}

export class UpdateBuildStatusRequest extends jspb.Message {
  getBlockname(): string;
  setBlockname(value: string): void;

  getEnvid(): string;
  setEnvid(value: string): void;

  getReleaseid(): string;
  setReleaseid(value: string): void;

  hasStatus(): boolean;
  clearStatus(): void;
  getStatus(): kkc_models_pb.BuildStatus | undefined;
  setStatus(value?: kkc_models_pb.BuildStatus): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateBuildStatusRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateBuildStatusRequest): UpdateBuildStatusRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UpdateBuildStatusRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateBuildStatusRequest;
  static deserializeBinaryFromReader(message: UpdateBuildStatusRequest, reader: jspb.BinaryReader): UpdateBuildStatusRequest;
}

export namespace UpdateBuildStatusRequest {
  export type AsObject = {
    blockname: string,
    envid: string,
    releaseid: string,
    status?: kkc_models_pb.BuildStatus.AsObject,
  }
}

export class UpdateBuildStepRequest extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  hasStatus(): boolean;
  clearStatus(): void;
  getStatus(): kkc_models_pb.BuildStatus | undefined;
  setStatus(value?: kkc_models_pb.BuildStatus): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateBuildStepRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateBuildStepRequest): UpdateBuildStepRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UpdateBuildStepRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateBuildStepRequest;
  static deserializeBinaryFromReader(message: UpdateBuildStepRequest, reader: jspb.BinaryReader): UpdateBuildStepRequest;
}

export namespace UpdateBuildStepRequest {
  export type AsObject = {
    name: string,
    status?: kkc_models_pb.BuildStatus.AsObject,
  }
}

export class UpdateBuildStatusResponse extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateBuildStatusResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateBuildStatusResponse): UpdateBuildStatusResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UpdateBuildStatusResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateBuildStatusResponse;
  static deserializeBinaryFromReader(message: UpdateBuildStatusResponse, reader: jspb.BinaryReader): UpdateBuildStatusResponse;
}

export namespace UpdateBuildStatusResponse {
  export type AsObject = {
    id: string,
  }
}

export class UpdateBuildCommitShaRequest extends jspb.Message {
  getBlockname(): string;
  setBlockname(value: string): void;

  getEnvid(): string;
  setEnvid(value: string): void;

  getReleaseid(): string;
  setReleaseid(value: string): void;

  getCommitsha(): string;
  setCommitsha(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateBuildCommitShaRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateBuildCommitShaRequest): UpdateBuildCommitShaRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UpdateBuildCommitShaRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateBuildCommitShaRequest;
  static deserializeBinaryFromReader(message: UpdateBuildCommitShaRequest, reader: jspb.BinaryReader): UpdateBuildCommitShaRequest;
}

export namespace UpdateBuildCommitShaRequest {
  export type AsObject = {
    blockname: string,
    envid: string,
    releaseid: string,
    commitsha: string,
  }
}

export class KillBlockInstanceRequest extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getEnvid(): string;
  setEnvid(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): KillBlockInstanceRequest.AsObject;
  static toObject(includeInstance: boolean, msg: KillBlockInstanceRequest): KillBlockInstanceRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: KillBlockInstanceRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): KillBlockInstanceRequest;
  static deserializeBinaryFromReader(message: KillBlockInstanceRequest, reader: jspb.BinaryReader): KillBlockInstanceRequest;
}

export namespace KillBlockInstanceRequest {
  export type AsObject = {
    id: string,
    envid: string,
  }
}

export class RollbackBlockRequest extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getEnvid(): string;
  setEnvid(value: string): void;

  getReleaseid(): string;
  setReleaseid(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RollbackBlockRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RollbackBlockRequest): RollbackBlockRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RollbackBlockRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RollbackBlockRequest;
  static deserializeBinaryFromReader(message: RollbackBlockRequest, reader: jspb.BinaryReader): RollbackBlockRequest;
}

export namespace RollbackBlockRequest {
  export type AsObject = {
    name: string,
    envid: string,
    releaseid: string,
  }
}

export class CustomDomainNameRequest extends jspb.Message {
  getEnvid(): string;
  setEnvid(value: string): void;

  getBlockname(): string;
  setBlockname(value: string): void;

  getCustomdomainname(): string;
  setCustomdomainname(value: string): void;

  getCname(): string;
  setCname(value: string): void;

  getProtocol(): kkc_models_pb.RunConfig.ProtocolMap[keyof kkc_models_pb.RunConfig.ProtocolMap];
  setProtocol(value: kkc_models_pb.RunConfig.ProtocolMap[keyof kkc_models_pb.RunConfig.ProtocolMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CustomDomainNameRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CustomDomainNameRequest): CustomDomainNameRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CustomDomainNameRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CustomDomainNameRequest;
  static deserializeBinaryFromReader(message: CustomDomainNameRequest, reader: jspb.BinaryReader): CustomDomainNameRequest;
}

export namespace CustomDomainNameRequest {
  export type AsObject = {
    envid: string,
    blockname: string,
    customdomainname: string,
    cname: string,
    protocol: kkc_models_pb.RunConfig.ProtocolMap[keyof kkc_models_pb.RunConfig.ProtocolMap],
  }
}

export class CheckCustomDomainNameResponse extends jspb.Message {
  getIscnameok(): boolean;
  setIscnameok(value: boolean): void;

  getCnamewanted(): string;
  setCnamewanted(value: string): void;

  getCnamefound(): string;
  setCnamefound(value: string): void;

  getIscertificateready(): boolean;
  setIscertificateready(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CheckCustomDomainNameResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CheckCustomDomainNameResponse): CheckCustomDomainNameResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CheckCustomDomainNameResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CheckCustomDomainNameResponse;
  static deserializeBinaryFromReader(message: CheckCustomDomainNameResponse, reader: jspb.BinaryReader): CheckCustomDomainNameResponse;
}

export namespace CheckCustomDomainNameResponse {
  export type AsObject = {
    iscnameok: boolean,
    cnamewanted: string,
    cnamefound: string,
    iscertificateready: boolean,
  }
}

export class EnablePublicURLRequest extends jspb.Message {
  getBlockname(): string;
  setBlockname(value: string): void;

  getEnvid(): string;
  setEnvid(value: string): void;

  getReleaseid(): string;
  setReleaseid(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EnablePublicURLRequest.AsObject;
  static toObject(includeInstance: boolean, msg: EnablePublicURLRequest): EnablePublicURLRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EnablePublicURLRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EnablePublicURLRequest;
  static deserializeBinaryFromReader(message: EnablePublicURLRequest, reader: jspb.BinaryReader): EnablePublicURLRequest;
}

export namespace EnablePublicURLRequest {
  export type AsObject = {
    blockname: string,
    envid: string,
    releaseid: string,
  }
}

export class DisablePublicURLRequest extends jspb.Message {
  getBlockname(): string;
  setBlockname(value: string): void;

  getEnvid(): string;
  setEnvid(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DisablePublicURLRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DisablePublicURLRequest): DisablePublicURLRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DisablePublicURLRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DisablePublicURLRequest;
  static deserializeBinaryFromReader(message: DisablePublicURLRequest, reader: jspb.BinaryReader): DisablePublicURLRequest;
}

export namespace DisablePublicURLRequest {
  export type AsObject = {
    blockname: string,
    envid: string,
  }
}

export class AbortBlockReleaseRequest extends jspb.Message {
  getBlockname(): string;
  setBlockname(value: string): void;

  getReleaseid(): string;
  setReleaseid(value: string): void;

  getEnvid(): string;
  setEnvid(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AbortBlockReleaseRequest.AsObject;
  static toObject(includeInstance: boolean, msg: AbortBlockReleaseRequest): AbortBlockReleaseRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AbortBlockReleaseRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AbortBlockReleaseRequest;
  static deserializeBinaryFromReader(message: AbortBlockReleaseRequest, reader: jspb.BinaryReader): AbortBlockReleaseRequest;
}

export namespace AbortBlockReleaseRequest {
  export type AsObject = {
    blockname: string,
    releaseid: string,
    envid: string,
  }
}

export class TeleportRequest extends jspb.Message {
  getEnvid(): string;
  setEnvid(value: string): void;

  getBlockname(): string;
  setBlockname(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TeleportRequest.AsObject;
  static toObject(includeInstance: boolean, msg: TeleportRequest): TeleportRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TeleportRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TeleportRequest;
  static deserializeBinaryFromReader(message: TeleportRequest, reader: jspb.BinaryReader): TeleportRequest;
}

export namespace TeleportRequest {
  export type AsObject = {
    envid: string,
    blockname: string,
  }
}

export class TeleportResponse extends jspb.Message {
  hasData(): boolean;
  clearData(): void;
  getData(): kkc_models_pb.TeleportServiceData | undefined;
  setData(value?: kkc_models_pb.TeleportServiceData): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TeleportResponse.AsObject;
  static toObject(includeInstance: boolean, msg: TeleportResponse): TeleportResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TeleportResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TeleportResponse;
  static deserializeBinaryFromReader(message: TeleportResponse, reader: jspb.BinaryReader): TeleportResponse;
}

export namespace TeleportResponse {
  export type AsObject = {
    data?: kkc_models_pb.TeleportServiceData.AsObject,
  }
}

export class TagReleaseRequest extends jspb.Message {
  getBlockname(): string;
  setBlockname(value: string): void;

  getReleaseid(): string;
  setReleaseid(value: string): void;

  getEnvid(): string;
  setEnvid(value: string): void;

  getTag(): string;
  setTag(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TagReleaseRequest.AsObject;
  static toObject(includeInstance: boolean, msg: TagReleaseRequest): TagReleaseRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TagReleaseRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TagReleaseRequest;
  static deserializeBinaryFromReader(message: TagReleaseRequest, reader: jspb.BinaryReader): TagReleaseRequest;
}

export namespace TagReleaseRequest {
  export type AsObject = {
    blockname: string,
    releaseid: string,
    envid: string,
    tag: string,
  }
}

export class PromoteReleaseRequest extends jspb.Message {
  getEnvid(): string;
  setEnvid(value: string): void;

  getBlockname(): string;
  setBlockname(value: string): void;

  getTag(): string;
  setTag(value: string): void;

  getReleaseid(): string;
  setReleaseid(value: string): void;

  getTargetenvid(): string;
  setTargetenvid(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PromoteReleaseRequest.AsObject;
  static toObject(includeInstance: boolean, msg: PromoteReleaseRequest): PromoteReleaseRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PromoteReleaseRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PromoteReleaseRequest;
  static deserializeBinaryFromReader(message: PromoteReleaseRequest, reader: jspb.BinaryReader): PromoteReleaseRequest;
}

export namespace PromoteReleaseRequest {
  export type AsObject = {
    envid: string,
    blockname: string,
    tag: string,
    releaseid: string,
    targetenvid: string,
  }
}

export class GenReleaseConfigFromKintoFileRepoRequest extends jspb.Message {
  getBlocktype(): kkc_models_pb.Block.TypeMap[keyof kkc_models_pb.Block.TypeMap];
  setBlocktype(value: kkc_models_pb.Block.TypeMap[keyof kkc_models_pb.Block.TypeMap]): void;

  getOrg(): string;
  setOrg(value: string): void;

  getRepo(): string;
  setRepo(value: string): void;

  getBranch(): string;
  setBranch(value: string): void;

  getEnvid(): string;
  setEnvid(value: string): void;

  getGithubusertoken(): string;
  setGithubusertoken(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GenReleaseConfigFromKintoFileRepoRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GenReleaseConfigFromKintoFileRepoRequest): GenReleaseConfigFromKintoFileRepoRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GenReleaseConfigFromKintoFileRepoRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GenReleaseConfigFromKintoFileRepoRequest;
  static deserializeBinaryFromReader(message: GenReleaseConfigFromKintoFileRepoRequest, reader: jspb.BinaryReader): GenReleaseConfigFromKintoFileRepoRequest;
}

export namespace GenReleaseConfigFromKintoFileRepoRequest {
  export type AsObject = {
    blocktype: kkc_models_pb.Block.TypeMap[keyof kkc_models_pb.Block.TypeMap],
    org: string,
    repo: string,
    branch: string,
    envid: string,
    githubusertoken: string,
  }
}

export class SyncTimeRequest extends jspb.Message {
  getSendtimems(): number;
  setSendtimems(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SyncTimeRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SyncTimeRequest): SyncTimeRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SyncTimeRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SyncTimeRequest;
  static deserializeBinaryFromReader(message: SyncTimeRequest, reader: jspb.BinaryReader): SyncTimeRequest;
}

export namespace SyncTimeRequest {
  export type AsObject = {
    sendtimems: number,
  }
}

export class SyncTimeResponse extends jspb.Message {
  getClienttimestampms(): number;
  setClienttimestampms(value: number): void;

  getServertimestampms(): number;
  setServertimestampms(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SyncTimeResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SyncTimeResponse): SyncTimeResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SyncTimeResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SyncTimeResponse;
  static deserializeBinaryFromReader(message: SyncTimeResponse, reader: jspb.BinaryReader): SyncTimeResponse;
}

export namespace SyncTimeResponse {
  export type AsObject = {
    clienttimestampms: number,
    servertimestampms: number,
  }
}

