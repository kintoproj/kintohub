import Button from 'components/atoms/Button';
import ContentContainer from 'components/atoms/ContentContainer';
import ExpandedRow from 'components/atoms/ExpandedRow';
import { SeparatedRow } from 'components/atoms/Row';
import SolidIconButton from 'components/atoms/SolidIconButton';
import { useServiceNavigate } from 'components/hooks/PathHook';
import {
  useAuthState,
  useEnvironment,
  useServicesState,
} from 'components/hooks/ReduxStateHook';
import ConfirmAlertDialog from 'components/molecules/ConfirmAlertDialog';
import EmptyServiceCard from 'components/molecules/EmptyServiceCard';
import FullPageLoading from 'components/molecules/FullPageLoading';
import ServiceCard from 'components/molecules/ServiceCard';
import { useGRPCWrapper } from 'components/templates/GRPCWrapper';
import { PopoverAction, usePopover } from 'components/templates/PopoverHook';
import { getServiceHealthState } from 'libraries/helpers/service';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { doDeleteService, doFetchServices } from 'states/services/actions';
import { showPanel } from 'states/sidePanel/actions';
import styled from 'styled-components';
import { bps, darkTheme } from 'theme';
import { KINTO_FONT_WHITE } from 'theme/colors';
import { Block } from 'types/proto/kkc_models_pb';
import { IconButton, MuiThemeProvider } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/AddRounded';
import ArrowDropDownRounded from '@material-ui/icons/ArrowDropDownRounded';
import SettingIcon from '@material-ui/icons/SettingsRounded';
import { useLocation } from 'react-router';
import { ListServicePageState } from 'types/pageState';

const StyledDiv = styled.div`
  position: relative;
  .bg {
    position: absolute;
    height: 200px;
    background: linear-gradient(
      90deg,
      rgb(54, 55, 106) 0%,
      rgb(27, 28, 54) 100%
    );
    // TODO: no idea why absolute div will block all children click events, need some expert to answer
    div {
      z-index: 1;
      position: relative;
      padding: 24px 40px;
      display: flex;
      flex-direction: column;
      align-items: start;
      ${bps.down('md')} {
        margin-left: 0px;
        padding: 24px;
      }
      .region-text {
        color: rgba(255, 255, 255, 0.87);
      }
      button {
        margin-left: -6px;
        text-transform: none;
        opacity: 0.6;
      }
    }
  }
  .content {
    position: relative;
    background: transparent;
    padding: 110px 24px 0 24px;
    .title {
      margin-bottom: 24px;
      color: ${KINTO_FONT_WHITE};
    }
    .MuiCard-root {
      margin-bottom: 8px;
      box-sizing: border-box;
    }
    ${bps.down('md')} {
      margin-left: 0px;
    }
  }
`;

const Services = () => {
  const location = useLocation();
  const pageState = location?.state as ListServicePageState | undefined;

  const { services, isServicesLoaded, statusMap } = useServicesState();
  const { envId, environments } = useAuthState();
  const { navigateToServices } = useServiceNavigate();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [showingServiceName, setShowingServiceName] = useState<string | null>(
    null
  );

  const grpcWrapper = useGRPCWrapper();
  const environment = useEnvironment();
  const dispatch = useDispatch();

  useEffect(() => {
    if (environment) {
      dispatch(
        doFetchServices(grpcWrapper, environment.envId, {
          promotedServiceName: pageState?.promotedServiceName,
        })
      );
    }
  }, []);

  const deleteServiceByName = async (serviceName: string | null) => {
    if (serviceName) {
      dispatch(
        doDeleteService(grpcWrapper, environment?.envId || '', serviceName)
      );
    }
  };

  /**
   *  Prepare the popovers
   */
  const servicePopoverActions: PopoverAction[] = [
    {
      label: 'Delete Service',
      onClick: () => {
        setDialogOpen(true);
      },
    },
  ];

  const [servicePopover, openServicePopover] = usePopover({
    id: 'service-popover',
    actions: servicePopoverActions,
    anchorOrigin: {
      vertical: 'top',
      horizontal: 'left',
    },
    transformOrigin: {
      vertical: 'top',
      horizontal: 'right',
    },
    onClose: () => {
      setShowingServiceName(null);
    },
  });

  const envPopoverActions: PopoverAction[] = [
    {
      label: 'Create Environment',
      onClick: () => {
        dispatch(showPanel({ type: 'CREATE_ENV' }));
      },
    },
    undefined,
  ]; // divider

  environments.forEach((env) => {
    envPopoverActions.push({
      label: env.name,
      onClick: () => {
        // clear all services before switch
        navigateToServices({ targetEnvId: env.envId });
      },
      disabled: env.envId === envId,
    });
  });

  const [envPopover, openEnvPopover] = usePopover({
    id: 'env-popover',
    actions: envPopoverActions,
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'left',
    },
    transformOrigin: {
      vertical: 'top',
      horizontal: 'left',
    },
  });

  const createService = () => {
    dispatch(
      showPanel({
        type: 'CREATE_SERVICE',
        hasReachLimit: false, // TODO: remove this
      })
    );
  };

  return (
    <StyledDiv>
      <MuiThemeProvider theme={darkTheme}>
        <SeparatedRow className="bg">
          <div>
            <Button
              data-cy="env-list-button"
              variant="text"
              onClick={(evt) => openEnvPopover(evt)}
            >
              <Typography variant="body1">{environment.name}</Typography>
              <ArrowDropDownRounded />
            </Button>
          </div>
          <div>
            <IconButton
              data-cy="env-setting-button"
              onClick={() => {
                if (envId) {
                  dispatch(
                    showPanel({
                      type: 'EDIT_ENV',
                      envId,
                      hasServices: services.length > 0,
                    })
                  );
                }
              }}
            >
              <SettingIcon fontSize="small" />
            </IconButton>
          </div>
        </SeparatedRow>
      </MuiThemeProvider>
      {envPopover}
      {servicePopover}
      <ContentContainer className="content">
        <div className="title">
          <ExpandedRow>
            <Typography variant="h3">{environment.name}</Typography>
            <SolidIconButton
              onClick={createService}
              icon={AddIcon}
              text="Create Service"
              data-cy="create-service-button"
            />
          </ExpandedRow>
        </div>
        {isServicesLoaded ? (
          <>
            {services.length === 0 && (
              <EmptyServiceCard onCreateService={createService} />
            )}
            {services.map((service) => (
              <ServiceCard
                service={Block.deserializeBinary(service.binary)}
                serviceState={getServiceHealthState(service.object, statusMap)}
                key={service.object.name}
                onMenuClicked={(evt) => {
                  setShowingServiceName(service.object.name);
                  openServicePopover(evt);
                }}
              />
            ))}
          </>
        ) : (
          <FullPageLoading />
        )}
      </ContentContainer>
      <ConfirmAlertDialog
        title="Delete Service?"
        toConfirmText={`DELETE-${showingServiceName?.toUpperCase()}`}
        isOpen={dialogOpen}
        setIsOpen={setDialogOpen}
        onConfirm={() => {
          deleteServiceByName(showingServiceName);
        }}
      />
    </StyledDiv>
  );
};

export default Services;
