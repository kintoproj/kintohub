import 'types/proto.extend/block';

import BasicLinkButton from 'components/atoms/BasicLinkButton';
import PlainCard from 'components/atoms/PlainCard';
import { VerticalSpacer } from 'components/atoms/Spacer';
import TextButton from 'components/atoms/TextButton';
import { useCurrentReleaseState } from 'components/hooks/ReleaseHook';
import AlertDialog from 'components/molecules/AlertDialog';
import ConfirmAlertDialog from 'components/molecules/ConfirmAlertDialog';
import ResponsiveWrapper from 'components/molecules/ResponsiveWrapper';
import { useGRPCWrapper } from 'components/templates/GRPCWrapper';
import { Formik, FormikProps } from 'formik';
import {
  deleteService,
  disablePublicUrl,
  enablePublicUrl,
  suspendService,
} from 'libraries/grpc/service';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { enqueueError, setLoading } from 'states/app/actions';
import styled from 'styled-components';
import { Block } from 'types/proto/kkc_models_pb';

import { Divider, Typography } from '@material-ui/core';
import Switch from '@material-ui/core/Switch';
import { useServiceNavigate } from 'components/hooks/PathHook';
import { useAuthState } from 'components/hooks/ReduxStateHook';

type Props = {
  service: Block;
};

interface StyledComponentProps {
  component: any;
}

const StyledDiv = styled.div`
  .MuiCard-root {
    margin-top: 16px;
    padding: 40px;
    input {
      min-width: 400px;
    }
  }

  button.MuiButton-outlined {
    min-width: 160px;
    color: ${(props) => props.theme.palette.error.main};
    border-color: ${(props) => props.theme.palette.error.main};
  }
  .MuiButton-outlined.Mui-disabled {
    opacity: 0.5;
  }
`;

type SettingValues = {
  autoDeploy: boolean;
};

const ServiceActivity = ({ service }: Props) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false);
  const { envId } = useAuthState();
  const {
    navigateToServices,
    navigateToServiceReleasePage,
    navigateToServiceAccessPage
  } = useServiceNavigate();


  const dispatch = useDispatch();
  const grpcWrapper = useGRPCWrapper();

  const onConfirmDeleteService = async () => {
    dispatch(setLoading(true));
    try {
      await grpcWrapper(deleteService, {
        envId,
        serviceName: service.getName(),
      });
      dispatch(setLoading(false));
      navigateToServices();
    } catch (error) {
      dispatch(enqueueError('services', error));
      dispatch(setLoading(false));
    }
  };

  const onConfirmSuspendService = async () => {
    dispatch(setLoading(true));
    try {
      await grpcWrapper(suspendService, {
        envId,
        serviceName: service.getName(),
      });
      dispatch(setLoading(false));
      navigateToServiceReleasePage(service.getName());
    } catch (error) {
      dispatch(enqueueError('services', error));
      dispatch(setLoading(false));
    }
  };

  const { latestLiveRelease, isSuspended } = useCurrentReleaseState(service);

  const serviceType =
    latestLiveRelease?.getRunconfig()?.getType() || Block.Type.NOT_SET;


  // catalog shouldn't show CI/CD
  // and hide it if there is no release yet
  const shouldShowCICD =
    !!latestLiveRelease &&
    latestLiveRelease.getRunconfig()?.getType() !== Block.Type.CATALOG;

  // only API has public/private
  // and by default it is public
  const shouldShowPublicAPI =
    !!latestLiveRelease &&
    latestLiveRelease.getRunconfig()?.getType() === Block.Type.BACKEND_API;

  const isPublicAPI = service.getIspublicurl();

  return (
    <StyledDiv>
      <Formik<SettingValues>
        initialValues={{
          autoDeploy: true,
        }}
        onSubmit={async (values, actions) => { }}
      >
        {(formikProps: FormikProps<any>) => (
          <>
            {(shouldShowCICD || shouldShowPublicAPI) && (
              <>
                <Typography color="textPrimary" variant="h6">
                  Settings
                </Typography>
                <VerticalSpacer size={16} />
                <PlainCard>
                  {shouldShowCICD && (
                    <ResponsiveWrapper
                      title="CI / CD"
                      hint="(coming soon)"
                      subTitle="Automatically build and deploy new git commits."
                    >
                      {/* TODO: */}
                      <Switch checked={false} disabled={true} />
                    </ResponsiveWrapper>
                  )}
                  {shouldShowCICD && shouldShowPublicAPI && (
                    <VerticalSpacer size={32} />
                  )}
                  {shouldShowPublicAPI && (
                    <ResponsiveWrapper
                      title="Public API"
                      subTitle={
                        <Typography
                          variant="caption"
                          className="sub-title"
                          color="textSecondary"
                        >
                          Enables your service to be accessible from a secure
                          public URL which can be found in the{' '}
                          <BasicLinkButton
                            variant="caption"
                            data-cy="access-tab-button"
                            onClick={() => {
                              navigateToServiceAccessPage(service.getName());
                            }}
                          >
                            Access Tab
                          </BasicLinkButton>
                        </Typography>
                      }
                    >
                      <Switch
                        color="primary"
                        checked={isPublicAPI}
                        onClick={async () => {
                          // TODO: in the future we may put the service to redux :D
                          dispatch(setLoading(true));
                          try {
                            if (isPublicAPI) {
                              await grpcWrapper(disablePublicUrl, {
                                envId: envId!,
                                serviceName: service.getName(),
                              });
                              service.setIspublicurl(false);
                            } else {
                              await grpcWrapper(enablePublicUrl, {
                                envId: envId!,
                                serviceName: service.getName(),
                                releaseId: latestLiveRelease?.getId(),
                              });
                              service.setIspublicurl(true);
                            }
                          } catch (error) {
                            dispatch(enqueueError('update-public', error));
                          } finally {
                            dispatch(setLoading(false));
                          }
                        }}
                      />
                    </ResponsiveWrapper>
                  )}
                </PlainCard>
                <VerticalSpacer size={32} />
              </>
            )}

            <Typography color="textPrimary" variant="h6">
              Danger Zone
            </Typography>
            <VerticalSpacer size={16} />
            <PlainCard>
              {/* 
              FIXME: once BE fixed suspend for catalog, we can remove this 
              */}
              {serviceType !== Block.Type.CATALOG &&
                <>
                  <ResponsiveWrapper
                    title="Suspend Service"
                    subTitle="Your service will be paused."
                  >
                    <TextButton
                      variant="outlined"
                      color="primary"
                      data-cy="suspend-service-button"
                      text="Suspend Service"
                      disabled={isSuspended}
                      onClick={() => {
                        setIsSuspendDialogOpen(true);
                      }}
                    />
                  </ResponsiveWrapper>
                  <VerticalSpacer size={32} />
                  <Divider />
                </>
              }

              <VerticalSpacer size={32} />
              <ResponsiveWrapper
                title="Delete Service"
                subTitle="You will delete everything permanently for this service including release history. There is no recovery option. Proceed with caution."
              >
                <TextButton
                  variant="outlined"
                  color="primary"
                  data-cy="delete-service-button"
                  text="Delete Service"
                  onClick={() => {
                    setIsDeleteDialogOpen(true);
                  }}
                />
              </ResponsiveWrapper>
            </PlainCard>
            <VerticalSpacer size={32} />
          </>
        )}
      </Formik>
      <ConfirmAlertDialog
        title="Delete Service?"
        toConfirmText={`DELETE-${service.getName()?.toUpperCase()}`}
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        onConfirm={onConfirmDeleteService}
      />
      <AlertDialog
        title="Suspend Service?"
        text="To resume this service later, you will need to redeploy it."
        isOpen={isSuspendDialogOpen}
        setIsOpen={setIsSuspendDialogOpen}
        onConfirm={onConfirmSuspendService}
      />
    </StyledDiv>
  );
};

export default ServiceActivity;
