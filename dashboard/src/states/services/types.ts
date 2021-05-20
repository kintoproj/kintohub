import { ServiceStateMap, ServiceMetrics } from 'types/service';
import { Block } from 'types/proto/models_pb';

export type ServiceData = {
  // the json object
  object: Block.AsObject;
  // this is for the case we want to use the actual grpc model
  // e.g. get the release data
  // TOOD: in future we may want to use all json data without any grpc model?
  binary: Uint8Array;
};

/**
 * This state stores the map for
 */
export interface ServicesState {
  statusMap: { [blockName: string]: ServiceStateMap };
  metricsMap: { [blockName: string]: ServiceMetrics };
  services: ServiceData[];
  isServicesFetching: boolean;
  isServicesLoaded: boolean;
}
