import {
  ACTION_ENV_LOGIN, EnvLoginAction
} from 'states/auth/actions';
import { ReleaseStatusMap } from 'types/release';

import { ACTION_UPDATE_RELEASE_STATUS, ReleasesActionTypes } from './actions';
import { ReleasesState } from './types';

const initialState: ReleasesState = {
  blockName: null,
  statusMap: {},
};

export default function reducer(
  state = initialState,
  action: ReleasesActionTypes | EnvLoginAction
): ReleasesState {
  switch (action.type) {
    case ACTION_UPDATE_RELEASE_STATUS: {
      let newStatusMap: ReleaseStatusMap;

      if (action.blockName !== state.blockName) {
        newStatusMap = {};
      } else {
        newStatusMap = { ...state.statusMap };
      }

      Object.keys(action.statusMap).forEach((k) => {
        const status = action.statusMap[k];
        newStatusMap[k] = {
          state: status.getState(),
        };
      });

      return {
        blockName: action.blockName,
        statusMap: newStatusMap,
      };
    }
    case ACTION_ENV_LOGIN: {
      return initialState;
    }
    default:
      return state;
  }
}
