import { getAuthState } from 'libraries/localstorage';
import _cloneDeep from 'lodash.clonedeep';
import { ACTION_UPDATE_KINTO_CONFIG, UpdateKintoConfigAction } from 'states/app/actions';

import {
  ACTION_DELETE_ENV,
  ACTION_ENV_LOGIN,
  ACTION_UPDATE_ENV_LIST,
  ACTION_UPDATE_ENV_NAME,
  ACTION_UPDATE_TOKEN,
  AuthActionsTypes
} from './actions';
import { AuthState } from './types';

export const initialState = getAuthState();

export default function systemReducer(
  state = initialState,
  action: AuthActionsTypes | UpdateKintoConfigAction
): AuthState {
  switch (action.type) {
    case ACTION_ENV_LOGIN: {
      return {
        ...state,
        envId: action.envId,
      };
    }
    case ACTION_UPDATE_KINTO_CONFIG: {
      return {
        ...state,
        isConfigLoaded: true,
      };
    }
    case ACTION_UPDATE_ENV_LIST: {
      return {
        ...state,
        environments: action.envList,
      };
    }
    case ACTION_DELETE_ENV: {
      return {
        ...state,
        environments: [
          ...state.environments.filter((e) => e.envId !== action.envId),
        ],
      };
    }
    case ACTION_UPDATE_ENV_NAME: {
      const environments = _cloneDeep(state.environments);
      const env = environments.find((e) => e.envId === action.envId);
      if (env) {
        env.name = action.envName;
      }
      return {
        ...state,
        environments,
      };
    }
    case ACTION_UPDATE_TOKEN: {
      return {
        ...state,
        token: action.token,
      }
    }
    default:
      return state;
  }
}
