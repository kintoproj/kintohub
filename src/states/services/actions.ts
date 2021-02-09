import { push } from 'connected-react-router';
import { CoreMethod } from 'libraries/grpc/common';
import { getOrCreateEnvironment } from 'libraries/grpc/environment';
import { deleteService, getServices } from 'libraries/grpc/service';
import { trackError } from 'libraries/helpers';
import { getServiceOverviewPageUrl } from 'libraries/helpers/path';
import { isPromotedService } from 'libraries/helpers/service';
import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { enqueueError, setLoading } from 'states/app/actions';
import { showPanel } from 'states/sidePanel/actions';
import { RootState } from 'states/types';
import { Block, BlocksMetrics, Status } from 'types/proto/models_pb';
import { ServiceMetrics, ServiceStateType } from 'types/service';

import { ServiceData } from './types';

export const ACTION_UPDATE_SERVICE_STATUS = 'UPDATE_SERVICE_STATUS_MAP';
export const ACTION_UPDATE_SERVICE_METRICS = 'UPDATE_SERVICE_METRICS';
export const ACTION_UPDATE_SERVICES = 'UPDATE_SERVICES';
export const ACTION_SET_SERVICES_LOADING = 'SET_LOADING_SERVICES';
export const ACTION_DELETE_SERVICE = 'DELETE_SERVICE';

// Not using these two action yet
// right now we re-fetch every time the page is load
// If it is too slow we can consider handling the add/delete manually
export const ACTION_ADD_SERVICE = 'ADD_SERVICE';

export interface ServiceStatus {
  blockName: string;
  releaseId: string;
  state: ServiceStateType;
}

export interface UpdateServiceStatusAction {
  type: typeof ACTION_UPDATE_SERVICE_STATUS;
  statusList: ServiceStatus[];
}

export interface UpdateServiceMetricsAction {
  type: typeof ACTION_UPDATE_SERVICE_METRICS;
  blockName: string;
  metrics: ServiceMetrics;
}

export interface UpdateServiceAction {
  type: typeof ACTION_UPDATE_SERVICES;
  services: ServiceData[];
}

export interface UpdateServiceFetchingAction {
  type: typeof ACTION_SET_SERVICES_LOADING;
  isFetching: boolean;
}

export interface DeleteServiceAction {
  type: typeof ACTION_DELETE_SERVICE;
  serviceId: string;
  serviceName: string;
}

/**
 *      Actions
 */

export const updateServiceStatus = (
  statusList: ServiceStatus[]
): UpdateServiceStatusAction => ({
  type: ACTION_UPDATE_SERVICE_STATUS,
  statusList,
});

export const updateMetrics = (
  blockName: string,
  blocksMetrics: BlocksMetrics
): UpdateServiceMetricsAction => {
  const m: ServiceMetrics = {
    blockName,
    instances: {},
    storages: {},
  };

  const metrics = blocksMetrics.getBlocksMap().get(blockName);
  if (metrics) {
    metrics.getInstancesMap().forEach((b, k) => {
      m.instances[k] = b.toObject();
    });

    metrics.getStoragesMap().forEach((b, k) => {
      m.storages[k] = b.toObject();
    });
  }

  return {
    type: ACTION_UPDATE_SERVICE_METRICS,
    blockName,
    metrics: m,
  };
};

export const updateServices = (services: Block[]): UpdateServiceAction => ({
  type: ACTION_UPDATE_SERVICES,
  services: services.map((s) => ({
    object: s.toObject(),
    binary: s.serializeBinary(),
  })),
});

export const setIsFetchServices = (
  isLoading: boolean
): UpdateServiceFetchingAction => ({
  type: ACTION_SET_SERVICES_LOADING,
  isFetching: isLoading,
});

/**
 * Thunk actions
 */
type FecthServicesOption = {
  promotedServiceName?: string;
};

/**
 * Used on ListServices page. will check also for promoted service if the state exists
 * @param grpcWrapper
 * @param envId
 * @param options
 */
export const doFetchServices = (
  grpcWrapper: <T, P>(grpc: CoreMethod<T, P>, params: P) => Promise<T>,
  envId: string,
  options: FecthServicesOption
): ThunkAction<Promise<void>, RootState, {}, AnyAction> => async (
  dispatch: ThunkDispatch<{}, {}, AnyAction>,
  getState: () => RootState
): Promise<void> => {
  dispatch(setIsFetchServices(true));
  try {
    await grpcWrapper(getOrCreateEnvironment, { envId });
    const srvs = await grpcWrapper(getServices, { envId });
    dispatch(updateServices(srvs.getItemsList()));

    if (options.promotedServiceName) {
      const promotedService = srvs
        .getItemsList()
        .find((s) => s.getName() === options.promotedServiceName);

      if (isPromotedService(promotedService)) {
        const releases = promotedService?.getSortedReleases() || [];

        if (releases.length === 0) {
          return;
        }

        // we cannot use the statusMap here coz it is not yet updated
        const pendingConfigRelease = releases.find(
          (r) => r.getStatus()?.getState() === Status.State.REVIEW_DEPLOY
        );

        if (pendingConfigRelease === undefined) {
          // there is no pending config release
          return;
        }

        if (releases.length === 1) {
          // this is the first promotion
          dispatch(
            showPanel({
              type: 'EDIT_RELEASE',
              release: pendingConfigRelease,
              service: promotedService!,
            })
          );
        } else {
          // if there is more than 1 release we go to the service page
          dispatch(
            push(getServiceOverviewPageUrl(envId, options.promotedServiceName))
          );

          setTimeout(() => {
            dispatch(
              showPanel({
                type: 'EDIT_RELEASE',
                release: pendingConfigRelease,
                service: promotedService!,
                tabIndex: 2,
              })
            );
          }, 300);
        }
      }
    }
  } catch (error) {
    trackError('FETCH_SERVICES', error);
    dispatch(enqueueError('fetch-services', error));
  } finally {
    dispatch(setIsFetchServices(false));
  }
};

export const doDeleteService = (
  grpcWrapper: <T, P>(grpc: CoreMethod<T, P>, params: P) => Promise<T>,
  envId: string,
  serviceName: string
): ThunkAction<Promise<void>, RootState, {}, AnyAction> => async (
  dispatch: ThunkDispatch<{}, {}, AnyAction>,
  getState: () => RootState
): Promise<void> => {
  // use global loading
  dispatch(setLoading(true));
  try {
    await grpcWrapper(deleteService, { envId, serviceName });
    dispatch({
      type: ACTION_DELETE_SERVICE,
      serviceName,
    });
  } catch (error) {
    trackError('DELETE_SERVICE', error);
    dispatch(enqueueError('delete-service', error));
  } finally {
    dispatch(setLoading(false));
  }
};

export type ServicesActionTypes =
  | UpdateServiceFetchingAction
  | DeleteServiceAction
  | UpdateServiceAction
  | UpdateServiceStatusAction
  | UpdateServiceMetricsAction;
