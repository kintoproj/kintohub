// package: 
// file: models.proto

import * as jspb from "google-protobuf";
import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb";

export class Environment extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getName(): string;
  setName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Environment.AsObject;
  static toObject(includeInstance: boolean, msg: Environment): Environment.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Environment, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Environment;
  static deserializeBinaryFromReader(message: Environment, reader: jspb.BinaryReader): Environment;
}

export namespace Environment {
  export type AsObject = {
    id: string,
    name: string,
  }
}

export class Environments extends jspb.Message {
  clearItemsList(): void;
  getItemsList(): Array<Environment>;
  setItemsList(value: Array<Environment>): void;
  addItems(value?: Environment, index?: number): Environment;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Environments.AsObject;
  static toObject(includeInstance: boolean, msg: Environments): Environments.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Environments, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Environments;
  static deserializeBinaryFromReader(message: Environments, reader: jspb.BinaryReader): Environments;
}

export namespace Environments {
  export type AsObject = {
    itemsList: Array<Environment.AsObject>,
  }
}

export class Block extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getName(): string;
  setName(value: string): void;

  getEnvid(): string;
  setEnvid(value: string): void;

  getDisplayname(): string;
  setDisplayname(value: string): void;

  getReleasesMap(): jspb.Map<string, Release>;
  clearReleasesMap(): void;
  clearCustomdomainsList(): void;
  getCustomdomainsList(): Array<string>;
  setCustomdomainsList(value: Array<string>): void;
  addCustomdomains(value: string, index?: number): string;

  getIspublicurl(): boolean;
  setIspublicurl(value: boolean): void;

  getParentblockname(): string;
  setParentblockname(value: string): void;

  getParentblockenvid(): string;
  setParentblockenvid(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Block.AsObject;
  static toObject(includeInstance: boolean, msg: Block): Block.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Block, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Block;
  static deserializeBinaryFromReader(message: Block, reader: jspb.BinaryReader): Block;
}

export namespace Block {
  export type AsObject = {
    id: string,
    name: string,
    envid: string,
    displayname: string,
    releasesMap: Array<[string, Release.AsObject]>,
    customdomainsList: Array<string>,
    ispublicurl: boolean,
    parentblockname: string,
    parentblockenvid: string,
  }

  export interface TypeMap {
    NOT_SET: 0;
    BACKEND_API: 1;
    STATIC_SITE: 2;
    WEB_APP: 3;
    JAMSTACK: 4;
    JOB: 5;
    CRON_JOB: 6;
    WORKER: 7;
    CATALOG: 8;
    HELM: 9;
  }

  export const Type: TypeMap;
}

export class Blocks extends jspb.Message {
  clearItemsList(): void;
  getItemsList(): Array<Block>;
  setItemsList(value: Array<Block>): void;
  addItems(value?: Block, index?: number): Block;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Blocks.AsObject;
  static toObject(includeInstance: boolean, msg: Blocks): Blocks.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Blocks, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Blocks;
  static deserializeBinaryFromReader(message: Blocks, reader: jspb.BinaryReader): Blocks;
}

export namespace Blocks {
  export type AsObject = {
    itemsList: Array<Block.AsObject>,
  }
}

export class Release extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  hasCreatedat(): boolean;
  clearCreatedat(): void;
  getCreatedat(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedat(value?: google_protobuf_timestamp_pb.Timestamp): void;

  hasBuildconfig(): boolean;
  clearBuildconfig(): void;
  getBuildconfig(): BuildConfig | undefined;
  setBuildconfig(value?: BuildConfig): void;

  hasRunconfig(): boolean;
  clearRunconfig(): void;
  getRunconfig(): RunConfig | undefined;
  setRunconfig(value?: RunConfig): void;

  hasStatus(): boolean;
  clearStatus(): void;
  getStatus(): Status | undefined;
  setStatus(value?: Status): void;

  hasStartedat(): boolean;
  clearStartedat(): void;
  getStartedat(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setStartedat(value?: google_protobuf_timestamp_pb.Timestamp): void;

  hasEndedat(): boolean;
  clearEndedat(): void;
  getEndedat(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setEndedat(value?: google_protobuf_timestamp_pb.Timestamp): void;

  getType(): Release.TypeMap[keyof Release.TypeMap];
  setType(value: Release.TypeMap[keyof Release.TypeMap]): void;

  clearTagsList(): void;
  getTagsList(): Array<string>;
  setTagsList(value: Array<string>): void;
  addTags(value: string, index?: number): string;

  getCommitsha(): string;
  setCommitsha(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Release.AsObject;
  static toObject(includeInstance: boolean, msg: Release): Release.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Release, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Release;
  static deserializeBinaryFromReader(message: Release, reader: jspb.BinaryReader): Release;
}

export namespace Release {
  export type AsObject = {
    id: string,
    createdat?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    buildconfig?: BuildConfig.AsObject,
    runconfig?: RunConfig.AsObject,
    status?: Status.AsObject,
    startedat?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    endedat?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    type: Release.TypeMap[keyof Release.TypeMap],
    tagsList: Array<string>,
    commitsha: string,
  }

  export interface TypeMap {
    NOT_SET: 0;
    DEPLOY: 1;
    UNDEPLOY: 2;
    SUSPEND: 3;
    ROLLBACK: 4;
  }

  export const Type: TypeMap;
}

export class BuildConfig extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getImage(): string;
  setImage(value: string): void;

  getLanguage(): BuildConfig.LanguageMap[keyof BuildConfig.LanguageMap];
  setLanguage(value: BuildConfig.LanguageMap[keyof BuildConfig.LanguageMap]): void;

  getLanguageversion(): string;
  setLanguageversion(value: string): void;

  getBuildcommand(): string;
  setBuildcommand(value: string): void;

  getRuncommand(): string;
  setRuncommand(value: string): void;

  getPathtocode(): string;
  setPathtocode(value: string): void;

  getPathtostaticoutput(): string;
  setPathtostaticoutput(value: string): void;

  getDockerfilefilename(): string;
  setDockerfilefilename(value: string): void;

  getBuildargsMap(): jspb.Map<string, string>;
  clearBuildargsMap(): void;
  hasRepository(): boolean;
  clearRepository(): void;
  getRepository(): Repository | undefined;
  setRepository(value?: Repository): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BuildConfig.AsObject;
  static toObject(includeInstance: boolean, msg: BuildConfig): BuildConfig.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BuildConfig, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BuildConfig;
  static deserializeBinaryFromReader(message: BuildConfig, reader: jspb.BinaryReader): BuildConfig;
}

export namespace BuildConfig {
  export type AsObject = {
    id: string,
    image: string,
    language: BuildConfig.LanguageMap[keyof BuildConfig.LanguageMap],
    languageversion: string,
    buildcommand: string,
    runcommand: string,
    pathtocode: string,
    pathtostaticoutput: string,
    dockerfilefilename: string,
    buildargsMap: Array<[string, string]>,
    repository?: Repository.AsObject,
  }

  export interface LanguageMap {
    NOT_SET: 0;
    DOCKERFILE: 1;
    GOLANG: 2;
    NODEJS: 3;
    PYTHON: 4;
    JAVA: 5;
    RUBY: 6;
    PHP: 7;
    RUST: 8;
    ELIXIR: 9;
  }

  export const Language: LanguageMap;
}

export class RunConfig extends jspb.Message {
  getType(): Block.TypeMap[keyof Block.TypeMap];
  setType(value: Block.TypeMap[keyof Block.TypeMap]): void;

  getPort(): string;
  setPort(value: string): void;

  hasAutoscaling(): boolean;
  clearAutoscaling(): void;
  getAutoscaling(): AutoScaling | undefined;
  setAutoscaling(value?: AutoScaling): void;

  getEnvvarsMap(): jspb.Map<string, string>;
  clearEnvvarsMap(): void;
  hasResources(): boolean;
  clearResources(): void;
  getResources(): Resources | undefined;
  setResources(value?: Resources): void;

  getTimeoutinsec(): number;
  setTimeoutinsec(value: number): void;

  hasJobspec(): boolean;
  clearJobspec(): void;
  getJobspec(): JobSpec | undefined;
  setJobspec(value?: JobSpec): void;

  getHost(): string;
  setHost(value: string): void;

  getCostoptimizationenabled(): boolean;
  setCostoptimizationenabled(value: boolean): void;

  getSleepmodeenabled(): boolean;
  setSleepmodeenabled(value: boolean): void;

  getProtocol(): RunConfig.ProtocolMap[keyof RunConfig.ProtocolMap];
  setProtocol(value: RunConfig.ProtocolMap[keyof RunConfig.ProtocolMap]): void;

  getSleepmodettlseconds(): number;
  setSleepmodettlseconds(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RunConfig.AsObject;
  static toObject(includeInstance: boolean, msg: RunConfig): RunConfig.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RunConfig, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RunConfig;
  static deserializeBinaryFromReader(message: RunConfig, reader: jspb.BinaryReader): RunConfig;
}

export namespace RunConfig {
  export type AsObject = {
    type: Block.TypeMap[keyof Block.TypeMap],
    port: string,
    autoscaling?: AutoScaling.AsObject,
    envvarsMap: Array<[string, string]>,
    resources?: Resources.AsObject,
    timeoutinsec: number,
    jobspec?: JobSpec.AsObject,
    host: string,
    costoptimizationenabled: boolean,
    sleepmodeenabled: boolean,
    protocol: RunConfig.ProtocolMap[keyof RunConfig.ProtocolMap],
    sleepmodettlseconds: number,
  }

  export interface ProtocolMap {
    NOT_SET: 0;
    HTTP: 1;
    GRPC: 2;
  }

  export const Protocol: ProtocolMap;
}

export class Repository extends jspb.Message {
  getUrl(): string;
  setUrl(value: string): void;

  getAccesstoken(): string;
  setAccesstoken(value: string): void;

  getBranch(): string;
  setBranch(value: string): void;

  getGithubinstallationid(): string;
  setGithubinstallationid(value: string): void;

  getGithubusertoken(): string;
  setGithubusertoken(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Repository.AsObject;
  static toObject(includeInstance: boolean, msg: Repository): Repository.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Repository, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Repository;
  static deserializeBinaryFromReader(message: Repository, reader: jspb.BinaryReader): Repository;
}

export namespace Repository {
  export type AsObject = {
    url: string,
    accesstoken: string,
    branch: string,
    githubinstallationid: string,
    githubusertoken: string,
  }
}

export class JobSpec extends jspb.Message {
  getCronpattern(): string;
  setCronpattern(value: string): void;

  getTimeoutinsec(): number;
  setTimeoutinsec(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): JobSpec.AsObject;
  static toObject(includeInstance: boolean, msg: JobSpec): JobSpec.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: JobSpec, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): JobSpec;
  static deserializeBinaryFromReader(message: JobSpec, reader: jspb.BinaryReader): JobSpec;
}

export namespace JobSpec {
  export type AsObject = {
    cronpattern: string,
    timeoutinsec: number,
  }
}

export class AutoScaling extends jspb.Message {
  getMin(): number;
  setMin(value: number): void;

  getMax(): number;
  setMax(value: number): void;

  getCpupercent(): number;
  setCpupercent(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AutoScaling.AsObject;
  static toObject(includeInstance: boolean, msg: AutoScaling): AutoScaling.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AutoScaling, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AutoScaling;
  static deserializeBinaryFromReader(message: AutoScaling, reader: jspb.BinaryReader): AutoScaling;
}

export namespace AutoScaling {
  export type AsObject = {
    min: number,
    max: number,
    cpupercent: number,
  }
}

export class Resources extends jspb.Message {
  getMemoryinmb(): number;
  setMemoryinmb(value: number): void;

  getCpuincore(): number;
  setCpuincore(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Resources.AsObject;
  static toObject(includeInstance: boolean, msg: Resources): Resources.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Resources, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Resources;
  static deserializeBinaryFromReader(message: Resources, reader: jspb.BinaryReader): Resources;
}

export namespace Resources {
  export type AsObject = {
    memoryinmb: number,
    cpuincore: number,
  }
}

export class Status extends jspb.Message {
  getState(): Status.StateMap[keyof Status.StateMap];
  setState(value: Status.StateMap[keyof Status.StateMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Status.AsObject;
  static toObject(includeInstance: boolean, msg: Status): Status.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Status, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Status;
  static deserializeBinaryFromReader(message: Status, reader: jspb.BinaryReader): Status;
}

export namespace Status {
  export type AsObject = {
    state: Status.StateMap[keyof Status.StateMap],
  }

  export interface StateMap {
    NOT_SET: 0;
    FAIL: 1;
    SUCCESS: 2;
    RUNNING: 3;
    PENDING: 4;
    ABORTED: 5;
    REVIEW_DEPLOY: 6;
  }

  export const State: StateMap;
}

export class ReleasesStatus extends jspb.Message {
  getBlockname(): string;
  setBlockname(value: string): void;

  getEnvid(): string;
  setEnvid(value: string): void;

  getReleasesMap(): jspb.Map<string, Status>;
  clearReleasesMap(): void;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ReleasesStatus.AsObject;
  static toObject(includeInstance: boolean, msg: ReleasesStatus): ReleasesStatus.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ReleasesStatus, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ReleasesStatus;
  static deserializeBinaryFromReader(message: ReleasesStatus, reader: jspb.BinaryReader): ReleasesStatus;
}

export namespace ReleasesStatus {
  export type AsObject = {
    blockname: string,
    envid: string,
    releasesMap: Array<[string, Status.AsObject]>,
  }
}

export class BuildStatus extends jspb.Message {
  getState(): BuildStatus.StateMap[keyof BuildStatus.StateMap];
  setState(value: BuildStatus.StateMap[keyof BuildStatus.StateMap]): void;

  hasStarttime(): boolean;
  clearStarttime(): void;
  getStarttime(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setStarttime(value?: google_protobuf_timestamp_pb.Timestamp): void;

  hasFinishtime(): boolean;
  clearFinishtime(): void;
  getFinishtime(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setFinishtime(value?: google_protobuf_timestamp_pb.Timestamp): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BuildStatus.AsObject;
  static toObject(includeInstance: boolean, msg: BuildStatus): BuildStatus.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BuildStatus, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BuildStatus;
  static deserializeBinaryFromReader(message: BuildStatus, reader: jspb.BinaryReader): BuildStatus;
}

export namespace BuildStatus {
  export type AsObject = {
    state: BuildStatus.StateMap[keyof BuildStatus.StateMap],
    starttime?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    finishtime?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }

  export interface StateMap {
    NOT_SET: 0;
    UNKNOWN: 1;
    QUEUED: 2;
    WORKING: 3;
    SUCCESS: 4;
    FAILURE: 5;
    INTERNAL_ERROR: 6;
    TIMEOUT: 7;
    CANCELLED: 8;
    EXPIRED: 9;
  }

  export const State: StateMap;
}

export class ConsoleLog extends jspb.Message {
  getInstancename(): string;
  setInstancename(value: string): void;

  getData(): Uint8Array | string;
  getData_asU8(): Uint8Array;
  getData_asB64(): string;
  setData(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ConsoleLog.AsObject;
  static toObject(includeInstance: boolean, msg: ConsoleLog): ConsoleLog.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ConsoleLog, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ConsoleLog;
  static deserializeBinaryFromReader(message: ConsoleLog, reader: jspb.BinaryReader): ConsoleLog;
}

export namespace ConsoleLog {
  export type AsObject = {
    instancename: string,
    data: Uint8Array | string,
  }
}

export class BlockStatus extends jspb.Message {
  getBlockname(): string;
  setBlockname(value: string): void;

  getEnvid(): string;
  setEnvid(value: string): void;

  getReleaseid(): string;
  setReleaseid(value: string): void;

  getState(): BlockStatus.StateMap[keyof BlockStatus.StateMap];
  setState(value: BlockStatus.StateMap[keyof BlockStatus.StateMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BlockStatus.AsObject;
  static toObject(includeInstance: boolean, msg: BlockStatus): BlockStatus.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BlockStatus, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BlockStatus;
  static deserializeBinaryFromReader(message: BlockStatus, reader: jspb.BinaryReader): BlockStatus;
}

export namespace BlockStatus {
  export type AsObject = {
    blockname: string,
    envid: string,
    releaseid: string,
    state: BlockStatus.StateMap[keyof BlockStatus.StateMap],
  }

  export interface StateMap {
    NOT_SET: 0;
    HEALTHY: 1;
    UNHEALTHY: 2;
    SUSPENDED: 3;
    SLEEPING: 4;
  }

  export const State: StateMap;
}

export class BlockStatuses extends jspb.Message {
  clearBlockstatusesList(): void;
  getBlockstatusesList(): Array<BlockStatus>;
  setBlockstatusesList(value: Array<BlockStatus>): void;
  addBlockstatuses(value?: BlockStatus, index?: number): BlockStatus;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BlockStatuses.AsObject;
  static toObject(includeInstance: boolean, msg: BlockStatuses): BlockStatuses.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BlockStatuses, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BlockStatuses;
  static deserializeBinaryFromReader(message: BlockStatuses, reader: jspb.BinaryReader): BlockStatuses;
}

export namespace BlockStatuses {
  export type AsObject = {
    blockstatusesList: Array<BlockStatus.AsObject>,
  }
}

export class BlockMetrics extends jspb.Message {
  getBlockname(): string;
  setBlockname(value: string): void;

  getEnvid(): string;
  setEnvid(value: string): void;

  getInstancesMap(): jspb.Map<string, BlockInstance>;
  clearInstancesMap(): void;
  getStoragesMap(): jspb.Map<string, BlockStorage>;
  clearStoragesMap(): void;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BlockMetrics.AsObject;
  static toObject(includeInstance: boolean, msg: BlockMetrics): BlockMetrics.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BlockMetrics, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BlockMetrics;
  static deserializeBinaryFromReader(message: BlockMetrics, reader: jspb.BinaryReader): BlockMetrics;
}

export namespace BlockMetrics {
  export type AsObject = {
    blockname: string,
    envid: string,
    instancesMap: Array<[string, BlockInstance.AsObject]>,
    storagesMap: Array<[string, BlockStorage.AsObject]>,
  }
}

export class BlockInstance extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getReleaseid(): string;
  setReleaseid(value: string): void;

  getCpurequests(): number;
  setCpurequests(value: number): void;

  getCpuusage(): number;
  setCpuusage(value: number): void;

  getMemrequests(): number;
  setMemrequests(value: number): void;

  getMemusage(): number;
  setMemusage(value: number): void;

  getRestarts(): number;
  setRestarts(value: number): void;

  getState(): BlockInstance.StateMap[keyof BlockInstance.StateMap];
  setState(value: BlockInstance.StateMap[keyof BlockInstance.StateMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BlockInstance.AsObject;
  static toObject(includeInstance: boolean, msg: BlockInstance): BlockInstance.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BlockInstance, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BlockInstance;
  static deserializeBinaryFromReader(message: BlockInstance, reader: jspb.BinaryReader): BlockInstance;
}

export namespace BlockInstance {
  export type AsObject = {
    name: string,
    releaseid: string,
    cpurequests: number,
    cpuusage: number,
    memrequests: number,
    memusage: number,
    restarts: number,
    state: BlockInstance.StateMap[keyof BlockInstance.StateMap],
  }

  export interface StateMap {
    NOT_SET: 0;
    RUNNING: 1;
    COMPLETED: 2;
    ERROR: 3;
    OOM_KILLED: 4;
  }

  export const State: StateMap;
}

export class BlockStorage extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getCapacityinbytes(): number;
  setCapacityinbytes(value: number): void;

  getUsagepercent(): string;
  setUsagepercent(value: string): void;

  getMountpath(): string;
  setMountpath(value: string): void;

  getInstanceid(): string;
  setInstanceid(value: string): void;

  getMountedusageinbytes(): number;
  setMountedusageinbytes(value: number): void;

  getMountedcapacityinbytes(): number;
  setMountedcapacityinbytes(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BlockStorage.AsObject;
  static toObject(includeInstance: boolean, msg: BlockStorage): BlockStorage.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BlockStorage, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BlockStorage;
  static deserializeBinaryFromReader(message: BlockStorage, reader: jspb.BinaryReader): BlockStorage;
}

export namespace BlockStorage {
  export type AsObject = {
    name: string,
    capacityinbytes: number,
    usagepercent: string,
    mountpath: string,
    instanceid: string,
    mountedusageinbytes: number,
    mountedcapacityinbytes: number,
  }
}

export class BlocksMetrics extends jspb.Message {
  getBlocksMap(): jspb.Map<string, BlockMetrics>;
  clearBlocksMap(): void;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BlocksMetrics.AsObject;
  static toObject(includeInstance: boolean, msg: BlocksMetrics): BlocksMetrics.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BlocksMetrics, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BlocksMetrics;
  static deserializeBinaryFromReader(message: BlocksMetrics, reader: jspb.BinaryReader): BlocksMetrics;
}

export namespace BlocksMetrics {
  export type AsObject = {
    blocksMap: Array<[string, BlockMetrics.AsObject]>,
  }
}

export class Language extends jspb.Message {
  getLanguage(): BuildConfig.LanguageMap[keyof BuildConfig.LanguageMap];
  setLanguage(value: BuildConfig.LanguageMap[keyof BuildConfig.LanguageMap]): void;

  getImage(): string;
  setImage(value: string): void;

  getVersionstagsMap(): jspb.Map<string, string>;
  clearVersionstagsMap(): void;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Language.AsObject;
  static toObject(includeInstance: boolean, msg: Language): Language.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Language, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Language;
  static deserializeBinaryFromReader(message: Language, reader: jspb.BinaryReader): Language;
}

export namespace Language {
  export type AsObject = {
    language: BuildConfig.LanguageMap[keyof BuildConfig.LanguageMap],
    image: string,
    versionstagsMap: Array<[string, string]>,
  }
}

export class MemoryOptions extends jspb.Message {
  getDefaultvalue(): number;
  setDefaultvalue(value: number): void;

  clearValuesList(): void;
  getValuesList(): Array<number>;
  setValuesList(value: Array<number>): void;
  addValues(value: number, index?: number): number;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MemoryOptions.AsObject;
  static toObject(includeInstance: boolean, msg: MemoryOptions): MemoryOptions.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MemoryOptions, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MemoryOptions;
  static deserializeBinaryFromReader(message: MemoryOptions, reader: jspb.BinaryReader): MemoryOptions;
}

export namespace MemoryOptions {
  export type AsObject = {
    defaultvalue: number,
    valuesList: Array<number>,
  }
}

export class CPUOptions extends jspb.Message {
  getDefaultvalue(): number;
  setDefaultvalue(value: number): void;

  clearValuesList(): void;
  getValuesList(): Array<number>;
  setValuesList(value: Array<number>): void;
  addValues(value: number, index?: number): number;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CPUOptions.AsObject;
  static toObject(includeInstance: boolean, msg: CPUOptions): CPUOptions.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CPUOptions, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CPUOptions;
  static deserializeBinaryFromReader(message: CPUOptions, reader: jspb.BinaryReader): CPUOptions;
}

export namespace CPUOptions {
  export type AsObject = {
    defaultvalue: number,
    valuesList: Array<number>,
  }
}

export class TimeoutOptions extends jspb.Message {
  getDefaultvalue(): number;
  setDefaultvalue(value: number): void;

  clearValuesList(): void;
  getValuesList(): Array<number>;
  setValuesList(value: Array<number>): void;
  addValues(value: number, index?: number): number;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TimeoutOptions.AsObject;
  static toObject(includeInstance: boolean, msg: TimeoutOptions): TimeoutOptions.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TimeoutOptions, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TimeoutOptions;
  static deserializeBinaryFromReader(message: TimeoutOptions, reader: jspb.BinaryReader): TimeoutOptions;
}

export namespace TimeoutOptions {
  export type AsObject = {
    defaultvalue: number,
    valuesList: Array<number>,
  }
}

export class AutoScalingOptions extends jspb.Message {
  getDefaultminvalue(): number;
  setDefaultminvalue(value: number): void;

  getDefaultmaxvalue(): number;
  setDefaultmaxvalue(value: number): void;

  clearValuesList(): void;
  getValuesList(): Array<number>;
  setValuesList(value: Array<number>): void;
  addValues(value: number, index?: number): number;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AutoScalingOptions.AsObject;
  static toObject(includeInstance: boolean, msg: AutoScalingOptions): AutoScalingOptions.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AutoScalingOptions, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AutoScalingOptions;
  static deserializeBinaryFromReader(message: AutoScalingOptions, reader: jspb.BinaryReader): AutoScalingOptions;
}

export namespace AutoScalingOptions {
  export type AsObject = {
    defaultminvalue: number,
    defaultmaxvalue: number,
    valuesList: Array<number>,
  }
}

export class KintoConfiguration extends jspb.Message {
  clearLanguagesList(): void;
  getLanguagesList(): Array<Language>;
  setLanguagesList(value: Array<Language>): void;
  addLanguages(value?: Language, index?: number): Language;

  hasMemoryoptions(): boolean;
  clearMemoryoptions(): void;
  getMemoryoptions(): MemoryOptions | undefined;
  setMemoryoptions(value?: MemoryOptions): void;

  hasCpuoptions(): boolean;
  clearCpuoptions(): void;
  getCpuoptions(): CPUOptions | undefined;
  setCpuoptions(value?: CPUOptions): void;

  hasTimeoutoptions(): boolean;
  clearTimeoutoptions(): void;
  getTimeoutoptions(): TimeoutOptions | undefined;
  setTimeoutoptions(value?: TimeoutOptions): void;

  hasAutoscalingoptions(): boolean;
  clearAutoscalingoptions(): void;
  getAutoscalingoptions(): AutoScalingOptions | undefined;
  setAutoscalingoptions(value?: AutoScalingOptions): void;

  hasJobtimeoutoptions(): boolean;
  clearJobtimeoutoptions(): void;
  getJobtimeoutoptions(): TimeoutOptions | undefined;
  setJobtimeoutoptions(value?: TimeoutOptions): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): KintoConfiguration.AsObject;
  static toObject(includeInstance: boolean, msg: KintoConfiguration): KintoConfiguration.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: KintoConfiguration, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): KintoConfiguration;
  static deserializeBinaryFromReader(message: KintoConfiguration, reader: jspb.BinaryReader): KintoConfiguration;
}

export namespace KintoConfiguration {
  export type AsObject = {
    languagesList: Array<Language.AsObject>,
    memoryoptions?: MemoryOptions.AsObject,
    cpuoptions?: CPUOptions.AsObject,
    timeoutoptions?: TimeoutOptions.AsObject,
    autoscalingoptions?: AutoScalingOptions.AsObject,
    jobtimeoutoptions?: TimeoutOptions.AsObject,
  }
}

export class Logs extends jspb.Message {
  getData(): Uint8Array | string;
  getData_asU8(): Uint8Array;
  getData_asB64(): string;
  setData(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Logs.AsObject;
  static toObject(includeInstance: boolean, msg: Logs): Logs.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Logs, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Logs;
  static deserializeBinaryFromReader(message: Logs, reader: jspb.BinaryReader): Logs;
}

export namespace Logs {
  export type AsObject = {
    data: Uint8Array | string,
  }
}

export class JobStatus extends jspb.Message {
  getInstancename(): string;
  setInstancename(value: string): void;

  getState(): JobStatus.StateMap[keyof JobStatus.StateMap];
  setState(value: JobStatus.StateMap[keyof JobStatus.StateMap]): void;

  getStarttimestamp(): number;
  setStarttimestamp(value: number): void;

  getEndtimestamp(): number;
  setEndtimestamp(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): JobStatus.AsObject;
  static toObject(includeInstance: boolean, msg: JobStatus): JobStatus.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: JobStatus, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): JobStatus;
  static deserializeBinaryFromReader(message: JobStatus, reader: jspb.BinaryReader): JobStatus;
}

export namespace JobStatus {
  export type AsObject = {
    instancename: string,
    state: JobStatus.StateMap[keyof JobStatus.StateMap],
    starttimestamp: number,
    endtimestamp: number,
  }

  export interface StateMap {
    NOT_SET: 0;
    PENDING: 1;
    RUNNING: 2;
    COMPLETED: 3;
    DELETED: 4;
    ERROR: 5;
    OOM_KILLED: 6;
  }

  export const State: StateMap;
}

export class TeleportServiceData extends jspb.Message {
  getHost(): string;
  setHost(value: string): void;

  getCredentials(): string;
  setCredentials(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TeleportServiceData.AsObject;
  static toObject(includeInstance: boolean, msg: TeleportServiceData): TeleportServiceData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TeleportServiceData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TeleportServiceData;
  static deserializeBinaryFromReader(message: TeleportServiceData, reader: jspb.BinaryReader): TeleportServiceData;
}

export namespace TeleportServiceData {
  export type AsObject = {
    host: string,
    credentials: string,
  }
}

export class ReleaseConfig extends jspb.Message {
  hasBuildconfig(): boolean;
  clearBuildconfig(): void;
  getBuildconfig(): BuildConfig | undefined;
  setBuildconfig(value?: BuildConfig): void;

  hasRunconfig(): boolean;
  clearRunconfig(): void;
  getRunconfig(): RunConfig | undefined;
  setRunconfig(value?: RunConfig): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ReleaseConfig.AsObject;
  static toObject(includeInstance: boolean, msg: ReleaseConfig): ReleaseConfig.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ReleaseConfig, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ReleaseConfig;
  static deserializeBinaryFromReader(message: ReleaseConfig, reader: jspb.BinaryReader): ReleaseConfig;
}

export namespace ReleaseConfig {
  export type AsObject = {
    buildconfig?: BuildConfig.AsObject,
    runconfig?: RunConfig.AsObject,
  }
}

