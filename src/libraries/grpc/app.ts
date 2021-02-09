import { KintoCoreServiceClient } from 'types/proto/coreapi_pb_service';
import { Empty } from 'google-protobuf/google/protobuf/empty_pb';
import { KintoConfiguration } from 'types/proto/models_pb';
import { SyncTimeRequest, SyncTimeResponse } from 'types/proto/coreapi_pb';
import { invokeGRPC, CoreMethod } from './common';

export const getKintoConfig: CoreMethod<KintoConfiguration, {}> = (
  client: KintoCoreServiceClient
): Promise<KintoConfiguration | null> => {
  return invokeGRPC<Empty, KintoConfiguration>(
    client.getKintoConfiguration,
    '',
    new Empty(),
    client
  );
};

export const syncTime: CoreMethod<SyncTimeResponse, { sendTimeMs: number }> = (
  client: KintoCoreServiceClient,
  token,
  { sendTimeMs }
): Promise<SyncTimeResponse | null> => {
  const req = new SyncTimeRequest();
  req.setSendtimems(sendTimeMs);

  return invokeGRPC<SyncTimeRequest, SyncTimeResponse>(
    client.syncTime,
    '',
    req,
    client
  );
};
