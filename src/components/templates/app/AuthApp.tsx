import { useAppState } from 'components/hooks/ReduxStateHook';
import FullPageLoading from 'components/molecules/FullPageLoading';
import { useGRPCClients } from 'components/templates/GRPCClients';
import AxiosInterceptor from 'libraries/axios';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { doInitBackgroundLoad } from 'states/auth/actions';

/**
 * Will check the token from local storage and check if the user is logged in.
 * If no, redirect to login page
 */
export default ({ children }: React.PropsWithChildren<{}>) => {
  const dispatch = useDispatch();
  const { kkcClient } = useGRPCClients();
  const { isInitialLoading } = useAppState();

  useEffect(() => {
    // skip loading for maintenance mode
    dispatch(doInitBackgroundLoad(kkcClient!));
  }, []);

  return isInitialLoading ? (
    <FullPageLoading />
  ) : (
    <>
      <AxiosInterceptor />
      {children}
    </>
  );
};
