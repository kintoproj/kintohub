import {
  KintoCoreServiceClient,
  Status as PBStatus,
} from 'types/proto/coreapi_pb_service';
import {
  WatchBuildLogsRequest,
  BlockQueryRequest,
  RollbackBlockRequest,
  BlockUpdateResponse,
  TagReleaseRequest,
  PromoteReleaseRequest,
  CustomDomainNameRequest,
  CheckCustomDomainNameResponse,
  AbortBlockReleaseRequest,
} from 'types/proto/coreapi_pb';

import { ReleasesStatus, Status, Logs } from 'types/proto/models_pb';

import { grpc } from '@improbable-eng/grpc-web';
import { Empty } from 'google-protobuf/google/protobuf/empty_pb';
import {
  StreamCallbacks,
  Stream,
  WatchStream,
  CoreMethod,
  invokeGRPC,
} from './common';

// try not to use this class as it depends on grpc Status
export type ReleaseStatusMap = {
  [releaseId: string]: Status;
};

// eslint-disable-next-line max-len
export const abortRelease: CoreMethod<
  Empty,
  { blockName: string; envId: string; releaseId: string }
> = (
  client: KintoCoreServiceClient,
  token: string,
  { blockName, envId, releaseId }
) => {
  const req = new AbortBlockReleaseRequest();
  req.setBlockname(blockName);
  req.setEnvid(envId);
  req.setReleaseid(releaseId);

  return invokeGRPC<AbortBlockReleaseRequest, Empty>(
    client.abortRelease,
    token,
    req,
    client
  );
};

// eslint-disable-next-line max-len
export const rollbackRelease: CoreMethod<
  BlockUpdateResponse,
  { envId: string; releaseId: string; serviceName: string }
> = (
  client: KintoCoreServiceClient,
  token: string,
  { envId, releaseId, serviceName }
) => {
  const req = new RollbackBlockRequest();
  req.setName(serviceName);
  req.setEnvid(envId);
  req.setReleaseid(releaseId);

  return invokeGRPC<RollbackBlockRequest, BlockUpdateResponse>(
    client.rollbackBlock,
    token,
    req,
    client
  );
};

// eslint-disable-next-line max-len
export const tagRelease: CoreMethod<
  Empty,
  { tagName: string; envId: string; releaseId: string; serviceName: string }
> = (
  client: KintoCoreServiceClient,
  token: string,
  { envId, releaseId, serviceName, tagName }
) => {
  const req = new TagReleaseRequest();
  req.setEnvid(envId);
  req.setBlockname(serviceName);
  req.setTag(tagName);
  req.setReleaseid(releaseId);

  return invokeGRPC<TagReleaseRequest, Empty>(
    client.tagRelease,
    token,
    req,
    client
  );
};

// eslint-disable-next-line max-len
export const promoteRelease: CoreMethod<
  Empty,
  {
    tagName: string;
    envId: string;
    targetEnvId: string;
    releaseId: string;
    serviceName: string;
  }
> = (
  client: KintoCoreServiceClient,
  token: string,
  { envId, releaseId, serviceName, targetEnvId, tagName }
) => {
  const req = new PromoteReleaseRequest();
  req.setEnvid(envId);
  req.setBlockname(serviceName);
  req.setTag(tagName);
  req.setReleaseid(releaseId);
  req.setTargetenvid(targetEnvId);

  return invokeGRPC<PromoteReleaseRequest, Empty>(
    client.promoteRelease,
    token,
    req,
    client
  );
};

// We are not using this anymore as we need to tackle Sixer Game's migration
// They are blocked coz the naked domain on cloudflare has some issues
// eslint-disable-next-line max-len
export const checkCustomDomainName: CoreMethod<
  CheckCustomDomainNameResponse,
  { serviceName: string; cname: string; domainName: string; envId: string }
> = (
  client: KintoCoreServiceClient,
  token: string,
  { serviceName, cname, domainName, envId }
) => {
  const req = new CustomDomainNameRequest();
  req.setBlockname(serviceName);
  req.setCname(cname);
  req.setCustomdomainname(domainName);
  req.setEnvid(envId);

  return invokeGRPC<CustomDomainNameRequest, CheckCustomDomainNameResponse>(
    client.checkCustomDomainName,
    token,
    req,
    client
  );
};

// eslint-disable-next-line max-len
export const createCustomDomainName: CoreMethod<
  Empty,
  { serviceName: string; cname: string; domainName: string; envId: string }
> = (
  client: KintoCoreServiceClient,
  token: string,
  { serviceName, cname, domainName, envId }
) => {
  const req = new CustomDomainNameRequest();
  req.setBlockname(serviceName);
  req.setCname(cname);
  req.setCustomdomainname(domainName);
  req.setEnvid(envId);

  return invokeGRPC<CustomDomainNameRequest, Empty>(
    client.createCustomDomainName,
    token,
    req,
    client
  );
};

// eslint-disable-next-line max-len
export const deleteCustomDomainName: CoreMethod<
  Empty,
  { serviceName: string; cname: string; domainName: string; envId: string }
> = (
  client: KintoCoreServiceClient,
  token: string,
  { serviceName, cname, domainName, envId }
) => {
  const req = new CustomDomainNameRequest();
  req.setBlockname(serviceName);
  req.setCname(cname);
  req.setCustomdomainname(domainName);
  req.setEnvid(envId);

  return invokeGRPC<CustomDomainNameRequest, Empty>(
    client.deleteCustomDomainName,
    token,
    req,
    client
  );
};

// eslint-disable-next-line max-len
export const watchBuildLogs: WatchStream<
  string,
  { releaseId: string; blockName: string; envId: string }
> = (
  client: KintoCoreServiceClient,
  token: string,
  { releaseId, blockName, envId },
  callbacks: StreamCallbacks<string>
): Stream => {
  const req = new WatchBuildLogsRequest();
  req.setReleaseid(releaseId);
  req.setEnvid(envId);
  req.setBlockname(blockName);

  const headers = new grpc.Metadata();
  headers.set('Authorization', `Bearer ${token}`);

  const stream = client.watchBuildLogs(req, headers);
  stream.on('data', (message: Logs) => {
    const data = message.getData();
    if (typeof data === 'string') {
      callbacks.onData(data);
    } else {
      callbacks.onData(new TextDecoder('utf-8').decode(data));
    }
  });

  stream.on('end', (status?: PBStatus) => {
    if (!status) {
      if (callbacks.onEnd) callbacks.onEnd();
      return;
    }
    callbacks.onError(status.code, status.details);
  });

  return stream;
};

// eslint-disable-next-line max-len
export const watchReleaseStatus: WatchStream<
  ReleaseStatusMap,
  { blockName: string; envId: string }
> = (
  client: KintoCoreServiceClient,
  token: string,
  { blockName, envId },
  callbacks: StreamCallbacks<ReleaseStatusMap>
): Stream => {
  const req = new BlockQueryRequest();
  req.setEnvid(envId);
  req.setName(blockName);

  const headers = new grpc.Metadata();
  headers.set('Authorization', `Bearer ${token}`);

  const stream = client.watchReleasesStatus(req, headers);
  stream.on('data', (message: ReleasesStatus) => {
    const data = message.getReleasesMap();
    const statusMap: ReleaseStatusMap = {};
    // we need to transform the map here as jspb.Map is not exported
    data.forEach((v, k) => {
      statusMap[k] = v;
    });
    callbacks.onData(statusMap);
  });

  stream.on('end', (status?: PBStatus) => {
    if (!status) {
      if (callbacks.onEnd) callbacks.onEnd();
      return;
    }
    callbacks.onError(status.code, status.details);
  });

  return stream;
};
