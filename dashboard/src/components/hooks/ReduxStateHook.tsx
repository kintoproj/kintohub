import { useDispatch, useSelector } from 'react-redux';
import { AppState } from 'states/app/types';
import { AuthState } from 'states/auth/types';
import { ReleasesState } from 'states/releases/types';
import { RepositoriesState } from 'states/repositories/types';
import { ServiceState } from 'states/service/types';
import { ServicesState } from 'states/services/types';
import { SidePanelState } from 'states/sidePanel/types';
import { RootState } from 'states/types';
import { Environment } from '../../types/environment';
import { trackError } from '../../libraries/helpers';
import { enqueueError } from '../../states/app/actions';
import { doLogout } from '../../states/auth/actions';

interface BillingState {
  shouldShowBilling: boolean;
  isPayUser: boolean;
}

// custom hooks
export const useAppState = (): AppState => {
  return useSelector<RootState, AppState>((state: RootState) => state.app);
};

export const useAuthState = (): AuthState => {
  return useSelector<RootState, AuthState>((state: RootState) => state.auth);
};

export const useSidePanelState = (): SidePanelState => {
  return useSelector<RootState, SidePanelState>(
    (state: RootState) => state.sidePanel
  );
};

export const useRepositoriesState = (): RepositoriesState => {
  return useSelector<RootState, RepositoriesState>(
    (state: RootState) => state.repositories
  );
};

export const useServicesState = (): ServicesState => {
  return useSelector<RootState, ServicesState>(
    (state: RootState) => state.services
  );
};

export const useServiceState = (): ServiceState => {
  return useSelector<RootState, ServiceState>(
    (state: RootState) => state.service
  );
};

export const useReleasesState = (): ReleasesState => {
  return useSelector<RootState, ReleasesState>(
    (state: RootState) => state.releases
  );
};

export const useEnvironment = (): Environment => {
  const dispatch = useDispatch();

  const { envId, environments } = useSelector<RootState, AuthState>(
    (state: RootState) => state.auth
  );

  const env = environments.find((e) => e.envId === envId);
  if (!env) {
    trackError('use-environment', 'enviornment is empty');
    dispatch(
      enqueueError(
        'use-environment',
        new Error('Active environment does not exist. Please login again')
      )
    );
    dispatch(doLogout('use environment not found'));
  }
  return env!;
};
