import { Empty } from 'google-protobuf/google/protobuf/empty_pb';
import { BlockType } from 'types';
import {
  BlockQueryRequest,
  BlockUpdateResponse,
  CreateBlockRequest,
  DeleteBlockRequest,
  DeployBlockRequest,
  DisablePublicURLRequest,
  EnablePublicURLRequest,
  EnvironmentQueryRequest,
  GenReleaseConfigFromKintoFileRepoRequest,
  KillBlockInstanceRequest,
  SuspendBlockRequest,
  WatchConsoleLogsRequest,
} from 'types/proto/coreapi_pb';
/* eslint-disable max-len */
import { KintoCoreServiceClient, Status } from 'types/proto/coreapi_pb_service';
import {
  Block,
  Blocks,
  BlocksMetrics,
  BlockStatuses,
  BuildConfig,
  ConsoleLog,
  JobStatus,
  ReleaseConfig,
  RunConfig,
} from 'types/proto/models_pb';

import { grpc } from '@improbable-eng/grpc-web';

import {
  invokeGRPC,
  CoreMethod,
  Stream,
  StreamCallbacks,
  WatchStream,
} from './common';

export interface ConsoleLogMessage {
  message: string;
  instanceName: string;
}

export const getServices: CoreMethod<Blocks, { envId: string }> = (
  client: KintoCoreServiceClient,
  token: string,
  { envId }
): Promise<Blocks | null> => {
  const req = new BlockQueryRequest();
  req.setEnvid(envId);

  return invokeGRPC<BlockQueryRequest, Blocks>(
    client.getBlocks,
    token,
    req,
    client
  );
};

export const getService: CoreMethod<
  Block,
  { envId: string; serviceName: string }
> = (
  client: KintoCoreServiceClient,
  token: string,
  { envId, serviceName }
): Promise<Block | null> => {
  const req = new BlockQueryRequest();
  req.setEnvid(envId);
  req.setName(serviceName);

  const headers = new grpc.Metadata();
  headers.set('Authorization', `Bearer ${token}`);

  return invokeGRPC<BlockQueryRequest, Block>(
    client.getBlock,
    token,
    req,
    client
  );
};

export const createService: CoreMethod<
  BlockUpdateResponse,
  {
    name: string;
    envId: string;
    buildConfig: BuildConfig;
    runConfig: RunConfig;
  }
> = (
  client: KintoCoreServiceClient,
  token: string,
  { name, envId, buildConfig, runConfig }
) => {
  const req = new CreateBlockRequest();
  req.setName(name);
  req.setEnvid(envId);
  req.setBuildconfig(buildConfig);
  req.setRunconfig(runConfig);

  return invokeGRPC<BlockQueryRequest, BlockUpdateResponse>(
    client.createBlock,
    token,
    req,
    client
  );
};

export const editService: CoreMethod<
  BlockUpdateResponse,
  {
    serviceName: string;
    envId: string;
    releaseId: string;
    buildConfig: BuildConfig;
    runConfig: RunConfig;
  }
> = (
  client: KintoCoreServiceClient,
  token: string,
  { serviceName, envId, buildConfig, runConfig, releaseId }
) => {
  const req = new DeployBlockRequest();
  req.setName(serviceName);
  req.setEnvid(envId);
  req.setBuildconfig(buildConfig);
  req.setRunconfig(runConfig);
  req.setBasereleaseid(releaseId);

  return invokeGRPC<DeployBlockRequest, BlockUpdateResponse>(
    client.deployBlockUpdate,
    token,
    req,
    client
  );
};

export const deleteService: CoreMethod<
  Empty,
  { serviceName: string; envId: string }
> = (client: KintoCoreServiceClient, token: string, { serviceName, envId }) => {
  const req = new DeleteBlockRequest();
  req.setName(serviceName);
  req.setEnvid(envId);

  return invokeGRPC<DeleteBlockRequest, Empty>(
    client.deleteBlock,
    token,
    req,
    client
  );
};

export const restartPod: CoreMethod<
  Empty,
  { podName: string; envId: string }
> = (client: KintoCoreServiceClient, token: string, { envId, podName }) => {
  const req = new KillBlockInstanceRequest();
  req.setEnvid(envId);
  req.setId(podName);

  return invokeGRPC<KillBlockInstanceRequest, Empty>(
    client.killBlockInstance,
    token,
    req,
    client
  );
};

export const enablePublicUrl: CoreMethod<
  Empty,
  { serviceName: string; releaseId: string; envId: string }
> = (
  client: KintoCoreServiceClient,
  token: string,
  { envId, serviceName, releaseId }
) => {
  const req = new EnablePublicURLRequest();
  req.setEnvid(envId);
  req.setBlockname(serviceName);
  req.setReleaseid(releaseId);

  return invokeGRPC<EnablePublicURLRequest, Empty>(
    client.enablePublicURL,
    token,
    req,
    client
  );
};

export const disablePublicUrl: CoreMethod<
  Empty,
  { serviceName: string; envId: string }
> = (client: KintoCoreServiceClient, token: string, { envId, serviceName }) => {
  const req = new DisablePublicURLRequest();
  req.setEnvid(envId);
  req.setBlockname(serviceName);

  return invokeGRPC<DisablePublicURLRequest, Empty>(
    client.disablePublicURL,
    token,
    req,
    client
  );
};

/**
 * Suspend the service. Will return BlockUpdateResponse
 * @param client
 * @param token
 * @param { serviceName, envId }
 */
export const suspendService: CoreMethod<
  BlockUpdateResponse,
  { serviceName: string; envId: string }
> = (client: KintoCoreServiceClient, token: string, { envId, serviceName }) => {
  const req = new SuspendBlockRequest();
  req.setEnvid(envId);
  req.setName(serviceName);

  return invokeGRPC<SuspendBlockRequest, BlockUpdateResponse>(
    client.suspendBlock,
    token,
    req,
    client
  );
};

export const genReleaseConfigFromRepo: CoreMethod<
  ReleaseConfig,
  {
    envId: string;
    blockType: BlockType;
    repo: string;
    branch: string;
    org: string;
    githubUserToken: string;
  }
> = (
  client: KintoCoreServiceClient,
  token: string,
  { envId, blockType, repo, branch, org, githubUserToken }
) => {
  const req = new GenReleaseConfigFromKintoFileRepoRequest();
  req.setEnvid(envId);
  req.setBlocktype(blockType);
  req.setBranch(branch);
  req.setGithubusertoken(githubUserToken);
  req.setRepo(repo);
  req.setOrg(org);

  return invokeGRPC<GenReleaseConfigFromKintoFileRepoRequest, ReleaseConfig>(
    client.genReleaseConfigFromKintoFile,
    token,
    req,
    client
  );
};

// eslint-disable-next-line max-len
export const watchConsoleLogs: WatchStream<
  ConsoleLogMessage,
  { blockName: string; envId: string }
> = (
  client: KintoCoreServiceClient,
  token: string,
  { blockName, envId },
  callbacks
): Stream => {
  const req = new WatchConsoleLogsRequest();
  req.setBlockname(blockName);
  req.setEnvid(envId);

  const headers = new grpc.Metadata();
  headers.set('Authorization', `Bearer ${token}`);

  const stream = client.watchConsoleLogs(req, headers);
  stream.on('data', (message: ConsoleLog) => {
    message.getInstancename();
    const data = message.getData();
    const instanceName = message.getInstancename();
    if (typeof data === 'string') {
      callbacks.onData({
        message: data,
        instanceName,
      });
    } else {
      callbacks.onData({
        message: new TextDecoder('utf-8').decode(data),
        instanceName,
      });
    }
  });

  stream.on('end', (status?: Status) => {
    if (!status) {
      if (callbacks.onEnd) callbacks.onEnd();
      return;
    }
    callbacks.onError(status.code, status.details);
  });

  return stream;
};

// when passing null to blockName will listen to all environment
// eslint-disable-next-line max-len
export const watchServiceHealth: WatchStream<
  BlockStatuses,
  { blockName: string | null; envId: string }
> = (
  client: KintoCoreServiceClient,
  token: string,
  { blockName, envId },
  callbacks: StreamCallbacks<BlockStatuses>
): Stream => {
  const req = new EnvironmentQueryRequest();
  req.setId(envId);

  const headers = new grpc.Metadata();
  headers.set('Authorization', `Bearer ${token}`);

  const stream = client.watchBlocksHealthStatuses(req, headers);
  stream.on('data', (status: BlockStatuses) => {
    callbacks.onData(status);
  });

  stream.on('end', (status?: Status) => {
    if (!status) {
      if (callbacks.onEnd) callbacks.onEnd();
      return;
    }
    callbacks.onError(status.code, status.details);
  });

  return stream;
};

// when passing null to blockName will listen to all blocks inside the environment
// eslint-disable-next-line max-len
export const watchMetrics: WatchStream<
  BlocksMetrics,
  { blockName: string | null; envId: string }
> = (
  client: KintoCoreServiceClient,
  token: string,
  { blockName, envId },
  callbacks: StreamCallbacks<BlocksMetrics>
): Stream => {
  const req = new BlockQueryRequest();
  // leave the block name empty and it will listen to whole env
  if (blockName) {
    req.setName(blockName);
  }
  req.setEnvid(envId);

  const headers = new grpc.Metadata();
  headers.set('Authorization', `Bearer ${token}`);

  const stream = client.watchBlocksMetrics(req, headers);
  stream.on('data', (metrics: BlocksMetrics) => {
    callbacks.onData(metrics);
  });

  stream.on('end', (status?: Status) => {
    if (!status) {
      if (callbacks.onEnd) callbacks.onEnd();
      return;
    }
    callbacks.onError(status.code, status.details);
  });

  return stream;
};

// eslint-disable-next-line max-len
export const watchJobStatus: WatchStream<
  JobStatus,
  { blockName: string; envId: string }
> = (
  client: KintoCoreServiceClient,
  token: string,
  { blockName, envId },
  callbacks: StreamCallbacks<JobStatus>
): Stream => {
  const req = new BlockQueryRequest();

  req.setName(blockName);
  req.setEnvid(envId);

  const headers = new grpc.Metadata();
  headers.set('Authorization', `Bearer ${token}`);

  const stream = client.watchJobsStatus(req, headers);
  stream.on('data', (status: JobStatus) => {
    callbacks.onData(status);
  });

  stream.on('end', (status?: Status) => {
    if (!status) {
      if (callbacks.onEnd) callbacks.onEnd();
      return;
    }
    callbacks.onError(status.code, status.details);
  });

  return stream;
};
