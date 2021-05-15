import { KintoConfig } from 'types';
import { Notification } from './actions';

export interface AppState {
  notifications: Notification[];
  isLoading: boolean;
  isInitialLoading: boolean;
  config: KintoConfig;
  isDarkMode: boolean;
  serverTimeOffset: number;
}
