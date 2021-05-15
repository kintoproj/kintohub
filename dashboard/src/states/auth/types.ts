import { Environment } from 'types/environment';

export interface AuthState {
  version: string;
  token: string | null;
  envId: string | null;
  isConfigLoaded: boolean;
  environments: Environment[];
}
