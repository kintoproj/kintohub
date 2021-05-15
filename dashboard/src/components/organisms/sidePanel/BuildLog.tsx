/* eslint-disable react/no-danger */
import SolidIconButton from 'components/atoms/SolidIconButton';
import StatusIcon from 'components/atoms/StatusIcon';
import { useAppState, useAuthState } from 'components/hooks/ReduxStateHook';
import CopyClipboardButton from 'components/molecules/CopyClipboardButton';
import SidePanelTitleBar from 'components/molecules/SidePanelTitleBar';
import {
  useGRPCStream,
  useGRPCWrapper,
} from 'components/templates/GRPCWrapper';
import { CatalogTypes } from 'libraries/constants';
import { abortRelease, watchBuildLogs } from 'libraries/grpc/release';
import { getSchemaByName, getTemplatedValue } from 'libraries/helpers/catalog';
import {
  toHumanReadableSeconds,
  toTimeElapsedShortened,
} from 'libraries/helpers/date';
import {
  getColorByReleaseState,
  getReleaseState,
  getReleaseStateTypeName,
} from 'libraries/helpers/release';
import { LazyLog } from 'libraries/vendor/lazy-log/components';
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useReducer, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { enqueueError } from 'states/app/actions';
import { ReleasesState } from 'states/releases/types';
import { doHidePanel, showPanel } from 'states/sidePanel/actions';
import { RootState } from 'states/types';
import styled from 'styled-components';
import { bps } from 'theme';
import { KINTO_LIGHT_PURPLE } from 'theme/colors';
import { AccessTemplate } from 'types/catalog';
import { Block, Release, Status } from 'types/proto/models_pb';
import { ReleaseStateType } from 'types/release';
import { Button } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import BuildIcon from '@material-ui/icons/BuildRounded';
import LinkIcon from '@material-ui/icons/LinkRounded';
import { useCurrentReleaseState } from 'components/hooks/ReleaseHook';
import { useBuffer } from 'components/hooks/BufferHook';
import { ErrorThemeProvider } from 'components/molecules/ErrorThemeProvider';

const GET_HELP_LINK =
  'kinto::html::Need Help? <a href="https://github.com/kintoproj/kinto-core/issues" target="_blank">Check our issues page on Github! </a>';

const Container = styled.div`
  height: 100%;
  width: 75vw;
  ${bps.down('sm')} {
    width: 100vw;
  }
  display: flex;
  flex-direction: column;
  .log-container {
    height: 100%;
  }
  span {
    a {
      color: ${KINTO_LIGHT_PURPLE};
    }
  }
  .titleBar {
    display: flex;
    flex-direction: row;
    justify-items: center;
    align-items: center;
    > *:nth-child(1) {
      margin-left: 24px;
    }
    > *:nth-child(n + 2) {
      margin-left: 8px;
    }
  }

  .fix-button {
    top: -20px;
    position: absolute;
  }
`;

export interface Props {
  release: Release;
  service: Block;
}

export interface LogRef {
  onLogUpdated: Function;
}

const info = (message: string): string => `[32m[1m${message}[0m`;
const error = (message: string): string => `[31m[1m${message}[0m`;

type Action =
  | { type: 'APPEND_LOG'; log: string }
  | { type: 'APPEND_INFO'; log: string }
  | { type: 'FINISH' };

type LocalState = {
  isFinished: boolean;
  logs: string;
  hints: string;
};

// local reducer for the release map
const reducer = (state: LocalState, action: Action) => {
  switch (action.type) {
    case 'APPEND_LOG':
      return {
        ...state,
        logs: `${state.logs}${action.log}`,
      };
    case 'APPEND_INFO':
      return {
        ...state,
        hints: `${state.hints}${action.log}`,
      };
    case 'FINISH':
      return {
        ...state,
        isFinished: true,
      };
  }
  return state;
};

export default ({ release, service }: Props) => {
  const { envId } = useAuthState();
  const { serverTimeOffset } = useAppState();

  const { statusMap } = useSelector<RootState, ReleasesState>(
    (state: RootState) => state.releases
  );

  const ref = useRef<ReleaseStateType>(Status.State.NOT_SET);

  const grpcWrapper = useGRPCWrapper();

  const [{ logs, isFinished, hints }, localDispatch] = useReducer(reducer, {
    isFinished: false,
    logs: '',
    hints: '',
  });

  const pushBuffer = useBuffer<string>((data) => {
    // the incoming data already contains line breaks
    localDispatch({
      type: 'APPEND_LOG',
      log: data.join(''),
    });
  });

  const { liveRelease } = useCurrentReleaseState(service);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const abortCurrentRelease = async () => {
    if (isSubmitting) {
      return;
    }

    if (releaseState !== Status.State.RUNNING) {
      return;
    }

    setIsSubmitting(true);
    try {
      await grpcWrapper(abortRelease, {
        envId: envId!,
        blockName: service.getName(),
        releaseId: release?.getId()!,
      });
      dispatch(doHidePanel());
    } catch (err) {
      dispatch(enqueueError('abort-service', err));
      dispatch(setIsSubmitting(false));
    }
  };

  const dispatchEndingLogs = () => {
    // determine the release status and send out different kind of logs

    // TODO: handle service type rather than backendAPI
    const releaseState = getReleaseState(release, statusMap);
    if (releaseState === Status.State.SUCCESS) {
      if (release.getId() === liveRelease?.getId()) {
        const blockType = release.getRunconfig()?.getType();
        const isPublicService = service.getIspublicurl();

        if (
          blockType === Block.Type.BACKEND_API ||
          blockType === Block.Type.WEB_APP
        ) {
          localDispatch({
            type: 'APPEND_INFO',
            log:
              '\n\n' +
              `${info('✅ Deployment successful.\n\n')}` +
              `${
                isPublicService
                  ? `kinto::html::🔗 Public API access via <a href="https://${release
                      .getRunconfig()
                      ?.getHost()}" target="_blank">https://${release
                      .getRunconfig()
                      ?.getHost()}</a>\n\n`
                  : `kinto::html::🔗 Private API access via <a href="http://${service.getName()}" onclick="return false;">http://${service.getName()}</a>\n\n`
              }` +
              `${GET_HELP_LINK}\n\n\n`,
          });
        } else if (blockType === Block.Type.JAMSTACK) {
          localDispatch({
            type: 'APPEND_INFO',
            log:
              '\n\n' +
              `${info('✅ Deployment successful.\n\n')}` +
              `kinto::html::🔗 Public API access via <a href="https://${release
                .getRunconfig()
                ?.getHost()}" target="_blank">https://${release
                .getRunconfig()
                ?.getHost()}</a>\n\n` +
              `${GET_HELP_LINK}\n\n\n`,
          });
        } else if (blockType === Block.Type.CATALOG) {
          localDispatch({
            type: 'APPEND_INFO',
            log:
              '\n' +
              `${info('✅ Deployment successful.\n\n')}` +
              '\n\n' +
              'kinto::catalogaccess::\n\n' +
              `${GET_HELP_LINK}\n\n\n`,
          });
        } else {
          localDispatch({
            type: 'APPEND_INFO',
            log:
              '\n' +
              `${info('✅ Deployment successful.\n\n')}` +
              `\n\n${GET_HELP_LINK}\n\n\n`,
          });
        }
      } else {
        localDispatch({
          type: 'APPEND_INFO',
          log:
            '\n\n' +
            `${info('✅ Deployment was successful.\n\n')}` +
            'kinto::outdated::\n\n' +
            `${GET_HELP_LINK}\n\n\n`,
        });
      }
    } else if (releaseState === Status.State.FAIL) {
      // Do not append the hint on FE. they are all handled on BE now
      localDispatch({
        type: 'APPEND_INFO',
        log: `\n${GET_HELP_LINK}\n\n\n`,
      });
    } else {
      // should not happen
      localDispatch({
        type: 'APPEND_INFO',
        log: info('All logs loaded.\n'),
      });
    }
  };

  const dispatch = useDispatch();
  const [loadingIndicator, setLoadingIndicator] = useState('.');
  const [follow, setFollow] = useState(true);

  const releaseState = getReleaseState(release, statusMap);

  let loadingText = info(`fetching latest logs ${loadingIndicator}\n`);
  let logsPrefix = '';

  if (
    releaseState === Status.State.RUNNING ||
    releaseState === Status.State.PENDING
  ) {
    loadingText =
      logs === ''
        ? info(
            `Allocating resources. This may take a few seconds${loadingIndicator}\n`
          )
        : info(`Deploying ${loadingIndicator}\n`);
    logsPrefix = 'kinto::init::\n\n';
  }

  useEffect(() => {
    const int = setInterval(() => {
      const size = (new Date().valueOf() / 1000) % 4;
      setLoadingIndicator('.'.repeat(size));
    }, 1000);
    return () => {
      clearInterval(int);
    };
  }, []);

  // we want to align the timestamp -> right now k8s has timestamp but archived not
  // so to align we need to hide the timestamp from k8s log
  const filterK8sTimestamp = (log: string): string => {
    return log.replace(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d+Z\s/, '');
  };

  // since the stream will still continue when the deployment finished,
  // we need to manually stop it
  useEffect(() => {
    const prevState = ref.current;
    if (releaseState !== prevState && prevState === Status.State.RUNNING) {
      if (
        releaseState === Status.State.FAIL ||
        releaseState === Status.State.SUCCESS
      ) {
        localDispatch({
          type: 'FINISH',
        });
        dispatchEndingLogs();
        // do not cancel the stream as the logs do not end yet
      }
    }
    ref.current = releaseState;
  }, [releaseState]);

  useGRPCStream(
    watchBuildLogs,
    {
      releaseId: release.getId(),
      blockName: service.getName(),
      envId,
    },
    {
      onData: (message) => {
        pushBuffer(message);
      },
      onEnd: () => {
        localDispatch({
          type: 'FINISH',
        });
        dispatchEndingLogs();
      },
      onError: (code, message) => {
        localDispatch({
          type: 'FINISH',
        });
        if (code === 0) {
          dispatchEndingLogs();
        } else {
          localDispatch({
            type: 'APPEND_LOG',
            log: error(`Unexpected error when fetching the logs: ${message}\n`),
          });
        }
      },
    }
  );

  const shouldShowDuration =
    releaseState === Status.State.ABORTED ||
    releaseState === Status.State.FAIL ||
    releaseState === Status.State.SUCCESS;

  const durationInSeconds =
    (release.getEndedat()?.getSeconds() || 0) -
    (release.getStartedat()?.getSeconds() || 0);

  // TODO: refactor this part if we receive startedAt/endedAt update from watchReleaseStatus call
  const [timeElapsed, setTimeElapsed] = useState<string>();
  const intervalRef = useRef<number | null>(null);
  useEffect(() => {
    if (releaseState === Status.State.RUNNING) {
      setTimeElapsed(
        toTimeElapsedShortened(release.getCreatedat(), serverTimeOffset)
      );

      intervalRef.current = setInterval(() => {
        setTimeElapsed(
          toTimeElapsedShortened(release.getCreatedat(), serverTimeOffset)
        );
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [releaseState]);

  return (
    <Container>
      <SidePanelTitleBar
        titleComponent={
          <div className="titleBar">
            <StatusIcon
              color={getColorByReleaseState(releaseState)}
              animated={releaseState === Status.State.RUNNING}
            />
            <Typography variant="h5">
              {`${getReleaseStateTypeName(releaseState)}`}
            </Typography>
            {releaseState === Status.State.RUNNING && (
              <Typography variant="body2">{timeElapsed || ''}</Typography>
            )}
            {shouldShowDuration && (
              <Typography variant="body2">
                {durationInSeconds > 0
                  ? toHumanReadableSeconds(durationInSeconds)
                  : timeElapsed || ''}
              </Typography>
            )}
          </div>
        }
        buttonComponent={
          releaseState === Status.State.PENDING ||
          releaseState === Status.State.RUNNING ? (
            <ErrorThemeProvider>
              <SolidIconButton
                data-cy="side-panel-abort-button"
                text="Abort"
                variant="outlined"
                color="primary"
                disabled={isSubmitting}
                onClick={() => {
                  abortCurrentRelease();
                }}
              />
            </ErrorThemeProvider>
          ) : (
            <SolidIconButton
              data-cy="side-panel-edit-button"
              text="Edit"
              color="primary"
              onClick={() => {
                dispatch(doHidePanel());
                setTimeout(() => {
                  dispatch(
                    showPanel({
                      type: 'EDIT_RELEASE',
                      release,
                      service,
                    })
                  );
                }, 300);
              }}
            />
          )
        }
      />
      <div className="log-container">
        <LazyLog
          follow={follow}
          text={`${logsPrefix}${logs}${hints}`}
          extraLines={1}
          selectableLines={true}
          loadingText={isFinished ? '' : loadingText}
          onScroll={({ scrollTop, scrollHeight, clientHeight }) => {
            if (scrollHeight - clientHeight - scrollTop > 200) {
              setFollow(false);
            }
          }}
          formatPart={(text: string) => {
            // TODO: add a regex checking or even a proper template engine for this
            // now it is a little bit hacky
            if (text.startsWith('kinto::html::')) {
              return (
                <span
                  dangerouslySetInnerHTML={{
                    __html: text.replace('kinto::html::', ''),
                  }}
                />
              );
            }
            if (text.indexOf('kinto::portfixme::') >= 0) {
              return (
                <Button
                  className="fix-button"
                  variant="contained"
                  color="default"
                  startIcon={<BuildIcon />}
                  onClick={(evt) => {
                    evt.preventDefault();
                    evt.stopPropagation();
                    dispatch(doHidePanel());
                    setTimeout(() => {
                      dispatch(
                        showPanel({
                          type: 'EDIT_RELEASE',
                          release,
                          service,
                          fieldErrors: {
                            port: 'Please verify the port is set correctly',
                          },
                        })
                      );
                    }, 300);
                  }}
                >
                  Click to Fix Issue
                </Button>
              );
            }
            if (text.indexOf('kinto::oomfixme::') >= 0) {
              return (
                <span>
                  <Button
                    className="fix-button"
                    variant="contained"
                    color="default"
                    startIcon={<BuildIcon />}
                    onClick={(evt) => {
                      evt.preventDefault();
                      evt.stopPropagation();
                      dispatch(doHidePanel());
                      setTimeout(() => {
                        dispatch(
                          showPanel({
                            type: 'EDIT_RELEASE',
                            release,
                            service,
                            fieldErrors: {
                              memoryIndex: 'Please increase the memory limit',
                            },
                          })
                        );
                      }, 300);
                    }}
                  >
                    Click to Fix Issue
                  </Button>
                </span>
              );
            }
            if (text.indexOf('kinto::catalogaccess::') >= 0) {
              const catalogName = service.getName() || '';
              const schema = getSchemaByName(catalogName as CatalogTypes);
              const envVars = release?.getRunconfig()?.getEnvvarsMap();
              const connectionStringField = schema?.access.find(
                (f) => f.type === 'template' && f.isConnectionString
              ) as AccessTemplate;

              const { value, displayValue } = getTemplatedValue(
                connectionStringField?.template,
                envVars,
                schema
              );

              return (
                <span className="fix-button">
                  <CopyClipboardButton
                    data-cy="copy-connection-string-button"
                    label="Copy Connection String"
                    value={value}
                    displayValue={displayValue}
                    startIcon={<LinkIcon />}
                    variant="contained"
                    color="default"
                  />
                </span>
              );
            }
            if (text.indexOf('kinto::checklogs::') >= 0) {
              return (
                <span>
                  <span role="img" aria-label="cross">
                    ❌
                  </span>
                  Deployment Failed. Please check the logs above.
                </span>
              );
            }
            if (text.indexOf('kinto::init::') >= 0) {
              return <span>Deployment added to queue.</span>;
            }
            if (text.indexOf('kinto::outdated::') >= 0) {
              return (
                <span>
                  {'A newer release is live. Go to '}
                  <a
                    href="#"
                    onClick={(evt) => {
                      evt.preventDefault();
                      evt.stopPropagation();
                      dispatch(doHidePanel());
                      // hacky but we don't have any callback on panel-hidden
                      setTimeout(() => {
                        if (liveRelease) {
                          dispatch(
                            showPanel({
                              type: 'VIEW_LOGS',
                              release: liveRelease,
                              service,
                            })
                          );
                        }
                      }, 300);
                    }}
                  >
                    latest release
                  </a>
                </span>
              );
            }
            return <span>{filterK8sTimestamp(text)}</span>;
          }}
        />
      </div>
    </Container>
  );
};
