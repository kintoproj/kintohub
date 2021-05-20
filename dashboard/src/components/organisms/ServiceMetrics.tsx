import 'types/proto.extend/block';

import BasicLinkButton from 'components/atoms/BasicLinkButton';
import { HorizontalSpacer, VerticalSpacer } from 'components/atoms/Spacer';
import { useServiceNavigate } from 'components/hooks/PathHook';
import {
  useAuthState,
  useServicesState,
} from 'components/hooks/ReduxStateHook';
import { useCurrentReleaseState } from 'components/hooks/ReleaseHook';
import AlertDialog from 'components/molecules/AlertDialog';
import EmptyTableRow from 'components/molecules/EmptyTableRow';
import MetricCard from 'components/molecules/MetricCard';
import { renderPodState } from 'components/molecules/ServiceCard';
import { useGRPCWrapper } from 'components/templates/GRPCWrapper';
import { PopoverAction, usePopover } from 'components/templates/PopoverHook';
import { restartPod } from 'libraries/grpc/service';
import {
  formatDataUnit,
  formatK8SCpu,
  formatK8SMemory,
  userFriendlyInstanceName,
} from 'libraries/helpers';
import { getServiceOverallMetrics } from 'libraries/helpers/service';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { enqueueError, setLoading } from 'states/app/actions';
import { showPanel } from 'states/sidePanel/actions';
import styled from 'styled-components';
import { bps } from 'theme';
import { Block, BlockInstance } from 'types/proto/models_pb';

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
import CommitSha from 'components/molecules/CommitSha';

type Props = {
  service: Block;
};

interface StyledComponentProps {
  component: any;
}

const StyledDiv = styled.div`
  .MuiCard-root {
    padding: 40px;
    input {
      min-width: 400px;
    }
  }

  .MuiTableHead-root,
  .MuiTableFooter-root {
    background-color: ${(props) => props.theme.palette.grey[50]};
  }
  .MuiTableBody-root {
    background-color: ${(props) => props.theme.palette.background.paper};
  }

  .metric-card-wrapper {
    display: flex;
    flex-direction: row;
    .metric-card {
      width: 50%;
    }

    ${bps.down('sm')} {
      flex-direction: column;
      .metric-card {
        width: 100%;
        margin-bottom: 16px;
      }
    }
  }

  .table-wrapper {
    ${bps.down('sm')} {
      max-width: calc(100vw - 40px);
    }
  }
`;

const ServiceMetrics = ({ service }: Props) => {
  const { metricsMap } = useServicesState();
  const { envId } = useAuthState();
  const { navigateToServiceConsoleLogPage } = useServiceNavigate();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { latestDeploymentRelease: release } = useCurrentReleaseState(service);
  const serviceType = release?.getRunconfig()?.getType();

  const dispatch = useDispatch();
  const metrics = metricsMap[service.getName()];
  const [
    targetInstance,
    setTargetInstance,
  ] = useState<BlockInstance.AsObject | null>(null);

  const grpcWrapper = useGRPCWrapper();

  const restartInstance = async () => {
    dispatch(setLoading(true));
    try {
      await grpcWrapper(restartPod, {
        envId: envId!,
        podName: targetInstance?.name,
      });
    } catch (error) {
      dispatch(enqueueError('restart-instance', error));
    } finally {
      dispatch(setLoading(false));
    }
  };

  let actions: PopoverAction[] = [];
  if (targetInstance) {
    actions = [
      {
        label: 'View Console',
        onClick: () => {
          navigateToServiceConsoleLogPage(
            service.getName(),
            targetInstance.name
          );
        },
      },
      {
        label: 'Restart Instance',
        onClick: () => {
          setIsDialogOpen(true);
        },
      },
    ];
  }
  const [popover, open] = usePopover({
    actions,
  });

  const {
    totalMemUsage,
    totalMemRequest,
    totalCpuUsage,
    totalCpuRequest,
    totalStorageUsage,
    totalStorageRequest,
  } = getServiceOverallMetrics(metrics);

  const isSharedCPU = totalCpuRequest === 0;

  return (
    <StyledDiv>
      <Typography color="textPrimary" variant="h6">
        Summary
      </Typography>
      <VerticalSpacer size={16} />
      <div className="metric-card-wrapper">
        <MetricCard
          className="metric-card"
          title="MEMORY"
          current={formatK8SMemory(totalMemUsage, 0)}
          max={formatK8SMemory(totalMemRequest, 0)}
          percentage={totalMemUsage / totalMemRequest}
        />
        <HorizontalSpacer size={16} />
        <MetricCard
          className="metric-card"
          title="CPU"
          current={isSharedCPU ? 'Shared' : formatK8SCpu(totalCpuUsage)}
          max={
            isSharedCPU ? (
              <BasicLinkButton
                onClick={() => {
                  if (!release) {
                    return;
                  }
                  dispatch(
                    showPanel({
                      type: 'EDIT_RELEASE',
                      release,
                      service,
                      // assume the tab wont change
                      tabIndex: 3,
                    })
                  );
                }}
                data-cy="upgrade-dedicated-button"
              >
                Need dedicated CPU?
              </BasicLinkButton>
            ) : (
              `${formatK8SCpu(totalCpuRequest)}${
                totalCpuRequest > 0 ? ' Cores' : ''
              }`
            )
          }
          percentage={totalCpuUsage / totalCpuRequest}
        />
        {serviceType === Block.Type.CATALOG && (
          <>
            <HorizontalSpacer size={16} />
            <MetricCard
              className="metric-card"
              title="STORAGE"
              current={formatDataUnit(totalStorageUsage, 0)}
              max={formatDataUnit(totalStorageRequest, 0)}
              percentage={totalStorageUsage / totalStorageRequest}
            />
          </>
        )}
      </div>
      <VerticalSpacer size={40} />
      <Typography color="textPrimary" variant="h6">
        Instances
      </Typography>
      <VerticalSpacer size={16} />
      <TableContainer component={Paper} className="table-wrapper">
        <Table className="table" aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className="condensed-col">
                <Typography variant="overline">Name/Instance</Typography>
              </TableCell>
              <TableCell className="condensed-col" align="center">
                <Typography variant="overline">CPU</Typography>
              </TableCell>
              <TableCell className="condensed-col" align="center">
                <Typography variant="overline">Memory</Typography>
              </TableCell>
              <TableCell className="condensed-col" align="center">
                <Typography variant="overline">Restarts</Typography>
              </TableCell>
              <TableCell className="condensed-col" align="center">
                <Typography variant="overline">Commit</Typography>
              </TableCell>
              <TableCell className="condensed-col">
                <Typography variant="overline">Status</Typography>
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {(!metrics || Object.values(metrics.instances).length === 0) && (
              <EmptyTableRow text="No instances" colSpan={7} />
            )}

            {metrics &&
              Object.values(metrics.instances).map((instance) => {
                const instanceRelease = service
                  .getReleasesMap()
                  .get(instance.releaseid);

                return (
                  <TableRow key={instance.name} hover={true}>
                    <TableCell component="th" scope="row">
                      <span>{userFriendlyInstanceName(instance.name)}</span>
                    </TableCell>
                    <TableCell align="center">
                      <div className="rows">
                        {instance.cpurequests === 0 ? (
                          <span>SHARED</span>
                        ) : (
                          <span>
                            {`${formatK8SCpu(
                              instance.cpuusage
                            )} / ${formatK8SCpu(instance.cpurequests)}`}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell align="center">
                      <div className="rows">
                        <span>
                          {`${formatK8SMemory(
                            instance.memusage,
                            0
                          )} / ${formatK8SMemory(instance.memrequests, 0)}`}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell align="center">
                      <div className="rows">
                        <span>{instance.restarts}</span>
                      </div>
                    </TableCell>
                    <TableCell align="center">
                      <CommitSha release={instanceRelease} />
                    </TableCell>
                    <TableCell>{renderPodState(instance.state)}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={(evt) => {
                          setTargetInstance(instance);
                          open(evt);
                        }}
                      >
                        <MoreIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={10} />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      {serviceType === Block.Type.CATALOG && (
        <>
          <VerticalSpacer size={40} />
          <Typography color="textPrimary" variant="h6">
            Provision Storage
          </Typography>
          <VerticalSpacer size={16} />
          <TableContainer component={Paper} className="table-wrapper">
            <Table className="table" aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell className="condensed-col">
                    <Typography variant="overline">NAME</Typography>
                  </TableCell>
                  <TableCell className="condensed-col" align="center">
                    <Typography variant="overline">Disk Space</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(!metrics ||
                  Object.values(metrics.instances).length === 0) && (
                  <EmptyTableRow text="No storage" colSpan={5} />
                )}
                {metrics &&
                  Object.values(metrics.storages).map((storage) => {
                    return (
                      <TableRow key={storage.name} hover={true}>
                        <TableCell component="th" scope="row">
                          <span>{storage.name}</span>
                        </TableCell>
                        <TableCell align="center">
                          <div className="rows">
                            <span>
                              {`${formatDataUnit(
                                storage.mountedusageinbytes,
                                0
                              )}`}
                              {` / `}
                              {`${formatDataUnit(storage.capacityinbytes, 0)}`}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={10} />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </>
      )}

      {popover}
      <AlertDialog
        title="Restart Instance?"
        text={`${userFriendlyInstanceName(
          targetInstance?.name || ''
        )} will be restarted causing a brief interruption to the service instance.`}
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        confirmText="Confirm Restart"
        onConfirm={() => {
          restartInstance();
          setTargetInstance(null);
        }}
        onCancel={() => {
          setTargetInstance(null);
        }}
      />
    </StyledDiv>
  );
};

export default ServiceMetrics;
