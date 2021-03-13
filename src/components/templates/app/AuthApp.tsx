import { useAppState } from 'components/hooks/ReduxStateHook';
import FullPageLoading from 'components/molecules/FullPageLoading';
import AxiosInterceptor from 'libraries/axios';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { doInitBackgroundLoad } from 'states/auth/actions';
import { useGRPCWrapper } from '../GRPCWrapper';

/**
 * Will check the token from local storage and check if the user is logged in.
 * If no, redirect to login page
 */
export default ({ children }: React.PropsWithChildren<{}>) => {
  const dispatch = useDispatch();
  const grpcWrapper = useGRPCWrapper();
  const { isInitialLoading } = useAppState();

  useEffect(() => {
    // skip loading for maintenance mode
    dispatch(doInitBackgroundLoad(grpcWrapper));
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
