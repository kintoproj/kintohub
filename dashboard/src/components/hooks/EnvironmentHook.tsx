import { useAuthState, useEnvironment } from './ReduxStateHook';

type ClusterInfo = {
  envName: string;
};

export const useEnvironmentInfo = (): ClusterInfo => {
  const { envId } = useEnvironment();
  const { environments } = useAuthState();

  const env = environments.find((e) => e.envId === envId);

  return {
    envName: env?.name || '',
  };
};
