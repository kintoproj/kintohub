import { KintoConfiguration } from 'types/proto/kkc_models_pb';
import { KintoConfig } from 'types';
import { setIsDarkMode } from 'libraries/localstorage';

export const ACTION_ENQUEUE_NOTIFICATION = 'ENQUEUE_NOTIFICATION';
export const ACTION_DISMISS_NOTIFICATION = 'DISMISS_NOTIFICATION';
export const ACTION_REMOVE_NOTIFICATION = 'DELETE_NOTIFICATION';
export const ACTION_SET_LOADING = 'SET_LOADING';
export const ACTION_SET_INITIAL_LOADING = 'SET_INITIAL_LOADING';
export const ACTION_UPDATE_KINTO_CONFIG = 'UPDATE_KINTO_CONFIG';
export const ACTION_TOOGLE_DARK_MODE = 'TOGGLE_DARKMODE';
export const ACTION_SYNC_TIME = 'SYNC_TIME';

export interface Notification {
  message: string;
  key: string;
  type: NotificationType;
  dismissed: boolean;
  option?: NotificationOption;
}

export type NotificationOption = {
  persist?: boolean;
  actions?: {
    label: string;
    type: NotificationActionType;
    data: NotificationActionDataType;
  }[];
};

export type NotificationType = 'warning' | 'error' | 'info';

export type NotificationActionType =
  | 'CHECK_LOGS'
  | 'FIX_RELEASE_PORT'
  | 'FIX_RELEASE'
  | 'FIX_RELEASE_OOM';

export type NotificationActionDataType = {
  releaseId: string;
  serviceData: Uint8Array;
  serviceName: string;
};

export interface EnqueueNotificationAction {
  type: typeof ACTION_ENQUEUE_NOTIFICATION;
  message: Notification;
}

interface DismissNotificationAction {
  type: typeof ACTION_DISMISS_NOTIFICATION;
  key: string | null;
}

interface RemoveNotificationAction {
  type: typeof ACTION_REMOVE_NOTIFICATION;
  key: string | null;
}

interface SetLoadingAction {
  type: typeof ACTION_SET_LOADING;
  isLoading: boolean;
}

interface SetInitialLoadingAction {
  type: typeof ACTION_SET_INITIAL_LOADING;
  isLoading: boolean;
}

export interface UpdateKintoConfigAction {
  type: typeof ACTION_UPDATE_KINTO_CONFIG;
  config: KintoConfig;
}

interface ToggleDarkModeAction {
  type: typeof ACTION_TOOGLE_DARK_MODE;
  enableDarkMode: boolean;
}

interface SyncTimeAction {
  type: typeof ACTION_SYNC_TIME;
  clientSendTimestamp: number;
  serverReceiveTimestamp: number;
  clientReceiveTimestamp: number;
}

/**
 *  ============= Action Methods ===============
 */

export const toggleDarkMode = (
  enableDarkMode: boolean
): ToggleDarkModeAction => {
  setIsDarkMode(enableDarkMode);
  return {
    type: ACTION_TOOGLE_DARK_MODE,
    enableDarkMode,
  };
};

export const enqueueNotification = (
  message: Notification
): EnqueueNotificationAction => ({
  type: ACTION_ENQUEUE_NOTIFICATION,
  message,
});

/**
 * Transform KintoConfiguration from pb to local KintoConfig
 */
export const updateKintoConfig = (
  config: KintoConfiguration
): UpdateKintoConfigAction => {
  const kintoConfig: KintoConfig = {
    languages: {},
    cpuOptions: config.getCpuoptions()?.toObject(),
    memoryOptions: config.getMemoryoptions()?.toObject(),
    autoScalingOptions: config.getAutoscalingoptions()?.toObject(),
    timeoutOptions: config.getTimeoutoptions()?.toObject(),
    jobTimeoutOptions: config.getJobtimeoutoptions()?.toObject(),
  };

  config
    .getLanguagesList()
    .map((lang) => lang.toObject())
    .forEach((lang) => {
      kintoConfig.languages[lang.language] = lang;
    });

  return {
    type: ACTION_UPDATE_KINTO_CONFIG,
    config: kintoConfig,
  };
};

export const syncServerTime = (
  clientSendTimestamp: number,
  serverReceiveTimestamp: number,
  clientReceiveTimestamp: number
): SyncTimeAction => {
  return {
    type: ACTION_SYNC_TIME,
    clientSendTimestamp,
    serverReceiveTimestamp,
    clientReceiveTimestamp,
  };
};

export const enqueueError = (
  page: string,
  error: Error,
  option: NotificationOption = {}
) => {
  return {
    type: ACTION_ENQUEUE_NOTIFICATION,
    message: {
      message: error.message || 'Unknown error',
      key: page,
      type: 'error',
      dismissed: false,
      option,
    },
  };
};

export const setLoading = (isLoading: boolean) => ({
  type: ACTION_SET_LOADING,
  isLoading,
});

export const setInitialLoading = (isLoading: boolean) => ({
  type: ACTION_SET_INITIAL_LOADING,
  isLoading,
});

export const dismissNotification = (
  key: string | null
): DismissNotificationAction => ({
  type: ACTION_DISMISS_NOTIFICATION,
  key,
});

export const removeNotification = (
  key: string | null
): RemoveNotificationAction => ({
  type: ACTION_REMOVE_NOTIFICATION,
  key,
});

export type AppActionTypes =
  | EnqueueNotificationAction
  | DismissNotificationAction
  | RemoveNotificationAction
  | SetLoadingAction
  | SetInitialLoadingAction
  | UpdateKintoConfigAction
  | ToggleDarkModeAction
  | SyncTimeAction;
