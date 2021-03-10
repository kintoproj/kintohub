import { Block, Release } from 'types/proto/models_pb';
import { ServiceType } from '../service';

// Separating into this file is to avoid dependency cycle
export interface EditServiceTabProps {
  tabIndex: number;
  isCreate: boolean;
  isPromotedService: boolean;
  service: Block;
  release: Release;
  serviceType: ServiceType;
}
