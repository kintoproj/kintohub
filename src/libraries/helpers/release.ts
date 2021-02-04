import React from 'react';
import DeployingIcon from '@material-ui/icons/AutorenewRounded';
import DeployedIcon from '@material-ui/icons/CheckCircleOutlineRounded';
import FailedIcon from '@material-ui/icons/ErrorOutlineRounded';
import AbortedIcon from '@material-ui/icons/HighlightOffRounded';

import { Status, Release, JobStatus } from 'types/proto/models_pb';
import {
  ReleaseStateType,
  ReleaseStatusMap,
  ReleaseStatus,
} from 'types/release';
import { KINTO_COLOR_STATUS_RED, KINTO_GREY, kintoGreen } from 'theme/colors';
import { IconProps } from '@material-ui/core/Icon';
import { JobStateType } from 'types/service';

export const getReleaseStateTypeName = (state: ReleaseStateType): string => {
  switch (state) {
    case Status.State.FAIL:
      return 'Failed';
    case Status.State.ABORTED:
      return 'Aborted';
    case Status.State.SUCCESS:
      return 'Deployed';
    case Status.State.PENDING:
      return 'Pending';
    case Status.State.RUNNING:
      return 'Deploying';
    case Status.State.REVIEW_DEPLOY:
      return 'Needs Config';
  }
  return 'Pending';
};

export const getSuspendStateTypeName = (state: ReleaseStateType): string => {
  switch (state) {
    case Status.State.FAIL:
      return 'Failed';
    case Status.State.PENDING:
      return 'Pending';
    case Status.State.ABORTED: // not possible?
    case Status.State.REVIEW_DEPLOY: // not possible?
    case Status.State.SUCCESS:
      return 'Suspended';
    case Status.State.RUNNING:
      return 'Suspending';
  }
  return 'Pending';
};

export const getReleaseStateIcon = (
  state: ReleaseStateType
): React.ComponentType<IconProps> => {
  switch (state) {
    case Status.State.FAIL:
      return FailedIcon;
    case Status.State.ABORTED:
      return AbortedIcon;
    case Status.State.SUCCESS:
      return DeployedIcon;
    case Status.State.PENDING:
      return DeployingIcon;
    case Status.State.RUNNING:
      return DeployingIcon;
  }
  return DeployingIcon;
};

export const getJobStateTypeName = (state: JobStateType): string => {
  switch (state) {
    case JobStatus.State.ERROR:
      return 'Error';
    case JobStatus.State.OOM_KILLED:
      return 'Out Of Memory Killed';
    case JobStatus.State.DELETED:
      return 'Deleted';
    case JobStatus.State.COMPLETED:
      return 'Completed';
    case JobStatus.State.PENDING:
      return 'Pending';
    case JobStatus.State.RUNNING:
      return 'Running';
  }
  return 'Pending';
};

export const getJobStateIcon = (
  state: JobStateType
): React.ComponentType<IconProps> => {
  switch (state) {
    case JobStatus.State.ERROR:
      return FailedIcon;
    case JobStatus.State.OOM_KILLED:
      return FailedIcon;
    case JobStatus.State.DELETED:
      return AbortedIcon;
    case JobStatus.State.COMPLETED:
      return DeployedIcon;
    case JobStatus.State.PENDING:
      return DeployingIcon;
    case JobStatus.State.RUNNING:
      return DeployingIcon;
  }
  return DeployingIcon;
};

export const getReleaseState = (
  release: Release | null,
  stateMap: ReleaseStatusMap
): ReleaseStateType => {
  const releaseId = release?.getId() || '';
  if (stateMap[releaseId]) {
    return stateMap[releaseId].state;
  }
  return release?.getStatus()?.getState()! || Status.State.NOT_SET;
};

export const getReleaseStatus = (
  release: Release,
  stateMap: ReleaseStatusMap
): ReleaseStatus | null => {
  const releaseId = release.getId();
  if (stateMap[releaseId]) {
    return stateMap[releaseId];
  }
  return null;
};

export const getColorByReleaseState = (state: ReleaseStateType): string => {
  switch (state) {
    case Status.State.FAIL:
      return KINTO_COLOR_STATUS_RED;
    case Status.State.REVIEW_DEPLOY:
      return KINTO_COLOR_STATUS_RED;
    case Status.State.ABORTED:
      return KINTO_COLOR_STATUS_RED;
    case Status.State.PENDING:
      return KINTO_GREY;
    case Status.State.RUNNING:
      return KINTO_GREY;
    case Status.State.SUCCESS:
      return kintoGreen(200);
  }
  return KINTO_GREY;
};

export const getTagFromPromotedRelease = (release: Release | null): string => {
  if (!release || release.getTagsList().length === 0) {
    return '';
  }
  return release.getTagsList()[0];
};
