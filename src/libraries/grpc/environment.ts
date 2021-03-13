import { Empty } from 'google-protobuf/google/protobuf/empty_pb';
import {
  CreateEnvironmentRequest,
  EnvironmentQueryRequest,
  UpdateEnvironmentRequest,
} from 'types/proto/coreapi_pb';
import { KintoCoreServiceClient } from 'types/proto/coreapi_pb_service';
import { Environment, Environments } from 'types/proto/models_pb';

import { invokeGRPC, CoreMethod } from './common';

export const getEnvironments: CoreMethod<Environments, {}> = (
  client: KintoCoreServiceClient,
  token: string
) => {
  return invokeGRPC<Empty, Environments>(
    client.getEnvironments,
    token,
    new Empty(),
    client
  );
};

export const createEnvironment: CoreMethod<Environment, { envName: string }> = (
  client: KintoCoreServiceClient,
  token: string,
  { envName }
) => {
  const req = new CreateEnvironmentRequest();
  req.setName(envName);

  return invokeGRPC<CreateEnvironmentRequest, Environment>(
    client.createEnvironment,
    token,
    req,
    client
  );
};

// eslint-disable-next-line max-len
export const getOrCreateEnvironment: CoreMethod<
  Environment,
  { envId: string }
> = (client: KintoCoreServiceClient, token: string, { envId }) => {
  const req = new EnvironmentQueryRequest();
  req.setId(envId);

  return invokeGRPC<EnvironmentQueryRequest, Environment>(
    client.getEnvironment,
    token,
    req,
    client
  );
};

export const deleteEnvironment: CoreMethod<Empty, { envId: string }> = (
  client: KintoCoreServiceClient,
  token: string,
  { envId }
) => {
  const req = new EnvironmentQueryRequest();
  req.setId(envId);

  return invokeGRPC<EnvironmentQueryRequest, Empty>(
    client.deleteEnvironment,
    token,
    req,
    client
  );
};

export const updateEnvironment: CoreMethod<
  Environment,
  { envId: string; envName: string }
> = (client: KintoCoreServiceClient, token: string, { envId, envName }) => {
  const req = new UpdateEnvironmentRequest();
  req.setName(envName);
  req.setId(envId);

  return invokeGRPC<CreateEnvironmentRequest, Environment>(
    client.updateEnvironment,
    token,
    req,
    client
  );
};
