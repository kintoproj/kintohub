import { VerticalSpacer } from 'components/atoms/Spacer';
import { useGRPCStream } from 'components/templates/GRPCWrapper';
import { replace } from 'connected-react-router';
import { SERVICE_TAB_CONSOLE } from 'libraries/constants';
import { ConsoleLogMessage, watchConsoleLogs } from 'libraries/grpc/service';
import { userFriendlyInstanceName } from 'libraries/helpers';
import { LazyLog } from 'libraries/vendor/lazy-log/components';
import moment from 'moment';
import React, { useEffect, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { AuthState } from 'states/auth/types';
import { ServicesState } from 'states/services/types';
import { RootState } from 'states/types';
import styled from 'styled-components';
import { Block } from 'types/proto/models_pb';
import { useCurrentReleaseState } from 'components/hooks/ReleaseHook';
import OutlinedSelect from 'components/atoms/OutlinedSelect';
import CopyToClipboard from 'react-copy-to-clipboard';
import OutlinedIconButton from 'components/atoms/OutlinedIconButton';
import stripAnsi from 'strip-ansi';
import { ClickAwayListener, Tooltip } from '@material-ui/core';
import { bps } from 'theme';
import { useBuffer } from 'components/hooks/BufferHook';

const StyledDiv = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  .log-container {
    height: 100%;
  }
  .copy-log-button {
    display: inline-block;
    padding: 0px 16px;
    ${bps.down('xs')} {
      display: block;
      padding: 8px 0px;
    }
  }

  a {
    color: #666666 !important;
  }
  .log-wrapper {
    height: calc(100% - 32px);
  }
  .MuiOutlinedInput-input {
    padding: 8px 8px;
  }
  .MuiFormLabel-root {
    background-color: ${(props) => props.theme.palette.background.default};
  }
`;

export interface Props {
  service: Block;
  defaultInstanceName?: string;
}

const info = (message: string): string => `[32m[1m${message}[0m\n`;
const datetime = (message: string): string => `[36m[1m${message}[0m`;
const instanceName = (message: string): string => `[33m[1m${message}[0m`;
const error = (message: string): string => `[31m[1m${message}[0m\n`;

type Action =
  | { type: 'APPEND_LOG'; logs: ConsoleLogMessage[] }
  | { type: 'FINISH' };

type LocalState = {
  isFinished: boolean;
  logs: ConsoleLogMessage[];
};

// local reducer for the release map
const reducer = (state: LocalState, action: Action) => {
  switch (action.type) {
    case 'APPEND_LOG':
      return {
        ...state,
        logs: [...state.logs, ...action.logs],
      };
    case 'FINISH':
      return {
        ...state,
        isFinished: true,
      };
  }
  return state;
};

export default ({
  service,
  defaultInstanceName,
  match,
}: Props & Pick<RouteComponentProps, 'match'>) => {
  const { envId } = useSelector<RootState, AuthState>(
    (state: RootState) => state.auth
  );

  const pushBuffer = useBuffer<ConsoleLogMessage>((data) => {
    localDispatch({
      type: 'APPEND_LOG',
      logs: data,
    });
  });

  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const [{ logs }, localDispatch] = useReducer(reducer, {
    isFinished: false,
    logs: [],
  });

  const { metricsMap } = useSelector<RootState, ServicesState>(
    (state: RootState) => state.services
  );

  const [selectedInstance, setSelectedInstance] = useState(
    defaultInstanceName || 'all'
  );
  const instances = metricsMap[service.getName()]?.instances || {};

  const instanceOptions = [
    {
      label: 'All Instances',
      value: 'all',
    },
    ...Object.keys(instances).map((ins) => ({
      label: userFriendlyInstanceName(ins),
      value: ins,
    })),
  ];

  const [loadingIndicator, setLoadingIndicator] = useState('.');
  const [follow, setFollow] = useState(true);

  const { hasLiveRelease } = useCurrentReleaseState(service);
  const loadingText = hasLiveRelease
    ? info(`listening to console logs ${loadingIndicator}`)
    : info(
        `No console logs yet. Waiting for first successful deployment ${loadingIndicator}`
      );
  useEffect(() => {
    const int = setInterval(() => {
      const size = (new Date().valueOf() / 1000) % 4;
      setLoadingIndicator('.'.repeat(size));
    }, 1000);
    return () => {
      clearInterval(int);
    };
  }, []);

  const processLog = (instanceId: string, s: string) =>
    wordWrap(colorTimestamp(instanceId, s));

  const colorTimestamp = (instanceId: string, s: string) =>
    s.replace(
      /^(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(?:\.\d+)?Z?)/,
      (str) =>
        `${datetime(
          moment(str).format('hh:mm:ss A')
        )}  ${userFriendlyInstanceName(instanceName(instanceId))} `
    );

  const wordWrap = (s: string) =>
    s.replace(/(?![^\n]{1,100}$)([^\n]{1,100})[\s,]/g, '$1\n\t');

  useGRPCStream(
    watchConsoleLogs,
    {
      blockName: service.getName(),
      envId,
    },
    {
      onData: (message) => {
        // use a global buffer to cache all the logs
        // otherwise if there is too many dispatch -> too many re-renders
        pushBuffer(message);
      },
      onError: (code, message) => {
        const log: ConsoleLogMessage = {
          instanceName: 'all',
          message: '',
        };
        localDispatch({
          type: 'FINISH',
        });
        if (code === 0) {
          log.message = info('All logs loaded.');
          localDispatch({
            type: 'APPEND_LOG',
            logs: [log],
          });
        } else {
          log.message = error(
            `Unexpected error when fetching the logs: ${message}`
          );
          localDispatch({
            type: 'APPEND_LOG',
            logs: [log],
          });
        }
      },
    }
  );

  // memorize the value to avoid expensive calculation per re-render
  // should only update the logs when the selectedInstance change/ new logs arrive
  const formattedLogs = React.useMemo(
    () =>
      logs
        .filter(
          (log) =>
            selectedInstance === 'all' || log.instanceName === selectedInstance
        )
        .map((log) => processLog(log.instanceName, log.message))
        .join('\n'),
    [logs, selectedInstance]
  );

  return (
    <StyledDiv>
      <div className="log-container">
        <OutlinedSelect
          label="Instance"
          onChange={(evt) => {
            if (evt.target.value) {
              setSelectedInstance(`${evt.target.value}`);
              dispatch(
                replace(
                  `${match.url}/${SERVICE_TAB_CONSOLE}/instance/${evt.target.value}`
                )
              );
            }
          }}
          value={selectedInstance}
          options={instanceOptions.map((opt) => ({
            label: opt.label,
            value: opt.value,
          }))}
          fullWidth={false}
          autoWidth={true}
        />
        <ClickAwayListener onClickAway={() => setOpen(false)}>
          <div className="copy-log-button">
            <Tooltip
              onClose={() => setOpen(false)}
              open={open}
              disableFocusListener
              disableHoverListener
              disableTouchListener
              title="Logs copied to clipboard"
            >
              <CopyToClipboard
                text={stripAnsi(formattedLogs)}
                onCopy={() => setOpen(true)}
              >
                <OutlinedIconButton text="Copy logs" />
              </CopyToClipboard>
            </Tooltip>
          </div>
        </ClickAwayListener>
        <VerticalSpacer size={16} />
        <div className="log-wrapper">
          <LazyLog
            enableSearch={true}
            follow={follow}
            text={`\n${formattedLogs}`}
            extraLines={1}
            selectableLines={true}
            lineClassName="line"
            loadingText={loadingText}
            onError={() => {}}
            onScroll={({ scrollTop, scrollHeight, clientHeight }) => {
              if (scrollHeight - clientHeight - scrollTop > 200) {
                setFollow(false);
              }
            }}
          />
          ;
        </div>
      </div>
    </StyledDiv>
  );
};
