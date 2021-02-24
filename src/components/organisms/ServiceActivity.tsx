import 'types/proto.extend/block';

import { useServiceNavigate } from 'components/hooks/PathHook';
import {
  useAuthState,
  useReleasesState,
} from 'components/hooks/ReduxStateHook';
import { useCurrentReleaseState } from 'components/hooks/ReleaseHook';
import AlertDialog from 'components/molecules/AlertDialog';
import CommitSha from 'components/molecules/CommitSha';
import { useGRPCWrapper } from 'components/templates/GRPCWrapper';
import {
  abortRelease,
  promoteRelease,
  rollbackRelease,
  tagRelease,
} from 'libraries/grpc/release';
import { toDate, toTime } from 'libraries/helpers/date';
import {
  getReleaseState,
  getReleaseStateIcon,
  getReleaseStateTypeName,
  getSuspendStateTypeName,
  getTagFromPromotedRelease,
} from 'libraries/helpers/release';
import { getFullRepositoryWithBranch } from 'libraries/helpers/service';
import _get from 'lodash.get';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { enqueueError, setLoading } from 'states/app/actions';
import { showPanel } from 'states/sidePanel/actions';
import styled from 'styled-components';
import { Environment } from 'types/environment';
import { ListServicePageState } from 'types/pageState';
import { Block, Release, Status } from 'types/proto/models_pb';
import { FixItState } from 'types/service';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import MoreIcon from '@material-ui/icons/MoreHorizRounded';
import SuspendIcon from '@material-ui/icons/OfflineBoltRounded';
import StarIcon from '@material-ui/icons/StarsRounded';
import { useServiceActivityPopover } from './ServiceActivityPopover';
import ServiceActivityPromoteDialog from './ServiceActivityPromoteDialog';
import ServiceActivityTagDialog from './ServiceActivityTagDialog';

type Props = {
  service: Block;
  releaseIdToAction?: string;
};

interface StyledComponentProps {
  component: any;
}

const StyledTableContainer = styled(TableContainer)<StyledComponentProps>`
  .MuiTableHead-root,
  .MuiTableFooter-root {
    background-color: ${(props) => props.theme.palette.grey[50]};
  }
  .MuiTableBody-root {
    background-color: ${(props) => props.theme.palette.background.paper};
  }
  .icon-color {
    color: ${(props) => props.theme.palette.text.secondary};
  }
  .time {
    color: ${(props) => props.theme.palette.text.primary};
    justify-content: center;
  }
  .column {
    display: flex;
    align-items: center;
    span {
      margin-left: 8px;
    }
  }
  .active {
    color: ${(props) => props.theme.palette.primary.main};
  }
  a:hover {
    text-decoration: underline;
  }
  tbody > tr {
    cursor: pointer;
  }
  .condensed-col {
    width: 150px;
  }
  .rows {
    display: flex;
    flex-direction: column;
    min-height: 50px;
  }
  tfoot {
    td {
      height: 20px;
    }
  }

  .anim-Deploying {
    animation: spin 4s linear infinite;
  }

  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }
`;

type DialogType =
  | 'rollback'
  | 'abort'
  | 'resume'
  | 'tag'
  | 'promote'
  | 'promote_success'
  | 'promote_again'
  | 'promote_conflict';

const ServiceActivity = ({ service, releaseIdToAction, ...props }: Props) => {
  const dispatch = useDispatch();
  const grpcWrapper = useGRPCWrapper();
  const releases = service.getSortedReleases();

  const {
    navigateToServiceOverviewPage,
    navigateToServiceReleaseLogPage,
    navigateToServices,
  } = useServiceNavigate();

  const { statusMap } = useReleasesState();
  const { envId, environments } = useAuthState();

  const [targetRelease, setTargetRelease] = React.useState<Release | null>(
    null
  );

  const [toPromoteEnv, setToPromoteEnv] = useState<Environment | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<DialogType | null>(null);

  const currentEnv = environments.find((e) => e.envId === envId);

  /**
   * The popover is using a hook to abstract the logic there
   */
  const [popover, openPopover] = useServiceActivityPopover({
    service,
    targetRelease,
    onRollbackClicked: () => {
      setDialogType('rollback');
      setDialogOpen(true);
    },
    onAbortClicked: () => {
      setDialogType('abort');
      setDialogOpen(true);
    },
    onTagClicked: () => {
      setDialogType('tag');
      setDialogOpen(true);
    },
    onResumeClicked: () => {
      if (latestDeploymentRelease) {
        rollback(latestDeploymentRelease);
      }
    },
    onPromoteClicked: () => {
      setDialogType('promote');
      setDialogOpen(true);
    },
  });
  const pathState: FixItState = _get(props, 'location.state', {});

  // Handle releaseIdToAction and the service may be updated due to
  // manage-service re-fetch
  const releaseToShow =
    service.getReleasesMap()?.get(releaseIdToAction || '') || null;
  useEffect(() => {
    if (releaseToShow) {
      if (pathState && pathState.shouldOpenEditPage) {
        dispatch(
          showPanel({
            type: 'EDIT_RELEASE',
            release: releaseToShow,
            service,
            fieldErrors: pathState.fieldErrors,
          })
        );
      } else {
        dispatch(
          showPanel({
            type: 'VIEW_LOGS',
            release: releaseToShow,
            service,
          })
        );
      }
    }
    // check again to show panel if the pathState change
    // (this is when the panel is opened and clicking on the "Fix It" on notification bar)
  }, [releaseToShow, pathState.shouldOpenEditPage]);

  const { liveRelease, latestDeploymentRelease } = useCurrentReleaseState(
    service
  );

  const abort = async () => {
    dispatch(setLoading(true));
    try {
      await grpcWrapper(abortRelease, {
        envId: envId!,
        blockName: service.getName(),
        releaseId: targetRelease?.getId()!,
      });
    } catch (error) {
      dispatch(enqueueError('abort-service', error));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const rollback = async (release: Release) => {
    dispatch(setLoading(true));
    try {
      const resp = await grpcWrapper(rollbackRelease, {
        envId: envId!,
        serviceName: service.getName(),
        releaseId: release?.getId() || '',
      });
      navigateToServiceReleaseLogPage(service.getName(), resp.getReleaseid());
    } catch (error) {
      dispatch(enqueueError('abort-service', error));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const tag = async (release: Release, tagName: string) => {
    dispatch(setLoading(true));
    try {
      await grpcWrapper(tagRelease, {
        envId: envId!,
        serviceName: service.getName(),
        releaseId: release?.getId() || '',
        tagName,
      });
      release.getTagsList().push(tagName);
    } catch (error) {
      dispatch(enqueueError('abort-service', error));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const promote = async (
    release: Release,
    targetEnvId: string,
    tagName: string
  ) => {
    dispatch(setLoading(true));
    try {
      setToPromoteEnv(
        environments.find((e) => e.envId === targetEnvId) || null
      );
      await grpcWrapper(promoteRelease, {
        envId: envId!,
        serviceName: service.getName(),
        releaseId: release?.getId() || '',
        targetEnvId,
        tagName,
      });
      setDialogType('promote_success');
    } catch (error) {
      if (error.message === 'This tag was promoted before.') {
        setDialogType('promote_again');
      } else if (
        error.message ===
        'A service with the same name already created in the promoted environment.'
      ) {
        setDialogType('promote_conflict');
      } else {
        setToPromoteEnv(null);
        dispatch(enqueueError('abort-service', error));
      }
    } finally {
      dispatch(setLoading(false));
      setDialogOpen(true);
    }
  };

  const renderSuspendRow = (release: Release, index: number) => {
    const releaseState = getReleaseState(release, statusMap);
    return (
      <TableRow key={release.getId()}>
        <TableCell component="th" scope="row">
          <div className="column">
            <SuspendIcon
              className={`icon-color anim-${getReleaseStateTypeName(
                releaseState
              )}`}
            />
            <span>{getSuspendStateTypeName(releaseState)}</span>
          </div>
        </TableCell>
        <TableCell>
          <div className="rows time">
            <span>{toDate(release.getCreatedat())}</span>
            <span>{toTime(release.getCreatedat())}</span>
          </div>
        </TableCell>
        <TableCell />
        <TableCell />
        <TableCell />
        <TableCell align="right">
          {/* 
            Only show the "..." button when this is the top suspended release 
          */}
          {index === 0 && (
            <IconButton
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                event.preventDefault();
                event.stopPropagation();
                setTargetRelease(release);
                openPopover(event);
              }}
            >
              <MoreIcon fontSize="small" />
            </IconButton>
          )}
        </TableCell>
      </TableRow>
    );
  };

  const renderDeploymentRow = (release: Release) => {
    const releaseState = getReleaseState(release, statusMap);

    const Icon = getReleaseStateIcon(releaseState);
    return (
      <TableRow
        key={release.getId()}
        hover={true}
        onClick={() => {
          if (releaseState === Status.State.REVIEW_DEPLOY) {
            dispatch(
              showPanel({
                type: 'EDIT_RELEASE',
                release,
                service,
              })
            );
          } else {
            dispatch(
              showPanel({
                type: 'VIEW_LOGS',
                release,
                service,
              })
            );
          }
        }}
      >
        <TableCell component="th" scope="row">
          {liveRelease?.getId() === release.getId() ? (
            <div className="column active">
              <StarIcon />
              <span>Live Version</span>
            </div>
          ) : (
            <div className="column">
              <Icon
                className={`icon-color anim-${getReleaseStateTypeName(
                  releaseState
                )}`}
              />
              <span>{getReleaseStateTypeName(releaseState)}</span>
            </div>
          )}
        </TableCell>
        <TableCell>
          <div className="rows time">
            <span>{toDate(release.getCreatedat())}</span>
            <span>{toTime(release.getCreatedat())}</span>
          </div>
        </TableCell>
        <TableCell>
          <CommitSha release={release} />
        </TableCell>
        <TableCell>
          <a
            href={getFullRepositoryWithBranch(release)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(evt) => {
              evt.stopPropagation();
            }}
          >
            {release.getBuildconfig()?.getRepository()?.getBranch()}
          </a>
        </TableCell>
        <TableCell>
          {release.getTagsList().map((t) => (
            <span key={t}>{t}</span>
          ))}
        </TableCell>
        <TableCell align="right">
          <IconButton
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              event.preventDefault();
              event.stopPropagation();
              setTargetRelease(release);
              openPopover(event);
            }}
          >
            <MoreIcon fontSize="small" />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <StyledTableContainer component={Paper}>
      <Table className="table" aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className="condensed-col">
              <Typography variant="overline">Status</Typography>
            </TableCell>
            <TableCell className="condensed-col">
              <Typography variant="overline">Time</Typography>
            </TableCell>
            <TableCell className="condensed-col">
              <Typography variant="overline">Commit</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="overline">Branch</Typography>
            </TableCell>
            <TableCell className="condensed-col">
              <Typography variant="overline">Tag</Typography>
            </TableCell>
            <TableCell className="condensed-col" />
          </TableRow>
        </TableHead>
        <TableBody>
          {releases.map((release, i) => {
            const releaseType = release.getType();
            const isSuspend = releaseType === Release.Type.SUSPEND;
            return isSuspend
              ? renderSuspendRow(release, i)
              : renderDeploymentRow(release);
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={10} />
          </TableRow>
        </TableFooter>
      </Table>
      {popover}
      {dialogType === 'abort' && (
        <AlertDialog
          title="Abort Deployment?"
          text="Your deployment will be terminated."
          isOpen={dialogOpen}
          setIsOpen={setDialogOpen}
          confirmText="Abort Now"
          onConfirm={() => {
            setTargetRelease(null);
            abort();
          }}
          onCancel={() => {
            setTargetRelease(null);
            setDialogType(null);
          }}
        />
      )}
      {dialogType === 'rollback' && (
        <AlertDialog
          title="Are you sure you want to Rollback?"
          text={`Your ${toDate(targetRelease?.getCreatedat()).replace(
            /,.*/,
            ''
          )},${toTime(
            targetRelease?.getCreatedat()
          )} release will be deployed again with the settings, configurations and code used at that time.`}
          isOpen={dialogOpen}
          setIsOpen={setDialogOpen}
          confirmText="Confirm Rollback"
          onConfirm={() => {
            if (targetRelease) {
              rollback(targetRelease);
              setTargetRelease(null);
            }
          }}
          onCancel={() => {
            setTargetRelease(null);
            setDialogType(null);
          }}
        />
      )}
      {dialogType === 'tag' && (
        <ServiceActivityTagDialog
          isOpen={dialogOpen}
          setIsOpen={setDialogOpen}
          onSubmit={(tagName) => {
            if (targetRelease) {
              tag(targetRelease, tagName);
              setTargetRelease(null);
            }
          }}
          onCancel={() => {
            setTargetRelease(null);
            setDialogType(null);
          }}
        />
      )}
      {dialogType === 'promote' && (
        <ServiceActivityPromoteDialog
          service={service}
          tag={getTagFromPromotedRelease(targetRelease)}
          isOpen={dialogOpen}
          setIsOpen={setDialogOpen}
          onSubmit={(targetEnvId, tagName) => {
            if (targetRelease) {
              // double check if the tagName exists
              if (tagName) {
                promote(targetRelease, targetEnvId, tagName);
              }
            }
          }}
          onCancel={() => {
            setTargetRelease(null);
            setDialogType(null);
          }}
        />
      )}
      {dialogType === 'promote_again' && (
        <AlertDialog
          title={`Tag ${getTagFromPromotedRelease(
            targetRelease
          )} already exists for ${service.getName() || ''} in ${
            toPromoteEnv?.name || ''
          } environment`}
          text={`To avoid this conflict, you can rollback to a previous release in ${
            toPromoteEnv?.name || ''
          } or create a new tag in ${currentEnv?.name || ''}.`}
          isOpen={dialogOpen}
          setIsOpen={setDialogOpen}
          confirmText="Go to service"
          useDefaultTheme={true}
          onConfirm={async () => {
            if (toPromoteEnv) {
              // go directly to the target env
              navigateToServiceOverviewPage(
                service.getName(),
                toPromoteEnv.envId
              );
              return;
            }

            setTargetRelease(null);
            setDialogType(null);
            setToPromoteEnv(null);
          }}
          onCancel={() => {
            setTargetRelease(null);
            setDialogType(null);
            setToPromoteEnv(null);
          }}
        />
      )}
      {dialogType === 'promote_conflict' && (
        <AlertDialog
          title={`A ${service.getName()} service already exists in ${
            toPromoteEnv?.name
          }`}
          text="You must first delete the conflicting service from the desired environment you plan to promote to."
          isOpen={dialogOpen}
          setIsOpen={setDialogOpen}
          confirmText="Go To Conflict"
          useDefaultTheme={true}
          onConfirm={async () => {
            if (toPromoteEnv) {
              navigateToServices({ targetEnvId: toPromoteEnv.envId });
              return;
            }

            setTargetRelease(null);
            setDialogType(null);
            setToPromoteEnv(null);
          }}
          onCancel={() => {
            setTargetRelease(null);
            setDialogType(null);
            setToPromoteEnv(null);
          }}
        />
      )}
      {dialogType === 'promote_success' && (
        <AlertDialog
          title={`You promoted ${service.getName()}!`}
          text={`Next step, edit your settings to work properly in ${toPromoteEnv?.name}. In the future, we will automatically open the panel for you to edit your tagged service.`}
          isOpen={dialogOpen}
          setIsOpen={setDialogOpen}
          confirmText="Edit Settings"
          hideCancelButton={true}
          useDefaultTheme={true}
          onConfirm={async () => {
            if (toPromoteEnv) {
              const s: ListServicePageState = {
                promotedServiceName: service.getName(),
              };
              navigateToServices({
                targetEnvId: toPromoteEnv.envId,
                state: s,
              });
              return;
            }

            setTargetRelease(null);
            setDialogType(null);
            setToPromoteEnv(null);
          }}
        />
      )}
    </StyledTableContainer>
  );
};

export default ServiceActivity;
