import { trackError } from 'libraries/helpers';
import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import {
  setInitialLoading,
  syncServerTime,
  updateKintoConfig,
} from 'states/app/actions';
import { RootState } from 'states/types';
import { Environment } from 'types/environment';
import { KintoCoreServiceClient } from 'types/proto/coreapi_pb_service';
import { push } from 'connected-react-router';
import { PATH_CREATE_ENV, PATH_MAINTENANCE } from 'libraries/constants';
import { getEnvironments } from 'libraries/grpc/environment';
import { getKintoConfig, syncTime } from 'libraries/grpc/app';
import moment from 'moment';

export const ACTION_ENV_LOGIN = 'ENV_LOGIN';
export const ACTION_UPDATE_ENV_LIST = 'UPDATE_ENV_LIST';
export const ACTION_UPDATE_ENV_NAME = 'UPDATE_ENV_NAME';
export const ACTION_DELETE_ENV = 'DELETE_ENV';

export interface EnvLoginAction {
  type: typeof ACTION_ENV_LOGIN;
  envId: string;
}

export interface UpdateEnvListAction {
  type: typeof ACTION_UPDATE_ENV_LIST;
  envList: Environment[];
}

export interface UpdateEnvNameAction {
  type: typeof ACTION_UPDATE_ENV_NAME;
  envId: string;
  envName: string;
}

export interface DeleteEnvAction {
  type: typeof ACTION_DELETE_ENV;
  envId: string;
}

export const envLogin = (envId: string): EnvLoginAction => {
  return {
    type: ACTION_ENV_LOGIN,
    envId,
  };
};

export const updateEnvList = (envList: Environment[]) => ({
  type: ACTION_UPDATE_ENV_LIST,
  envList,
});

export const updateEnvName = (
  envId: string,
  envName: string
): UpdateEnvNameAction => ({
  type: ACTION_UPDATE_ENV_NAME,
  envId,
  envName,
});

export const deleteEnv = (envId: string): DeleteEnvAction => ({
  type: ACTION_DELETE_ENV,
  envId,
});

/**
 *      ============ Async Actions ================
 */

export const doLogout = (
  msg: string
): ThunkAction<Promise<void>, RootState, {}, AnyAction> => async (
  dispatch: ThunkDispatch<{}, {}, AnyAction>,
  getState: () => RootState
): Promise<void> => {};

export const doSyncTime = (
  client: KintoCoreServiceClient
): ThunkAction<Promise<void>, RootState, {}, AnyAction> => async (
  dispatch: ThunkDispatch<{}, {}, AnyAction>
): Promise<void> => {
  const sendTime = moment().valueOf();
  const res = await syncTime(client, '', { sendTimeMs: sendTime });
  const now = moment().valueOf();
  dispatch(syncServerTime(sendTime, res!.getServertimestampms(), now));
};

/**
 * Get the list of environments before everything else
 */
export const doInitBackgroundLoad = (
  coreClient: KintoCoreServiceClient
): ThunkAction<Promise<void>, RootState, {}, AnyAction> => async (
  dispatch: ThunkDispatch<{}, {}, AnyAction>
): Promise<void> => {
  try {
    const envs = await getEnvironments(coreClient);
    const envList = envs.getItemsList();
    // If no environment, force him to create one
    // FIXME: debug
    if (envList.length === 0) {
      // this is the case that the user dropped before creating an env
      dispatch(setInitialLoading(false));
      dispatch(push(PATH_CREATE_ENV));
      return;
    }

    const config = await getKintoConfig(coreClient, '', {});
    dispatch(updateKintoConfig(config!));

    dispatch(setInitialLoading(false));
    dispatch(
      updateEnvList(
        envList.map((env) => ({
          name: env.getName(),
          envId: env.getId(),
        }))
      )
    );
  } catch (error) {
    trackError('INIT_LOAD_BACKGROUND', error);
    await dispatch(doLogout('init load failed'));
  }
};

/**
 * Should be called after doInitBackgroundLoad. Need to have the environments loaded
 */
export const doEnvBackgroundLoad = (
  coreClient: KintoCoreServiceClient,
  envId: string
): ThunkAction<Promise<void>, RootState, {}, AnyAction> => async (
  dispatch: ThunkDispatch<{}, {}, AnyAction>,
  getState: () => RootState
): Promise<void> => {
  try {
    const { environments } = getState().auth;
    if (environments.length === 0) {
      // Shouldn't happen.
      dispatch(push(PATH_MAINTENANCE));
      return;
    }
    let defaultEnv = environments.find((e) => e.envId === envId);

    if (!defaultEnv) {
      [defaultEnv] = environments;
    }

    // Update environment Id
    dispatch(envLogin(defaultEnv.envId));
  } catch (error) {
    trackError('INIT_ENV_LOAD_BACKGROUND', error);
    await dispatch(doLogout('env init load failed'));
  }
};

export type AuthActionsTypes =
  | EnvLoginAction
  | UpdateEnvNameAction
  | DeleteEnvAction
  | UpdateEnvListAction;
