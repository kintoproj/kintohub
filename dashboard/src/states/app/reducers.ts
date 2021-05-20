import { LOCATION_CHANGE, LocationChangeAction } from 'connected-react-router';
import { getIsDarkMode } from 'libraries/localstorage';
import {
  AutoScalingOptions,
  CPUOptions,
  MemoryOptions,
  TimeoutOptions,
} from 'types/proto/models_pb';

import {
  ACTION_DISMISS_NOTIFICATION,
  ACTION_ENQUEUE_NOTIFICATION,
  ACTION_REMOVE_NOTIFICATION,
  ACTION_SET_INITIAL_LOADING,
  ACTION_SET_LOADING,
  ACTION_SYNC_TIME,
  ACTION_TOOGLE_DARK_MODE,
  ACTION_UPDATE_KINTO_CONFIG,
  AppActionTypes,
} from './actions';
import { AppState } from './types';

const initialState: AppState = {
  notifications: [],
  isLoading: false,
  isInitialLoading: true,
  config: {
    languages: {},
    memoryOptions: new MemoryOptions().toObject(),
    cpuOptions: new CPUOptions().toObject(),
    timeoutOptions: new TimeoutOptions().toObject(),
    autoScalingOptions: new AutoScalingOptions().toObject(),
    jobTimeoutOptions: new TimeoutOptions().toObject(),
  },
  isDarkMode: getIsDarkMode(),
  serverTimeOffset: 0,
};

export default function appReducer(
  state = initialState,
  action: AppActionTypes | LocationChangeAction
): AppState {
  switch (action.type) {
    case ACTION_ENQUEUE_NOTIFICATION: {
      const { notifications } = state;
      if (!notifications.find((n) => n.key === action.message.key)) {
        notifications.push(action.message);
      }
      return {
        ...state,
        notifications: [...notifications],
      };
    }
    case ACTION_DISMISS_NOTIFICATION:
    case ACTION_REMOVE_NOTIFICATION: {
      if (action.key === null) {
        return {
          ...state,
          notifications: [],
        };
      }
      return {
        ...state,
        notifications: state.notifications.filter((m) => m.key !== action.key),
      };
    }
    case ACTION_SET_LOADING: {
      return {
        ...state,
        isLoading: action.isLoading,
      };
    }
    case ACTION_SET_INITIAL_LOADING: {
      return {
        ...state,
        isInitialLoading: action.isLoading,
      };
    }
    case ACTION_UPDATE_KINTO_CONFIG: {
      return {
        ...state,
        config: action.config,
      };
    }
    case ACTION_TOOGLE_DARK_MODE: {
      return {
        ...state,
        isDarkMode: action.enableDarkMode,
      };
    }
    // when location change, reset the isLoading and isFormModified
    case LOCATION_CHANGE: {
      return {
        ...state,
        isLoading: false,
        notifications: [],
      };
    }
    case ACTION_SYNC_TIME: {
      return {
        ...state,
        serverTimeOffset:
          action.clientReceiveTimestamp - action.serverReceiveTimestamp,
      };
    }
    default:
      return state;
  }
}
