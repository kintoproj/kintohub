import { useAuthState } from 'components/hooks/ReduxStateHook';
import React from 'react';
import { Redirect } from 'react-router';
import { getServicesPath } from 'libraries/helpers/path';
import { useDispatch } from 'react-redux';
import { doLogout } from 'states/auth/actions';

/**
 * An Empty component that will redirect to either saved envId or first env
 */
export default ({ children }: React.PropsWithChildren<{}>) => {
  const { environments, envId } = useAuthState();
  const dispatch = useDispatch();

  let env = environments.find((e) => e.envId === envId);

  // if cannot find the environment from the list, we try to use the first env from the list
  if (!env) {
    if (environments.length > 0) {
      [env] = environments;
    }
  }

  if (!env) {
    dispatch(doLogout('environment not found'));
    return null;
  }

  // if it is still empty, EnvApp will guard that and logout the user
  return <Redirect to={`${getServicesPath(env?.envId)}?redirect=true`} />;
};
