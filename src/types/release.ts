import { Status } from 'types/proto/kkc_models_pb';

export type ReleaseStatus = {
  state: ReleaseStateType;
};

export type ReleaseStatusMap = {
  [releaseId: string]: ReleaseStatus;
};

export type ReleaseStateType = Status.StateMap[keyof Status.StateMap];
