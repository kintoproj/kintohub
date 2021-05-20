import {
  ACTION_ENV_LOGIN, EnvLoginAction
} from 'states/auth/actions';

import {
  ACTION_DELETE_SERVICE, ACTION_SET_SERVICES_LOADING,
  ACTION_UPDATE_SERVICE_METRICS, ACTION_UPDATE_SERVICE_STATUS,
  ACTION_UPDATE_SERVICES, ServicesActionTypes
} from './actions';
import { ServicesState } from './types';

const initialState: ServicesState = {
  statusMap: {},
  metricsMap: {},
  services: [],
  isServicesLoaded: false,
  isServicesFetching: false,
};

export default function reducer(
  state = initialState,
  action: ServicesActionTypes | EnvLoginAction
): ServicesState {
  switch (action.type) {
    case ACTION_UPDATE_SERVICE_STATUS: {
      const newState: ServicesState = {
        ...state,
        statusMap: { ...state.statusMap },
      };

      action.statusList.forEach((status) => {
        newState.statusMap[status.blockName] = {
          [status.releaseId]: status.state,
        };
      });
      return newState;
    }
    case ACTION_UPDATE_SERVICE_METRICS: {
      return {
        ...state,
        metricsMap: {
          ...state.metricsMap,
          [action.blockName]: action.metrics,
        },
      };
    }
    case ACTION_UPDATE_SERVICES: {
      return {
        ...state,
        services: action.services,
        isServicesLoaded: true,
      };
    }
    case ACTION_SET_SERVICES_LOADING: {
      return {
        ...state,
        isServicesFetching: action.isFetching,
      };
    }
    case ACTION_DELETE_SERVICE: {
      return {
        ...state,
        services: [
          ...state.services.filter((s) => s.object.name !== action.serviceName),
        ],
      };
    }
    case ACTION_ENV_LOGIN:
      {
        return initialState;
      }
    default:
      return state;
  }
}
