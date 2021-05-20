import { useAppState, useAuthState } from 'components/hooks/ReduxStateHook';
import FullPageLoading from 'components/molecules/FullPageLoading';
import AxiosInterceptor from 'libraries/axios';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { doInitBackgroundLoad } from 'states/auth/actions';
import { useGRPCWrapper } from '../GRPCWrapper';
import { setAuthState } from '../../../libraries/localstorage';

/**
 * Will check the token from local storage and check if the user is logged in.
 * If no, redirect to login page
 */
export default ({ children }: React.PropsWithChildren<{}>) => {
  const dispatch = useDispatch();
  const grpcWrapper = useGRPCWrapper();
  const { isInitialLoading } = useAppState();
  const authState = useAuthState();

  useEffect(() => {
    // skip loading for maintenance mode
    dispatch(doInitBackgroundLoad(grpcWrapper));
  }, []);

  // Store the authState once the token is updated
  useEffect(() => {
    if (authState.token) {
      setAuthState(authState);
    }
  }, [authState.token]);

  return isInitialLoading ? (
    <FullPageLoading />
  ) : (
    <>
      <AxiosInterceptor />
      {children}
    </>
  );
};
