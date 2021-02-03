import { JobStatus } from 'types/proto/kkc_models_pb';
import {
  ServiceActionTypes,
  ACTION_SET_SERVICE,
  ACTION_UNSET_SERVICE,
  ACTION_UPDATE_SERVICE,
  ACTION_SERVICE_ADD_DOMAIN,
  ACTION_SERVICE_REMOVE_DOMAIN,
  ACTION_UPDATE_JOB_STATUS,
} from './actions';
import { ServiceState } from './types';

const initialState: ServiceState = {
  serviceName: '',
  domains: [],
  jobStatusMap: {},
};

export default function reducer(
  state = initialState,
  action: ServiceActionTypes
): ServiceState {
  switch (action.type) {
    case ACTION_SET_SERVICE: {
      return {
        ...initialState,
        serviceName: action.serviceName,
      };
    }
    case ACTION_UNSET_SERVICE: {
      return initialState;
    }
    case ACTION_UPDATE_SERVICE: {
      if (action.service.getName() !== state.serviceName) {
        return state;
      }
      return {
        ...state,
        domains: action.service.getCustomdomainsList(),
      };
    }
    case ACTION_SERVICE_ADD_DOMAIN: {
      return {
        ...state,
        domains: [...state.domains, action.domain],
      };
    }
    case ACTION_UPDATE_JOB_STATUS: {
      // if it is deleted, remove it from the map
      if (action.status.state === JobStatus.State.DELETED) {
        const jobStatusMap = {
          ...state.jobStatusMap,
        };
        delete jobStatusMap[action.instanceName];
        return {
          ...state,
          jobStatusMap,
        };
      }
      return {
        ...state,
        jobStatusMap: {
          ...state.jobStatusMap,
          [action.instanceName]: action.status,
        },
      };
    }
    case ACTION_SERVICE_REMOVE_DOMAIN: {
      return {
        ...state,
        domains: state.domains.filter((d) => d !== action.domain),
      };
    }
    default:
      return state;
  }
}
