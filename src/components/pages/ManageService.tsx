import 'types/proto.extend/block';

import ContentContainer from 'components/atoms/ContentContainer';
import OutlinedIconButton from 'components/atoms/OutlinedIconButton';
import SolidIconButton from 'components/atoms/SolidIconButton';
import { HorizontalSpacer, VerticalSpacer } from 'components/atoms/Spacer';
import { useServiceNavigate } from 'components/hooks/PathHook';
import {
  useAuthState,
  useReleasesState,
  useServicesState,
  useSidePanelState,
} from 'components/hooks/ReduxStateHook';
import { useCurrentReleaseState } from 'components/hooks/ReleaseHook';
import MetricSnippet from 'components/molecules/MetricSnippet';
import PromotedTooltip from 'components/molecules/PromotedTooltip';
import ScrollableTabs from 'components/molecules/ScrollableTabs';
import {
  useGRPCStream,
  useGRPCWrapper,
} from 'components/templates/GRPCWrapper';
import { PopoverAction, usePopover } from 'components/templates/PopoverHook';
import { replace } from 'connected-react-router';
import {
  SERVICE_TAB_ACCESS,
  SERVICE_TAB_ACTIVITY,
  SERVICE_TAB_CATALOG_ACCESS,
  SERVICE_TAB_CONSOLE,
  SERVICE_TAB_DOMAINS,
  SERVICE_TAB_JOB_ACTIVITY,
  SERVICE_TAB_METRICS,
  SERVICE_TAB_SETTINGS,
} from 'libraries/constants';
import {
  ReleaseStatusMap,
  rollbackRelease,
  watchReleaseStatus,
} from 'libraries/grpc/release';
import { editService, getService, watchMetrics } from 'libraries/grpc/service';
import {
  formatK8SCpu,
  formatK8SMemory,
  formatDataUnit,
} from 'libraries/helpers';
import { guardRunConfig } from 'libraries/helpers/editService';
import { getReleaseState } from 'libraries/helpers/release';
import {
  getFullRepository,
  getServiceOverallMetrics,
} from 'libraries/helpers/service';
import _get from 'lodash.get';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useRouteMatch } from 'react-router';
import ServiceRoutes from 'routes/ServiceRouter';
import {
  enqueueError,
  NotificationActionType,
  setLoading,
} from 'states/app/actions';
import { updateReleasesStatus } from 'states/releases/actions';
import {
  setBrowsingService,
  unsetBrowsingService,
  updateService,
} from 'states/service/actions';
import { updateMetrics } from 'states/services/actions';
import { showPanel } from 'states/sidePanel/actions';
import styled from 'styled-components';
import { bps } from 'theme';
import { Block, Status } from 'types/proto/models_pb';
import { ServiceType } from 'types/service';

import {
  AppBar,
  Grid,
  Hidden,
  IconButton,
  Typography,
} from '@material-ui/core';
import LabelImportantIcon from '@material-ui/icons/LabelImportant';
import MoreIcon from '@material-ui/icons/MoreHorizRounded';
import { useEnvironmentInfo } from '../hooks/EnvironmentHook';

const StyledDiv = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  .MuiAppBar-root {
    min-height: 154px;
    display: flex;
    justify-content: space-between;
  }
  .top,
  .tab-wrapper {
    padding: 22px 68px 0 68px;
    ${bps.down('sm')} {
      padding: 16px 0 0 16px;
    }
    box-sizing: border-box;
    display: flex;
    width: 100%;
  }

  .button-wrapper {
    display: flex;
    justify-content: flex-end;
    > * {
      margin-left: 16px;
    }
    ${bps.down('xs')} {
      display: none;
    }
  }
  .metric-snippet-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    ${bps.down('sm')} {
      display: none;
    }
  }

  .service-name {
    display: flex;
    align-items: center;
  }

  .promote-icon {
    margin-right: 5px;
    color: ${(props) => props.theme.palette.primary.main};
  }

  .service-name .promote-icon {
    font-size: 1.25rem; // TODO: this is a workaround because fontSize=small is being overwritten
  }
`;

type ServiceTab = {
  path: string;
  label: string;
  supportedTypes: ServiceType[];
  disableIfEmpty?: boolean;
};

/**
 * supportedTypes: empty means it is available for all types
 */
const SERVICE_TABS: ServiceTab[] = [
  {
    path: SERVICE_TAB_METRICS,
    label: 'Overview',
    supportedTypes: [
      // any type except static web as don't want to show overview
      // and we need to change the default route at ./routes/ServiceRouter as well
      Block.Type.WEB_APP,
      Block.Type.BACKEND_API,
      Block.Type.CATALOG,
      Block.Type.CRON_JOB,
      Block.Type.HELM,
      Block.Type.WORKER,
    ],
  },
  {
    path: SERVICE_TAB_ACTIVITY,
    label: 'Releases',
    supportedTypes: [],
  },
  {
    path: SERVICE_TAB_JOB_ACTIVITY,
    label: 'Job Activity',
    supportedTypes: [Block.Type.CRON_JOB, Block.Type.JOB],
  },
  {
    path: SERVICE_TAB_CONSOLE,
    label: 'Console',
    supportedTypes: [
      Block.Type.WEB_APP,
      Block.Type.BACKEND_API,
      Block.Type.CATALOG,
      Block.Type.CRON_JOB,
      Block.Type.HELM,
      Block.Type.WORKER,
    ],
    disableIfEmpty: true,
  },
  {
    path: SERVICE_TAB_ACCESS,
    label: 'Access',
    supportedTypes: [
      Block.Type.BACKEND_API,
      Block.Type.WEB_APP,
      Block.Type.STATIC_SITE,
      Block.Type.JAMSTACK,
    ],
    disableIfEmpty: true,
  },
  {
    path: SERVICE_TAB_CATALOG_ACCESS,
    label: 'Access',
    supportedTypes: [Block.Type.CATALOG],
    disableIfEmpty: true,
  },
  {
    path: SERVICE_TAB_DOMAINS,
    label: 'Domains',
    supportedTypes: [
      Block.Type.WEB_APP,
      Block.Type.STATIC_SITE,
      Block.Type.BACKEND_API,
      Block.Type.JAMSTACK,
    ],
    disableIfEmpty: true,
  },
  {
    path: SERVICE_TAB_SETTINGS,
    label: 'Settings',
    supportedTypes: [],
  },
];

const ServiceEdit = () => {
  const match = useRouteMatch();
  const location = useLocation();
  const serviceName = _get(match, 'params.serviceId', '');

  // Try to preset the selected tab from the path
  const pathName = location.pathname || '';
  const matchUrl = match.url || '';

  // remove the matchUrl (which is the parentUrl) and retrieve the relative path
  const subpath = pathName.replace(matchUrl, '').replace(/^\//, '');

  const dispatch = useDispatch();
  // we do not want to re-subscribe the event when the service change
  // (due to re-fetch when deployment updated)
  const [service, setService] = useState<Block | null>(null);
  const [initService, setInitService] = useState<Block | null>(null);
  const serviceRef = useRef<Block>();
  const grpcWrapper = useGRPCWrapper();

  // TODO: refactor these to one single ref?
  // create a stateful reference that store the release error
  // prevent the error popped twice
  const releaseErrorRef = useRef<{ [releaseId: string]: boolean }>();
  const panelRef = useRef<boolean>();

  const { envName } = useEnvironmentInfo();

  const { envId } = useAuthState();
  const { isActive } = useSidePanelState();
  const { metricsMap } = useServicesState();
  const { statusMap } = useReleasesState();

  const {
    navigateToServices,
    navigateToServiceReleaseLogPage,
  } = useServiceNavigate();

  const metrics = metricsMap[serviceName];

  const {
    hasLiveRelease,
    latestDeploymentRelease: release,
    latestRelease,
    isSuspended,
  } = useCurrentReleaseState(service);

  const {
    totalMemUsage,
    totalMemRequest,
    totalCpuUsage,
    totalCpuRequest,
    totalStorageUsage,
    totalStorageRequest,
  } = getServiceOverallMetrics(metrics);

  // use reference to hold the panel state
  useEffect(() => {
    panelRef.current = isActive;
  }, [isActive]);

  // TODO: Migrate the service to redux
  useEffect(() => {
    dispatch(setBrowsingService(serviceName));
    return () => {
      dispatch(unsetBrowsingService());
    };
  }, []);

  useEffect(() => {
    async function fetchBlock(showLoading: boolean) {
      if (showLoading) {
        dispatch(setLoading(true));
      }
      try {
        const s = await grpcWrapper(getService, { envId, serviceName });
        // the init service only set once
        if (initService === null) {
          setInitService(s);
        }
        setService(s);
        dispatch(updateService(s));
        serviceRef.current = s;
      } catch (error) {
        dispatch(enqueueError('service-manage', error.message));
        // cannot deserialize the state, probably refresh or paste the link directly
        navigateToServices();
      } finally {
        dispatch(setLoading(false));
      }
    }

    // only fetch/refetch for
    // 1. init
    // 2. switch to activity/xyz path (a chance that is a new deployment)
    if (initService === null || subpath.startsWith(SERVICE_TAB_ACTIVITY)) {
      // for activity page we fetch in background (i.e. shows no loading)
      fetchBlock(initService === null);
    }

    // trigger re-fetch when the url changes. this is for side panel update
  }, [subpath, initService, setInitService]);

  // Split to another useEffect to guarantee the service is fetch before we listen to release
  // not inside the same function to avoid memory leak if assign the stream as a variable and pass it to callback

  useGRPCStream(
    watchReleaseStatus,
    { blockName: serviceName, envId },
    {
      onData: (map) => {
        checkLatestDeploymentError(serviceRef.current, map);
        dispatch(updateReleasesStatus(serviceName, map));
      },
      onError: (code, message) => {
        // TODO: error handling?
        // error receiving real time data is not critical
        // we can still fallback to default status at the initial fetching
      },
    },
    [initService]
  );

  useGRPCStream(
    watchMetrics,
    { blockName: serviceName, envId },
    {
      onData: (m) => {
        dispatch(updateMetrics(serviceName, m));
      },
      onError: (code, message) => {
        // TODO: error handling?
        // error receiving real time data is not critical
        // we can still fallback to default status at the initial fetching
      },
    },
    [initService]
  );

  const serviceType = release?.getRunconfig()?.getType() || Block.Type.NOT_SET;
  const currentDeploymentReleaseState = getReleaseState(release!, statusMap);
  const latestReleaseState = getReleaseState(latestRelease!, statusMap);

  const serviceTabs = SERVICE_TABS.filter(
    (tab) =>
      tab.supportedTypes.length === 0 ||
      tab.supportedTypes.indexOf(serviceType) >= 0
  );

  // if the path is not existing, default to activity
  const tabFromPath = Math.max(
    serviceTabs.findIndex(({ path }) => subpath.startsWith(path)),
    0
  );

  const isTriggerButtonDisabled =
    !release ||
    !!service?.getParentblockname() ||
    currentDeploymentReleaseState === Status.State.RUNNING ||
    currentDeploymentReleaseState === Status.State.PENDING;

  const isResumeButtonDisabled =
    !release || latestReleaseState !== Status.State.SUCCESS;

  const poActions: PopoverAction[] = [
    {
      label: 'Edit Service',
      onClick: () => {
        openEditService();
      },
    },
  ];

  if (!isTriggerButtonDisabled) {
    poActions.push({
      label: 'Trigger Redeploy',
      onClick: () => {
        triggerRedeploy();
      },
    });
  }
  const [popover, open] = usePopover({
    actions: poActions,
  });

  const checkLatestDeploymentError = (
    s: Block | undefined,
    map: ReleaseStatusMap
  ) => {
    if (!s) {
      return;
    }
    const blockLatestRelease = s.getLatestRelease();
    // do not show the fixMe notification if the panel is active
    if (
      !s ||
      !blockLatestRelease ||
      !map[blockLatestRelease.getId()] ||
      panelRef.current
    ) {
      return;
    }

    // exit if the error is already shown
    if (
      releaseErrorRef.current &&
      releaseErrorRef.current[blockLatestRelease.getId()]
    ) {
      return;
    }

    const status = map[blockLatestRelease.getId()];

    const errorMessage = 'Issue Detected.';
    const actions = [];
    const actionType: NotificationActionType = 'CHECK_LOGS';
    if (status.getState() !== Status.State.FAIL) {
      return;
    }
    actions.push({
      label: 'Check Logs',
      type: actionType,
      data: {
        releaseId: blockLatestRelease.getId(),
        serviceName,
        serviceData: s.serializeBinary(),
      },
    });

    releaseErrorRef.current = {
      ...releaseErrorRef.current,
      [blockLatestRelease.getId()]: true,
    };

    dispatch(
      enqueueError(
        `service-release-error-${serviceName}`,
        new Error(`${serviceName} - ${errorMessage}`),
        {
          persist: true,
          actions,
        }
      )
    );
  };

  const resumeSuspendedService = async () => {
    dispatch(setLoading(true));
    try {
      const resp = await grpcWrapper(rollbackRelease, {
        envId: envId!,
        serviceName: service?.getName(),
        releaseId: release?.getId() || '',
      });
      navigateToServiceReleaseLogPage(
        service?.getName() || '',
        resp.getReleaseid()
      );
    } catch (error) {
      dispatch(enqueueError('abort-service', error));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const triggerRedeploy = async () => {
    dispatch(setLoading(true));
    try {
      const buildConfig = release?.getBuildconfig();
      const resp = await grpcWrapper(editService, {
        serviceName,
        envId: envId!,
        buildConfig,
        runConfig: guardRunConfig(serviceType, release?.getRunconfig()),
        releaseId: release?.getId(),
      });
      navigateToServiceReleaseLogPage(resp.getName(), resp.getReleaseid());
    } catch (error) {
      dispatch(enqueueError('manage-service-redeploy', error));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const openEditService = () => {
    if (release && service) {
      dispatch(
        showPanel({
          type: 'EDIT_RELEASE',
          release,
          service,
        })
      );
    }
  };

  if (service === null) {
    return <></>;
  }

  const isPromotedBlock = !!service?.getParentblockenvid();

  return (
    <StyledDiv>
      <AppBar color="inherit" position="static">
        {/* This is in reverse order */}
        <Grid container spacing={2} className="top" direction="row-reverse">
          <Hidden only="xs">
            <Grid item sm={6}>
              <div className="button-wrapper">
                {!isSuspended && serviceType !== Block.Type.CATALOG && (
                  <OutlinedIconButton
                    data-cy="manage-redeploy-button"
                    text="Trigger Deploy"
                    disabled={isTriggerButtonDisabled}
                    isLoading={
                      currentDeploymentReleaseState === Status.State.RUNNING
                    }
                    onClick={() => {
                      if (release) {
                        triggerRedeploy();
                      }
                    }}
                  />
                )}
                {isSuspended && (
                  <OutlinedIconButton
                    data-cy="manage-redeploy-button"
                    text="Resume"
                    disabled={isResumeButtonDisabled}
                    isLoading={latestReleaseState === Status.State.RUNNING}
                    onClick={() => {
                      if (release) {
                        if (serviceType === Block.Type.CATALOG) {
                          triggerRedeploy();
                        } else {
                          resumeSuspendedService();
                        }
                      }
                    }}
                  />
                )}
                <SolidIconButton
                  data-cy="manage-edit-service-button"
                  text="Edit Service"
                  disabled={!release}
                  onClick={() => {
                    openEditService();
                  }}
                />
              </div>
              <VerticalSpacer size={16} />
              <div className="metric-snippet-wrapper">
                <MetricSnippet
                  title="Memory"
                  current={formatK8SMemory(totalMemUsage, 0)}
                  max={formatK8SMemory(totalMemRequest, 0)}
                  percentage={totalMemUsage / totalMemRequest}
                />
                <HorizontalSpacer size={16} />
                <MetricSnippet
                  title="CPU"
                  current={formatK8SCpu(totalCpuUsage)}
                  max={formatK8SCpu(totalCpuRequest)}
                  percentage={totalCpuUsage / totalCpuRequest}
                />
                {serviceType === Block.Type.CATALOG && (
                  <>
                    <HorizontalSpacer size={16} />
                    <MetricSnippet
                      title="Storage"
                      current={formatDataUnit(totalStorageUsage, 0)}
                      max={formatDataUnit(totalStorageRequest, 0)}
                      percentage={totalStorageUsage / totalStorageRequest}
                    />
                  </>
                )}
              </div>
            </Grid>
          </Hidden>
          <Hidden smUp>
            <Grid item xs={2}>
              <IconButton onClick={open}>
                <MoreIcon />
              </IconButton>
            </Grid>
          </Hidden>
          {/* Left title bar */}
          <Grid item xs={10} sm={6}>
            <Typography
              color="textPrimary"
              variant="overline"
            >{`${envName}`}</Typography>
            <Typography
              color="textPrimary"
              variant="h6"
              className="service-name"
            >
              {isPromotedBlock && (
                <PromotedTooltip service={service}>
                  <LabelImportantIcon
                    className="promote-icon"
                    fontSize="small"
                  />
                </PromotedTooltip>
              )}
              {service.getName()}
            </Typography>
            <a
              href={`${getFullRepository(release!)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Typography variant="caption">
                {getFullRepository(release!)}
              </Typography>
            </a>
          </Grid>
        </Grid>
        <div className="tab-wrapper">
          <ScrollableTabs
            tab={tabFromPath}
            setTab={(newTab) => {
              // push the route
              if (newTab < serviceTabs.length) {
                dispatch(replace(`${match.url}/${serviceTabs[newTab].path}`));
              }
            }}
            tabs={serviceTabs.map((t) => ({
              ...t,
              disabled: t.disableIfEmpty ? !hasLiveRelease : false,
            }))}
          />
        </div>
      </AppBar>
      <ContentContainer>
        {service && <ServiceRoutes service={service} />}
      </ContentContainer>
      {popover}
    </StyledDiv>
  );
};
export default ServiceEdit;
