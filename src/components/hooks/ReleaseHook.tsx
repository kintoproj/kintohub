import { getReleaseState } from 'libraries/helpers/release';
import { useSelector } from 'react-redux';
import { ReleasesState } from 'states/releases/types';
import { RootState } from 'states/types';
import { Block, Status, Release } from 'types/proto/kkc_models_pb';

interface CurrentReleaseState {
  // true when there is one running release
  hasLiveRelease: boolean;

  // Get the current live release. Return null if this is a new service/ suspended/ undeployed
  liveRelease: Release | null;

  // Get the latest live release. Different with liveRelease,
  // it will still returns if the service is already suspended/ undeployed
  latestLiveRelease: Release | null;

  // Get the latest deployment release.
  // This will return even running release. Best for getting the runConfig/buildConfig
  latestDeploymentRelease: Release | null;

  // Get the latest release.
  // including suspend/undeploy
  latestRelease: Release | null;

  //
  isSuspended: boolean;

  //
  isUndeployed: boolean;

  // when the service is promoted
  isPendingConfig: boolean;
}

//
export const useCurrentReleaseState = (
  service: Block | null
): CurrentReleaseState => {
  const rs: CurrentReleaseState = {
    hasLiveRelease: false,
    liveRelease: null,
    latestRelease: null,
    latestLiveRelease: null,
    latestDeploymentRelease: null,
    isSuspended: false,
    isUndeployed: false,
    isPendingConfig: false,
  };
  const { statusMap } = useSelector<RootState, ReleasesState>(
    (state: RootState) => state.releases
  );
  const releases = service?.getSortedReleases() || [];
  if (releases.length === 0) {
    return rs;
  }

  const latestRelease = releases[0];
  const latestReleaseType = latestRelease.getType();
  rs.latestRelease = latestRelease;
  // a failed suspend -> is not a suspend
  rs.isSuspended = latestReleaseType === Release.Type.SUSPEND
    && getReleaseState(latestRelease, statusMap) !== Status.State.FAIL;

  rs.isUndeployed = latestReleaseType === Release.Type.UNDEPLOY;

  let noLiveRelease = rs.isSuspended || rs.isUndeployed;

  for (let i = 0; i < releases.length; i++) {
    const release = releases[i];
    const releaseType = release.getType();
    const releaseState = getReleaseState(release, statusMap);
    const isDeployment =
      releaseType === Release.Type.ROLLBACK ||
      releaseType === Release.Type.DEPLOY ||
      releaseType === Release.Type.NOT_SET; // for backward compatibility
    const isTermination =
      releaseType === Release.Type.SUSPEND ||
      releaseType === Release.Type.UNDEPLOY;
    if (isTermination) {
      // any successful deployment before suspension/undeployment wont be a live release
      noLiveRelease = true;
    } else if (isDeployment) {
      if (rs.latestDeploymentRelease === null) {
        rs.latestDeploymentRelease = release;
        // only if the latest deployment release is a review state
        if (releaseState === Status.State.REVIEW_DEPLOY) {
          rs.isPendingConfig = true;
        }
      }

      if (releaseState === Status.State.SUCCESS) {
        // we only consider SUCCESS deployment/rollback as live release
        if (!noLiveRelease && rs.liveRelease === null) {
          rs.liveRelease = release;
          rs.hasLiveRelease = true;
        }

        if (rs.latestLiveRelease === null) {
          rs.latestLiveRelease = release;
        }
      }
    }
  }
  return rs;
};
