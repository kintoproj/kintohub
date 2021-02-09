import {
  CoreMethod,
  Stream,
  StreamCallbacks,
  WatchStream,
} from 'libraries/grpc/common';
import { isGRPCStreamTimeout, isPermissionDenied } from 'libraries/grpc/errors';
import { trackError } from 'libraries/helpers';
import { useEffect, useRef } from 'react';

import { GRPCClients, useGRPCClients } from './GRPCClients';

export const useGRPCWrapper = () => {
  const clients = useGRPCClients();

  // since passing only the clients won't update the callbacks
  // we pass the ref of the clients and listen to the update
  const ref = useRef<GRPCClients>();
  ref.current = clients;

  useEffect(() => {
    ref.current = clients;
  }, [clients]);

  return <T, P>(grpc: CoreMethod<T, P>, params: P): Promise<T> => {
    const { kkcClient } = ref.current!;
    return new Promise((resolve, reject) => {
      // TODO: remove token
      grpc(kkcClient!, '', params)
        .then((res) => {
          resolve(res!);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
};

// custom hooks
export const useGRPCStream = <T, P>(
  ws: WatchStream<T, P>,
  params: P,
  callbacks: StreamCallbacks<T>,
  deps: React.DependencyList = [],
  earlyExit?: () => boolean
) => {
  const clients = useGRPCClients();
  let retryCount = 0;

  useEffect(() => {
    if (earlyExit && earlyExit()) {
      return () => {};
    }
    let stream: Stream;

    const onError = async (code: number, message: string) => {
      if (isPermissionDenied(message) || isGRPCStreamTimeout(code, message)) {
        try {
          retryCount += 1;
          if (retryCount >= 3) {
            // TODO: check analytics and see if this really happens a lot
            // if this happens a lot we should not force user to logout
            // but fix the issue first
            trackError(
              'USE_GRPC_STREAM_TOO_MANY_RETRIES',
              new Error(`${retryCount} retries.`)
            );
            return;
          }
          const pStream = stream;

          // TODO: leave token as empty first
          stream = ws(clients.kkcClient!, '', params, {
            onData: (msg) => {
              callbacks.onData(msg);
            },
            onEnd: () => {
              stream.cancel();
            },
            onError,
          });

          // cancel the stream if and only if there is no error on watch
          try {
            pStream.cancel();
          } catch (error) {
            // avoid cancel error
          }
        } catch (error) {
          trackError('USE_GRPC_STREAM', error);
          // do not logout until we fix the error
          // dispatch(enqueueError('re-watch', error));
          // dispatch(doLogout());
        }
      } else {
        callbacks.onError(code, message);
      }
    };

    stream = ws(clients.kkcClient!, '', params, {
      onData: (message) => {
        callbacks.onData(message);
      },
      onEnd: () => {
        stream.cancel();
      },
      onError,
    });
    return () => {
      try {
        stream.cancel();
      } catch (error) {
        // prevent the stream is already cancelled
      }
    };
  }, [clients.kkcClient, ...deps]);
};
