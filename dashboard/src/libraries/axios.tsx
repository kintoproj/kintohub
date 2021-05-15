import React, { useEffect } from 'react';
import axios from 'axios';
import { RootState } from 'states/types';
import { AuthState } from 'states/auth/types';
import { useSelector } from 'react-redux';
import { getAuthorizationHeader } from './helpers';

const AxiosInterceptor = () => {
  const { token } = useSelector<RootState, AuthState>(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    axios.interceptors.request.use((config) => {
      if (token) {
        // eslint-disable-next-line no-param-reassign
        config.headers.Authorization = getAuthorizationHeader(token);
      }
      return config;
    });
    axios.interceptors.response.use(
      (response) => {
        const data = response.data || {};
        return data;
      },
      (error) => {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    );
  }, [token]);

  return <></>;
};

export default AxiosInterceptor;
