import { useAuthState } from 'components/hooks/ReduxStateHook';
import FullPageLoading from 'components/molecules/FullPageLoading';
import EnvRedirect from 'components/pages/EnvRedirect';
import _get from 'lodash.get';
import qs from 'query-string';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useRouteMatch } from 'react-router';
import { doEnvBackgroundLoad, doLogout } from 'states/auth/actions';
import { Environment } from 'types/environment';

import { useGRPCClients } from '../GRPCClients';
import ServiceStatusListener from '../ServiceStatusListener';

/**
 * Will check the token from local storage and check if the user is logged in.
 * If no, redirect to login page
 */
export default ({ children }: React.PropsWithChildren<{}>) => {
  const match = useRouteMatch();
  const location = useLocation();
  const dispatch = useDispatch();
  const { environments, envId: currentEnvId, isConfigLoaded } = useAuthState();
  const { kkcClient } = useGRPCClients();
  const { redirect } = qs.parse(location.search);
  const envId = _get(match, 'params.envId', '');

  const [isEnvLoading, setIsEnvLoading] = useState(true);

  const env = environments.find((e) => e.envId === envId);

  // we need to avoid the window between envId changed and the KKCClient refreshed
  const isSwitchingEnv = envId !== currentEnvId;

  useEffect(() => {
    const switchEnv = async (e: Environment) => {
      if (!isConfigLoaded || isSwitchingEnv) {
        setIsEnvLoading(true);
        await dispatch(doEnvBackgroundLoad(kkcClient!, envId));
        setIsEnvLoading(false);
      } else {
        // set is Loading to false in case redirect but the envId from state is
        setIsEnvLoading(false);
      }
    };

    if (env) {
      switchEnv(env!);
    }
  }, [env?.envId, kkcClient?.serviceHost, currentEnvId]);

  useEffect(() => {
    // It is already a redirect and force user to logout
    if (!env && redirect) {
      dispatch(doLogout('environment not found'));
    }
  }, []);

  // If environment not exists, redirect to default one and try again
  if (!env) {
    return <EnvRedirect />;
  }

  // guarantee the useEffect is fired
  return isEnvLoading || isSwitchingEnv ? (
    <FullPageLoading />
  ) : (
    <>
      <ServiceStatusListener />
      {children}
    </>
  );
};
