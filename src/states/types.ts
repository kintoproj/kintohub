import { AuthState } from './auth/types';
import { SidePanelState } from './sidePanel/types';
import { AppState } from './app/types';
import { ServicesState } from './services/types';
import { ServiceState } from './service/types';
import { ReleasesState } from './releases/types';
import { RepositoriesState } from './repositories/types';

export interface RootState {
  auth: AuthState;
  sidePanel: SidePanelState;
  app: AppState;
  services: ServicesState;
  service: ServiceState;
  releases: ReleasesState;
  repositories: RepositoriesState;
}
