import 'types/proto.extend/block';

import { useServiceNavigate } from 'components/hooks/PathHook';
import { useCurrentReleaseState } from 'components/hooks/ReleaseHook';
import { useGRPCStream } from 'components/templates/GRPCWrapper';
import { watchJobStatus } from 'libraries/grpc/service';
import {
  getJobStateIcon,
  getJobStateTypeName,
} from 'libraries/helpers/release';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { enqueueError } from 'states/app/actions';
import { updateJobStatus } from 'states/service/actions';
import styled from 'styled-components';
import { Block } from 'types/proto/models_pb';
import { JobStatus } from 'types/service';

import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import RightIcon from '@material-ui/icons/ChevronRightRounded';
import { useAuthState, useServiceState } from 'components/hooks/ReduxStateHook';

type Props = {
  service: Block;
};

interface StyledComponentProps {
  component: any;
}

type JobHistoryData = {
  name: string;
} & JobStatus;

const StyledDiv = styled.div`
  .MuiCard-root {
    margin-top: 16px;
    padding: 40px;
    input {
      min-width: 400px;
    }
  }
  .MuiTableHead-root,
  .MuiTableFooter-root {
    background-color: ${(props) => props.theme.palette.grey[50]};
  }
  tbody > tr {
    cursor: pointer;
  }
  .status-wrapper {
    align-items: center;
    display: flex;
    svg {
      color: ${(props) => props.theme.palette.text.secondary};
      margin-right: 16px;
    }
  }
  .time-text {
    color: ${(props) => props.theme.palette.text.hint};
  }
`;

const ServiceJobActivity = ({ service }: Props) => {
  const { envId } = useAuthState();
  const { navigateToServiceConsoleLogPage } = useServiceNavigate();
  const { jobStatusMap } = useServiceState();

  const { latestDeploymentRelease: release } = useCurrentReleaseState(service);
  const dispatch = useDispatch();
  const { navigateToServiceOverviewPage } = useServiceNavigate();

  useGRPCStream(
    watchJobStatus,
    {
      blockName: service.getName(),
      envId: envId!,
    },
    {
      onData: (message) => {
        dispatch(updateJobStatus(message));
      },
      onError: (code, message) => {
        dispatch(enqueueError('job-status', new Error(message)));
      },
    }
  );

  useEffect(() => {
    const serviceType = release?.getRunconfig()?.getType() || 0;
    if (serviceType !== Block.Type.CRON_JOB && serviceType !== Block.Type.JOB) {
      navigateToServiceOverviewPage(service.getName());
    }

    // start to listen to
  }, []);
  let jobHistories: JobHistoryData[] = [];
  Object.keys(jobStatusMap).forEach((instanceName) => {
    jobHistories.push({
      name: instanceName,
      ...jobStatusMap[instanceName],
    });
  });
  jobHistories = jobHistories.sort(
    (h1, h2) => (h2.startTime?.valueOf() || 0) - (h1.startTime?.valueOf() || 0)
  );
  return (
    <StyledDiv>
      <TableContainer component={Paper}>
        <Table className="table" aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className="condensed-col">
                <Typography variant="overline">STATUS</Typography>
              </TableCell>
              <TableCell className="condensed-col" align="left">
                <Typography variant="overline">START TIME</Typography>
              </TableCell>
              <TableCell align="left">
                <Typography variant="overline">FINISH TIME</Typography>
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {jobHistories.map((history) => {
              const Icon = getJobStateIcon(history.state);
              return (
                <TableRow
                  key={history.name}
                  hover={true}
                  onClick={() => {
                    navigateToServiceConsoleLogPage(
                      service.getName(),
                      history.name
                    );
                  }}
                >
                  <TableCell>
                    <div className="status-wrapper">
                      <Icon />
                      <Typography variant="body2" className="vertical-center">
                        {getJobStateTypeName(history.state)}
                      </Typography>
                    </div>
                  </TableCell>
                  <TableCell align="left" className="time-text">
                    <Typography variant="body2">
                      {history.startTime?.format('MMM D, YYYY') || ''}
                    </Typography>
                    <Typography variant="body2">
                      {history.startTime?.format('h:mm:ss A') || ''}
                    </Typography>
                  </TableCell>
                  <TableCell align="left" className="time-text">
                    <Typography variant="body2">
                      {history.endTime?.format('MMM D, YYYY') || ''}
                    </Typography>
                    <Typography variant="body2">
                      {history.endTime?.format('h:mm:ss A') || ''}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={(evt) => {
                        evt.stopPropagation();
                        evt.preventDefault();
                        navigateToServiceConsoleLogPage(
                          service.getName(),
                          history.name
                        );
                      }}
                    >
                      <RightIcon />
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
    </StyledDiv>
  );
};

export default ServiceJobActivity;
