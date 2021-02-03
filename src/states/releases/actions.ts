import { ReleaseStatusMap } from 'libraries/grpc/release';

export const ACTION_UPDATE_RELEASE_STATUS = 'UPDATE_RELEASE_STATUS';

export interface UpdateReleaseStatusAction {
  type: typeof ACTION_UPDATE_RELEASE_STATUS;
  blockName: string;
  statusMap: ReleaseStatusMap;
}

export const updateReleasesStatus = (
  blockName: string,
  statusMap: ReleaseStatusMap
): UpdateReleaseStatusAction => ({
  type: ACTION_UPDATE_RELEASE_STATUS,
  blockName,
  statusMap,
});

export type ReleasesActionTypes = UpdateReleaseStatusAction;
