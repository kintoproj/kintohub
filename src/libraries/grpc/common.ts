import {
  KintoKubeCoreServiceClient,
  ServiceError,
} from 'types/proto/coreapi_pb_service';
import { grpc } from '@improbable-eng/grpc-web';

export interface WatchStream<T, P> {
  (
    client: KintoKubeCoreServiceClient,
    token: string,
    params: P,
    callbacks: StreamCallbacks<T>
  ): Stream;
}

export interface StreamCallbacks<T> {
  onData: (message: T) => void;
  onEnd?: () => void;
  onError: (code: Number, message: string) => void;
}
export interface Stream {
  cancel: () => void;
}

export interface KKCMethod<T, P> {
  (
    client: KintoKubeCoreServiceClient,
    token: string,
    params: P
  ): Promise<T | null>;
}

export interface KKCNativeCall<T, R> {
  (
    requestMessage: T,
    metadata: grpc.Metadata,
    callback: (error: ServiceError | null, responseMessage: R | null) => void
  ): void;
}

export const invokeGRPC = <T, R>(
  call: KKCNativeCall<T, R>,
  token: string,
  req: T,
  context: KintoKubeCoreServiceClient
): Promise<R | null> => {
  const headers = new grpc.Metadata();
  headers.set('Authorization', `Bearer ${token}`);

  return new Promise((resolve, reject) => {
    call.bind(context)(req, headers, (err, message) => {
      if (err) {
        reject(err);
      }
      resolve(message);
    });
  });
};

export const getAuthHeader = (token: string): grpc.Metadata => {
  const headers = new grpc.Metadata();
  headers.set('Authorization', `Bearer ${token}`);

  return headers;
};
