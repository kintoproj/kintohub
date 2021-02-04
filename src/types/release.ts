import { Status } from 'types/proto/models_pb';

export type ReleaseStatus = {
  state: ReleaseStateType;
};

export type ReleaseStatusMap = {
  [releaseId: string]: ReleaseStatus;
};

export type ReleaseStateType = Status.StateMap[keyof Status.StateMap];
