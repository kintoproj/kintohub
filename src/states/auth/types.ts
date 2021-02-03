import { Environment } from 'types/environment';

export interface AuthState {
  version: string;
  // This is not used atm. but we may include authentication at any time so we will still keep it here.
  token: string | null;
  envId: string | null;
  isConfigLoaded: boolean;
  environments: Environment[];
}
