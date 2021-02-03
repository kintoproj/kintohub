import { Block, Release } from 'types/proto/kkc_models_pb';

// Separating into this file is to avoid dependency cycle
export interface EditServiceTabProps {
  tabIndex: number;
  isCreate: boolean;
  isPromotedService: boolean;
  service: Block;
  release: Release;
}
