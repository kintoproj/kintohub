import {
  REACT_APP_LOCAL_STORAGE_KEY_APPEND,
  REACT_APP_LOCAL_STORAGE_VERSION,
} from 'libraries/envVars';
import { AuthState } from 'states/auth/types';

export const getKey = (key: string) => {
  return `${key}${REACT_APP_LOCAL_STORAGE_KEY_APPEND && ''}`;
};

export const setIsDarkMode = (isDarkMode: boolean) => {
  window.localStorage.setItem(getKey('dark_mode'), isDarkMode.toString());
};

export const getIsDarkMode = (): boolean => {
  const item = window.localStorage.getItem(getKey('dark_mode'));
  return item === 'true';
};

export const setAuthState = (state: AuthState) => {
  window.localStorage.setItem(getKey('auth'), JSON.stringify(state));
};

export const clearAuthState = () => {
  window.localStorage.removeItem(getKey('auth'));
};

export const getAuthState = (): AuthState => {
  const item = window.localStorage.getItem(getKey('auth'));
  const initialAuthState: AuthState = {
    version: REACT_APP_LOCAL_STORAGE_VERSION,
    token: null,
    envId: null,
    isConfigLoaded: false,
    environments: [],
  };
  if (!item) {
    return initialAuthState;
  }
  try {
    const state = JSON.parse(item) as AuthState;
    if (state.version !== REACT_APP_LOCAL_STORAGE_VERSION) {
      return initialAuthState;
    }
    return {
      ...initialAuthState,
      ...state,
      isConfigLoaded: false,
    };
  } catch {
    return initialAuthState;
  }
};
