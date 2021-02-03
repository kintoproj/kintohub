import { ReleaseStatusMap } from 'types/release';

/**
 * This is to store the release status (Pending/Deploying...)
 * The stream in activity page is responsible for firing action to update this
 */
export interface ReleasesState {
  blockName: string | null;
  statusMap: ReleaseStatusMap;
}
