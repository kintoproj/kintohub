import { Block, Release, Status } from 'types/proto/models_pb';
import { PopoverAction, usePopover } from 'components/templates/PopoverHook';
import { getReleaseState } from 'libraries/helpers/release';
import { showPanel } from 'states/sidePanel/actions';
import { useCurrentReleaseState } from 'components/hooks/ReleaseHook';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'states/types';
import { ReleasesState } from 'states/releases/types';

import EditIcon from '@material-ui/icons/EditRounded';
import LogIcon from '@material-ui/icons/ListRounded';
import AbortIcon from '@material-ui/icons/PanToolRounded';
import RollbackIcon from '@material-ui/icons/UndoRounded';
import TagIcon from '@material-ui/icons/LabelImportantRounded';
import PromoteIcon from '@material-ui/icons/PublishRounded';

type Props = {
  service: Block;
  targetRelease: Release | null;
  onRollbackClicked: () => void;
  onResumeClicked: () => void;
  onAbortClicked: () => void;
  onTagClicked: () => void;
  onPromoteClicked: () => void;
};

/**
 * Determine what actions to show for each release
 */
export const useServiceActivityPopover = ({
  service,
  targetRelease,
  onRollbackClicked,
  onResumeClicked,
  onAbortClicked,
  onTagClicked,
  onPromoteClicked,
}: Props) => {
  const { statusMap } = useSelector<RootState, ReleasesState>(
    (state: RootState) => state.releases
  );

  const dispatch = useDispatch();

  const { liveRelease } = useCurrentReleaseState(service);
  /**
   * Generate pop over actions
   */

  const actions: PopoverAction[] = [];
  const targetReleaseType = targetRelease
    ? targetRelease.getType()
    : Release.Type.NOT_SET;

  const targetReleaseState = targetRelease
    ? getReleaseState(targetRelease, statusMap)
    : 0;

  const serviceType = targetRelease
    ? targetRelease.getRunconfig()?.getType()
    : Block.Type.NOT_SET;

  const isCatalog = serviceType === Block.Type.CATALOG;

  const isTargetReleaseSuspend = targetReleaseType === Release.Type.SUSPEND;

  const isTargetReleaseDeployed =
    !isTargetReleaseSuspend && targetReleaseState === Status.State.SUCCESS;

  const isTargetReleaseAbortable =
    !isTargetReleaseSuspend && targetReleaseState === Status.State.RUNNING;

  const isTargetSuspendReleaseResumable =
    isTargetReleaseSuspend && targetReleaseState === Status.State.SUCCESS;

  const isTargetReleaseRollbackable =
    !isTargetReleaseSuspend &&
    targetReleaseState === Status.State.SUCCESS &&
    targetRelease?.getId() !== liveRelease?.getId();

  const isTargetReleaseTaggable =
    isTargetReleaseDeployed && targetRelease?.getTagsList().length === 0;

  const isTargetReleaseTagPromotable =
    isTargetReleaseDeployed && (targetRelease?.getTagsList().length || 0) > 0;

  const isTargetReleasePendingConfig =
    targetReleaseState === Status.State.REVIEW_DEPLOY;

  if (targetRelease && !isTargetReleaseSuspend) {
    actions.push({
      label: 'Edit Release',
      icon: EditIcon,
      onClick: () => {
        dispatch(
          showPanel({
            type: 'EDIT_RELEASE',
            release: targetRelease,
            service,
          })
        );
      },
    });

    // logs only available to non-catalog
    if (
      targetRelease.getRunconfig()?.getType() !== Block.Type.CATALOG &&
      !isTargetReleasePendingConfig
    ) {
      actions.push({
        label: 'View Logs',
        icon: LogIcon,
        onClick: () => {
          dispatch(
            showPanel({
              type: 'VIEW_LOGS',
              release: targetRelease,
              service,
            })
          );
        },
      });
    }

    if (isTargetReleaseAbortable) {
      actions.push({
        label: 'Abort',
        icon: AbortIcon,
        onClick: onAbortClicked,
      });
    }

    if (isTargetReleaseDeployed && !isCatalog) {
      // adding the divider
      actions.push(undefined);
      actions.push({
        label: 'Create Tag',
        icon: TagIcon,
        onClick: onTagClicked,
        disabled: !isTargetReleaseTaggable,
        isBeta: true,
      });
      actions.push({
        label: 'Promote Tag to Env',
        icon: PromoteIcon,
        onClick: onPromoteClicked,
        disabled: !isTargetReleaseTagPromotable,
        isBeta: true,
      });
    }

    if (isTargetReleaseRollbackable) {
      if (isTargetReleaseDeployed) {
        actions.push(undefined);
      }
      actions.push({
        label: 'Rollback',
        icon: RollbackIcon,
        onClick: onRollbackClicked,
      });
    }
  } else if (targetRelease && isTargetReleaseSuspend) {
    actions.push({
      label: 'Resume',
      onClick: onResumeClicked,
      disabled: !isTargetSuspendReleaseResumable,
    });
  }

  return usePopover({
    actions,
  });
};
