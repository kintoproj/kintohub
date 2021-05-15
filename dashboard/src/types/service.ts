import {
  BlockStatus,
  BlockInstance,
  BlockStorage,
  Block,
  BuildConfig,
  JobStatus as JobStatusModel,
  RunConfig
} from 'types/proto/models_pb';
import { Moment } from 'moment';

export interface CreateServiceState {
  serviceData: Uint8Array;
}

export interface FixItState {
  shouldOpenEditPage: boolean;
  fieldErrors?: { [field: string]: string };
}

export interface EnvVar {
  key: string;
  value: string;
}

export interface EditServicePageValues {
  name: string;

  // Repo related
  repository: string; // this is not editable
  branch: string;
  repoToken: string; // mutually exclusive with repoGithubInstallationId
  repoGithubInstallationId: string; // deprecated. use repoGithubAccessToken instead
  repoGithubAccessToken: string;

  // ---
  buildCommand: string;
  startCommand: string;
  language: LanguageType;
  languageVersion: string;
  dockerfile: string;
  port: string;
  subfolderPath: string;
  protocol: ProtocolType;

  // only for static websites
  staticOutputPath: string;

  envVars: EnvVar[];
  enabledDedicatedCPU: boolean;
  cpuIndex: number;
  memoryIndex: number;
  enabledAutoScaling: boolean;
  autoScalingRangeIndice: number[];
  enabledSleepMode: boolean;
  deployTimeoutIndex: number;
  jobTimeOutIndex: number;
  jobCronPattern: string;
  isCronJob: boolean;
}

export interface ServiceStateMap {
  [releaseId: string]: ServiceStateType;
}

export type JobStatus = {
  state: JobStateType;
  startTime: Moment | null;
  endTime: Moment | null;
};

/*
  The reason why we don't use the types from protobuf is that
  we need to store the object into redux so it must be plain js object
  AsObject wont handle the map correctly
*/

export interface ServiceMetrics {
  blockName: string;
  instances: {
    [name: string]: BlockInstance.AsObject;
  };
  storages: {
    [name: string]: BlockStorage.AsObject;
  };
}

export type ServiceStateType = BlockStatus.StateMap[keyof BlockStatus.StateMap];
export type ServiceType = Block.TypeMap[keyof Block.TypeMap];
export type LanguageType = BuildConfig.LanguageMap[keyof BuildConfig.LanguageMap];
export type ProtocolType = RunConfig.ProtocolMap[keyof RunConfig.ProtocolMap];

export type JobStateType = JobStatusModel.StateMap[keyof JobStatusModel.StateMap];

export type PodStateType = BlockInstance.StateMap[keyof BlockInstance.StateMap];
