import {
  Block,
  Release,
  BuildConfig,
  RunConfig,
} from 'types/proto/kkc_models_pb';
import { BlockType } from 'types';

export interface SidePanelState {
  isActive: boolean;
  isFormModified: boolean;
  isDiscardAlertShown: boolean;
  data: SidePanelActionDataTypes;
  nextData: SidePanelActionDataTypes;
}

export type BlockData = {
  type: 'EDIT_SERVICE';
  service: Block;
};

type CreateBlockData = {
  type: 'CREATE_SERVICE';
  tab?: 'catalog' | 'service';
  serviceType?: BlockType;
  hasReachLimit?: boolean;
};

type CreateEnvData = {
  type: 'CREATE_ENV';
};

type EditEnvData = {
  type: 'EDIT_ENV';
  envId: string;
  hasServices: boolean;
};

export type EditReleaseData = {
  type: 'EDIT_RELEASE';
  release: Release;
  service: Block;
  fieldErrors?: { [field: string]: string };
  tabIndex?: number;
  // for updating the initialValues when restoring edit after billing
  buildConfig?: BuildConfig;
  runConfig?: RunConfig;
};

export type CreateReleaseData = {
  type: 'CREATE_RELEASE';
  release: Release;
  service: Block;
  tabIndex?: number;
  // for updating the initialValues when restoring edit after billing
  buildConfig?: BuildConfig;
  runConfig?: RunConfig;
};

export type ViewReleaseLogData = {
  type: 'VIEW_LOGS';
  release: Release;
  service: Block;
};

export type CreateDomainData = {
  type: 'CREATE_DOMAIN';
  domain: string;
  cnameValue: string;
  serviceName: string;
  readOnly?: boolean;
};

export type SidePanelActionDataTypes =
  | BlockData
  | CreateBlockData
  | EditReleaseData
  | CreateReleaseData
  | EditEnvData
  | CreateDomainData
  | ViewReleaseLogData
  | CreateEnvData
  | null;

export type SidePanelActionTypes =
  | 'EDIT_SERVICE'
  | 'CREATE_SERVICE'
  | 'CREATE_DOMAIN'
  | 'EDIT_ENV'
  | 'CREATE_RELEASE'
  | 'EDIT_RELEASE'
  | 'VIEW_LOGS'
  | 'CREATE_ENV';
