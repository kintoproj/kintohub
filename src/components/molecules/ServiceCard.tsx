import { HorizontalSpacer } from 'components/atoms/Spacer';
import StatusText from 'components/atoms/StatusText';
import { useServiceNavigate } from 'components/hooks/PathHook';
import { useAppState } from 'components/hooks/ReduxStateHook';
import { useCurrentReleaseState } from 'components/hooks/ReleaseHook';
import PromotedTooltip from 'components/molecules/PromotedTooltip';
import { toTimeElapsed } from 'libraries/helpers/date';
import { getTagFromPromotedRelease } from 'libraries/helpers/release';
import {
  getLanguageNameByType, getServiceIcon, getServiceTypeName, isPromotedService
} from 'libraries/helpers/service';
import React from 'react';
import { useDispatch } from 'react-redux';
import { showPanel } from 'states/sidePanel/actions';
import styled from 'styled-components';
import { Block, BlockInstance, BlockStatus } from 'types/proto/kkc_models_pb';
import { PodStateType, ServiceStateType } from 'types/service';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import LabelImportantIcon from '@material-ui/icons/LabelImportant';
import MoreIcon from '@material-ui/icons/MoreHorizRounded';

type Props = {
  service: Block;
  serviceState: ServiceStateType;
  onMenuClicked: (evt: any) => void;
};

const StyledCard = styled(Card)`
  display: flex;
  width: 100%;
  justify-content: space-between;
  .row {
    padding: 22px 0 22px 26px;
    display: flex;

    > .MuiGrid-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }

  .title-row {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .title-column {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .div-button {
    svg {
      padding: 15px;
      border-radius: 30px;
    }

    :focus {
      outline: none;
    }
  }
  .div-button :hover {
    background-color: ${(props) => props.theme.palette.action.hover};
  }

  .buttons {
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-right: 0;
    .MuiIconButton-root {
      padding: 4px;
      height: 50px;
      width: 50px;
    }
  }

  .wrap-icon {
    display: flex;
    align-items: center;
  }

  .promote-icon {
    margin-right: 5px;
    color: ${(props) => props.theme.palette.primary.main};
  }

  .title-row .promote-icon {
    font-size: 1.25rem; // this is a workaround because fontSize=small is being overwritten
  }
`;

export const renderServiceState = (
  serviceState: ServiceStateType,
  isSuspended: boolean,
  isPendingConfig: boolean
) => {
  if (isSuspended) {
    return <StatusText status="disabled" text="Suspended" />;
  }
  if (isPendingConfig) {
    return <StatusText status="disabled" text="Needs Config" />;
  }
  switch (serviceState) {
    case BlockStatus.State.HEALTHY:
      return <StatusText status="success" text="Healthy" />;
    case BlockStatus.State.UNHEALTHY:
    case BlockStatus.State.SUSPENDED:
      return <StatusText status="error" text="Unhealthy" />;
    case BlockStatus.State.SLEEPING:
      return <StatusText status="sleeping" text="Sleeping" />;
  }
  return <StatusText status="error" text="Unhealthy" />;
};

export const renderPodState = (serviceState: PodStateType) => {
  switch (serviceState) {
    case BlockInstance.State.COMPLETED:
      return <StatusText status="info" text="Completed" />;
    case BlockInstance.State.RUNNING:
      return <StatusText status="success" text="Healthy" />;
    case BlockInstance.State.ERROR:
    case BlockInstance.State.OOM_KILLED:
    case BlockInstance.State.NOT_SET:
      return <StatusText status="error" text="Unhealthy" />;
  }
  return <StatusText status="error" text="Unhealthy" />;
};

export default ({ service, serviceState, onMenuClicked }: Props) => {
  const {
    latestDeploymentRelease: release,
    isSuspended,
    isPendingConfig,
    hasLiveRelease,
  } = useCurrentReleaseState(service);

  const buildConfig = release?.getBuildconfig();
  const { serverTimeOffset } = useAppState();
  const { navigateToServiceOverviewPage } = useServiceNavigate();

  const dispatch = useDispatch();
  const TypeIcon = getServiceIcon(release?.getRunconfig()?.getType() || 0);
  // TODO: default to unhealthy

  const onMenuButtonClicked = (evt: any) => {
    evt.preventDefault();
    evt.stopPropagation();
    onMenuClicked(evt);
  };

  const cancelPropagation = (evt: any) => {
    evt.preventDefault();
    evt.stopPropagation();
  };

  return (
    <StyledCard
      onClick={() => {
        if (isPendingConfig && !hasLiveRelease) {
          dispatch(
            showPanel({
              type: 'EDIT_RELEASE',
              release: release!,
              service,
            })
          );
        } else {
          navigateToServiceOverviewPage(service.getName());
        }
      }}
    >
      <CardActionArea>
        <Grid container spacing={2} className="row">
          <Grid item xs={9} md={4}>
            <div className="title-row">
              <TypeIcon fontSize="large" />
              <HorizontalSpacer size={16} />
              <div className="title-column">
                <Typography variant="overline" color="textSecondary">
                  {getServiceTypeName(release?.getRunconfig()?.getType() || 0)}
                </Typography>
                <Typography className="wrap-icon" variant="h6">
                  {isPromotedService(service) && (
                    <PromotedTooltip service={service}>
                      <LabelImportantIcon
                        className="promote-icon"
                        fontSize="small"
                      />
                    </PromotedTooltip>
                  )}
                  {service.getName()}
                </Typography>
              </div>
            </div>
          </Grid>
          <Grid item xs={2} md={1}>
            <Typography variant="body2">
              {getTagFromPromotedRelease(release)}
            </Typography>
          </Grid>
          <Hidden smDown>
            <Grid item md={2}>
              <Typography variant="body2">
                {getLanguageNameByType(buildConfig?.getLanguage() || 0)}
              </Typography>
            </Grid>
          </Hidden>
          <Grid item xs={5} md={2}>
            <Typography variant="body2">
              {toTimeElapsed(release?.getCreatedat(), serverTimeOffset)}
            </Typography>
          </Grid>
          <Grid item xs={4} md={2}>
            {renderServiceState(serviceState, isSuspended, isPendingConfig)}
          </Grid>
          <Grid item xs={2} md={1}>
            {/* we cannot do button inside a button */}
            <div
              className="div-button"
              role="button"
              tabIndex={0}
              onKeyUp={onMenuButtonClicked}
              onKeyDown={cancelPropagation}
              onMouseDown={cancelPropagation}
              onTouchStart={cancelPropagation}
              onClick={onMenuButtonClicked}
            >
              <MoreIcon fontSize="small" />
            </div>
          </Grid>
        </Grid>
      </CardActionArea>
    </StyledCard>
  );
};
