import { Block, JobStatus as JobStatusModel } from 'types/proto/models_pb';
import { JobStatus } from 'types/service';
import { toMomentFromTimestamp } from 'libraries/helpers/date';

export const ACTION_SET_SERVICE = 'SET_SERVICE';
export const ACTION_UNSET_SERVICE = 'UNSET_SERVICE';
export const ACTION_UPDATE_SERVICE = 'UPDATE_SERVICE';
export const ACTION_SERVICE_ADD_DOMAIN = 'SERVICE_ADD_DOMAIN';
export const ACTION_SERVICE_REMOVE_DOMAIN = 'SERVICE_REMOVE_DOMAIN';
export const ACTION_UPDATE_JOB_STATUS = 'UPDATE_JOB_STATUS';

export interface SetServiceAction {
  type: typeof ACTION_SET_SERVICE;
  serviceName: string;
}

export interface UnsetServiceAction {
  type: typeof ACTION_UNSET_SERVICE;
}

export interface UpdateServiceAction {
  type: typeof ACTION_UPDATE_SERVICE;
  service: Block;
}

export interface InsertDomainAction {
  type: typeof ACTION_SERVICE_ADD_DOMAIN;
  domain: string;
}

export interface RemoveDomainAction {
  type: typeof ACTION_SERVICE_REMOVE_DOMAIN;
  domain: string;
}

export interface UpdateJobStatusAction {
  type: typeof ACTION_UPDATE_JOB_STATUS;
  instanceName: string;
  status: JobStatus;
}

export const setBrowsingService = (blockName: string): SetServiceAction => ({
  type: ACTION_SET_SERVICE,
  serviceName: blockName,
});

export const unsetBrowsingService = (): UnsetServiceAction => ({
  type: ACTION_UNSET_SERVICE,
});

export const updateService = (service: Block): UpdateServiceAction => ({
  type: ACTION_UPDATE_SERVICE,
  service,
});

export const insertDomain = (domain: string): InsertDomainAction => ({
  type: ACTION_SERVICE_ADD_DOMAIN,
  domain,
});

export const removeDomain = (domain: string): RemoveDomainAction => ({
  type: ACTION_SERVICE_REMOVE_DOMAIN,
  domain,
});

export const updateJobStatus = (
  jobStatus: JobStatusModel
): UpdateJobStatusAction => {
  return {
    type: ACTION_UPDATE_JOB_STATUS,
    instanceName: jobStatus.getInstancename(),
    status: {
      state: jobStatus.getState(),
      startTime: toMomentFromTimestamp(jobStatus.getStarttimestamp()),
      endTime: toMomentFromTimestamp(jobStatus.getEndtimestamp()),
    },
  };
};

export type ServiceActionTypes =
  | SetServiceAction
  | UnsetServiceAction
  | UpdateServiceAction
  | InsertDomainAction
  | UpdateJobStatusAction
  | RemoveDomainAction;
