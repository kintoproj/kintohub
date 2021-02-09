import { Empty } from 'google-protobuf/google/protobuf/empty_pb';
import {
  CreateEnvironmentRequest,
  EnvironmentQueryRequest,
  UpdateEnvironmentRequest,
} from 'types/proto/coreapi_pb';
import { KintoCoreServiceClient } from 'types/proto/coreapi_pb_service';
import { Environment, Environments } from 'types/proto/models_pb';

import { invokeGRPC, CoreMethod } from './common';

export const getEnvironments = (
  client: KintoCoreServiceClient
): Promise<Environments> => {
  return new Promise((resolve, reject) => {
    client.getEnvironments(new Empty(), (err, message) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(message!);
    });
  });
};

export const createEnvironment = (
  client: KintoCoreServiceClient,
  envName: string
): Promise<Environment> => {
  const req = new CreateEnvironmentRequest();
  req.setName(envName);

  return new Promise((resolve, reject) => {
    client.createEnvironment(req, (err, message) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(message!);
    });
  });
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

// eslint-disable-next-line max-len
export const updateEnvironment = (
  client: KintoCoreServiceClient,
  envId: string,
  envName: string
): Promise<Environment> => {
  const req = new UpdateEnvironmentRequest();
  req.setId(envId);
  req.setName(envName);
  return new Promise((resolve, reject) => {
    client.updateEnvironment(req, (error, message) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(message!);
    });
  });
};
