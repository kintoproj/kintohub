import {
  useAuthState,
  useServicesState,
} from 'components/hooks/ReduxStateHook';
import { watchServiceHealth } from 'libraries/grpc/service';
import {
  getServiceHealthStateFromMap,
  serviceHealthToString,
} from 'libraries/helpers/service';
import _isEqual from 'lodash.isequal';
/* eslint-disable no-continue */
import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { enqueueError, enqueueNotification } from 'states/app/actions';
import { updateServiceStatus } from 'states/services/actions';
import { BlockStatus } from 'types/proto/models_pb';
import { ServiceStateMap } from 'types/service';

import { useGRPCClients } from './GRPCClients';
import { useGRPCStream } from './GRPCWrapper';

/**
 * This component should be unmounted when environment changed
 */
const ServiceStatusListener = () => {
  const dispatch = useDispatch();
  const { envId } = useAuthState();
  const clients = useGRPCClients();
  const { statusMap } = useServicesState();

  const ref = useRef<{
    [blockName: string]: ServiceStateMap;
  }>({});

  // strategy: dispatch the status to state
  // and compare the diff from the state change

  useGRPCStream(
    watchServiceHealth,
    {
      blockName: null,
      envId: envId!,
    },
    {
      onData: (statuses) => {
        dispatch(
          updateServiceStatus(
            statuses.getBlockstatusesList().map((status) => ({
              blockName: status.getBlockname(),
              releaseId: status.getReleaseid(),
              state: status.getState(),
            }))
          )
        );
      },
      onError: (code, message) => {
        dispatch(enqueueError('watch-services-health', new Error(message)));
      },
    },
    [envId, clients.kkcClient],
    () => !envId || !clients.kkcClient
  );

  // TODO: this is not working properly and need unit testings
  useEffect(() => {
    const prevStatusMap = ref.current;
    for (const blockName of Object.keys(statusMap)) {
      // this is either the initial fetch/ first deployment
      if (!prevStatusMap[blockName]) {
        continue;
      }

      const serviceStatus = statusMap[blockName];
      const servicePrevStatus = prevStatusMap[blockName];
      if (_isEqual(serviceStatus, servicePrevStatus)) {
        continue;
      }

      const prevHealth = getServiceHealthStateFromMap(servicePrevStatus);
      const currentHealth = getServiceHealthStateFromMap(serviceStatus);
      if (prevHealth === currentHealth) {
        continue;
      }

      if (
        currentHealth === BlockStatus.State.HEALTHY &&
        prevHealth === BlockStatus.State.UNHEALTHY
      ) {
        dispatch(
          enqueueNotification({
            key: `service-${blockName}-healthy`,
            message: `Service ${blockName} became ${serviceHealthToString(
              currentHealth
            )}`,
            type: 'info',
            dismissed: false,
          })
        );
      } else if (
        currentHealth === BlockStatus.State.UNHEALTHY &&
        prevHealth === BlockStatus.State.HEALTHY
      ) {
        dispatch(
          enqueueError(
            `service-${blockName}-unhealthy`,
            new Error(`Service ${blockName} became unhealthy`)
          )
        );
      }
    }

    ref.current = statusMap;
  }, [statusMap]);

  return <></>;
};

export default ServiceStatusListener;
