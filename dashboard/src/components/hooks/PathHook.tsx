import { push } from 'connected-react-router';
import {
  getServiceOverviewPageUrl,
  getServicesPath,
  getReleaseLogPageUrl,
  getReleasePageUrl,
  getConsoleLogPageUrl,
  getAccessPageUrl,
} from 'libraries/helpers/path';
import { useDispatch } from 'react-redux';
import { useAuthState } from './ReduxStateHook';

type NavigateOption = {
  targetEnvId?: string,
  state?: any,
}

interface Paths {
  servicesPath: string
  navigateToServices: (option?: NavigateOption) => void,
  navigateToServiceOverviewPage: (
    serviceName: string,
    anotherEnvId?: string
  ) => void
  navigateToServiceReleaseLogPage: (
    serviceName: string,
    releaseId: string,
    state?: any
  ) => void
  navigateToServiceReleasePage: (serviceName: string) => void
  navigateToServiceConsoleLogPage: (serviceName
    : string, instanceShortName: string) => void
  navigateToServiceAccessPage: (serviceName: string) => void
}

// custom hooks
export const useServiceNavigate = (): Paths => {
  // no chance the envId is null
  const { envId } = useAuthState();
  const dispatch = useDispatch();

  // if envId is empty, EnvApp will redirect it back to some envId
  return {
    servicesPath: getServicesPath(envId || ''),
    navigateToServices: (option: NavigateOption) => {
      dispatch(push(getServicesPath(option?.targetEnvId || envId || ''), option?.state || {}));
    },
    navigateToServiceOverviewPage: (
      serviceName: string, anotherEnvId?: string) => {
      dispatch(push(getServiceOverviewPageUrl(
        anotherEnvId || envId!, serviceName)));
    },
    navigateToServiceReleaseLogPage: (
      serviceName: string,
      releaseId: string,
      state?: any
    ) => {
      dispatch(
        push(getReleaseLogPageUrl(envId!, serviceName, releaseId), state));
    },
    navigateToServiceReleasePage: (serviceName: string) => {
      dispatch(push(getReleasePageUrl(envId!, serviceName)));
    },
    navigateToServiceConsoleLogPage: (
      serviceName: string, instanceShortName: string) => {
      dispatch(
        push(getConsoleLogPageUrl(envId!, serviceName, instanceShortName)));
    },
    navigateToServiceAccessPage: (serviceName: string) => {
      dispatch(push(getAccessPageUrl(envId!, serviceName)));
    }
  };
};
