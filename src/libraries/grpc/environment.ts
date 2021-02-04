import { Empty } from 'google-protobuf/google/protobuf/empty_pb';
import {
  CreateEnvironmentRequest,
  EnvironmentQueryRequest,
  UpdateEnvironmentRequest,
} from 'types/proto/coreapi_pb';
import { KintoKubeCoreServiceClient } from 'types/proto/coreapi_pb_service';
import { Environment, Environments } from 'types/proto/models_pb';

import { invokeGRPC, KKCMethod } from './common';

export const getEnvironments = (
  client: KintoKubeCoreServiceClient
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
  client: KintoKubeCoreServiceClient,
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
export const getOrCreateEnvironment: KKCMethod<
  Environment,
  { envId: string }
> = (client: KintoKubeCoreServiceClient, token: string, { envId }) => {
  const req = new EnvironmentQueryRequest();
  req.setId(envId);

  return invokeGRPC<EnvironmentQueryRequest, Environment>(
    client.getEnvironment,
    token,
    req,
    client
  );
};

export const deleteEnvironment: KKCMethod<Empty, { envId: string }> = (
  client: KintoKubeCoreServiceClient,
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
  client: KintoKubeCoreServiceClient,
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
