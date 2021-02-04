import { Environment } from 'types/environment';
import { Block } from 'types/proto/models_pb';

import { useAuthState } from './ReduxStateHook';

type PromotedFromData = {
  environment: Environment | null;
};

export const usePromotedFromService = (
  promotedService: Block
): PromotedFromData => {
  const { environments } = useAuthState();

  const fromEnvId = promotedService.getParentblockenvid();

  const fromEnv = environments.find((env) => env.envId === fromEnvId);
  return {
    environment: fromEnv || null,
  };
};
