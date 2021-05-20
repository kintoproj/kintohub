import { SidePanelContainer } from 'components/atoms/Containers';
import PlainCard from 'components/atoms/PlainCard';
import { VerticalSpacer } from 'components/atoms/Spacer';
import TextButton from 'components/atoms/TextButton';
import { useAlertDialog } from 'components/hooks/AlertDialogHook';
import { useAuthState } from 'components/hooks/ReduxStateHook';
import SidePanelSideBar from 'components/molecules/SidePanelTitleBar';
import { useGRPCWrapper } from 'components/templates/GRPCWrapper';
import { PATH_APP } from 'libraries/constants';
import { ErrorThemeProvider } from 'components/molecules/ErrorThemeProvider';
import { deleteEnvironment } from 'libraries/grpc/environment';
import { trackError } from 'libraries/helpers';
import React, { useState } from 'react';
import { Redirect } from 'react-router';
import { setLoading } from 'states/app/actions';
import styled from 'styled-components';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import { useServiceNavigate } from 'components/hooks/PathHook';
import { useDispatch } from 'react-redux';
import EditEnvForm from './EditEnvForm';
import { deleteEnv } from '../../../states/auth/actions';
import { doHidePanel } from '../../../states/sidePanel/actions';

const StyledAlertBody = styled.div`
  .email {
    color: ${(props) => props.theme.palette.primary.main};
  }
`;

const StyledDiv = styled(SidePanelContainer)`
  position: relative;
  overflow: hidden;
  height: 100%;
  .content {
    padding: 20px;
    overflow-y: auto;
    height: 100%;
  }
  .spacer {
    margin-bottom: 10px;
  }
  .main {
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    flex-direction: column;
    transform: translate(0, 0);
    background-color: ${(props) => props.theme.palette.background.default};
  }
`;

type Props = {
  envId: string;
  hasServices: boolean;
};

export default ({ envId, hasServices }: Props) => {
  const { environments } = useAuthState();
  const grpcWrapper = useGRPCWrapper();
  const { navigateToServices } = useServiceNavigate();
  const dispatch = useDispatch();

  const currentEnv = environments.find((e) => e.envId === envId);
  const [error, setError] = useState<string | null>(null);

  const confirmDeleteEnvironment = async () => {
    if (hasServices) {
      setError(
        'You must delete all your services before you can delete the environment.'
      );
      showErrorDialog();
      return;
    }

    if (environments.length === 1) {
      setError('You cannot delete the last environment.');
      showErrorDialog();
      return;
    }
    // preflight check:
    // 1. this is not the last env
    // 2. there is no remaining services
    setLoading(true);

    // We call kkc to delete the actual k8s namespace
    try {
      await grpcWrapper(deleteEnvironment, { envId });
      const nextEnv = environments.find((e) => e.envId !== envId);
      navigateToServices({ targetEnvId: nextEnv?.envId });
      dispatch(deleteEnv(envId));
      dispatch(doHidePanel());
    } catch (err) {
      setError(err.message);
      showErrorDialog();
      trackError('DELETED_KKC_ENV', err);
    }

    setLoading(false);
  };

  const [dialog, showDialog] = useAlertDialog({
    title: 'Delete your environment',
    textNode: (
      <StyledAlertBody>
        <Typography variant="body2">
          This action will permanently delete everything in this environment.
        </Typography>
      </StyledAlertBody>
    ),
    confirmText: 'Delete',
    onConfirm: () => {
      confirmDeleteEnvironment();
    },
  });

  const [errorDialog, showErrorDialog] = useAlertDialog({
    title: 'Error deleting your environment',
    textNode: (
      <StyledAlertBody>
        <Typography variant="body2">{error}</Typography>
      </StyledAlertBody>
    ),
    hideConfirmButton: true,
    cancelText: 'OK',
  });

  // If currentEnv not found (not possible?)
  if (!currentEnv) {
    return <Redirect to={PATH_APP} />;
  }

  return (
    <StyledDiv>
      <div className="main">
        <AppBar color="transparent" position="static">
          <SidePanelSideBar title={currentEnv.name} />
        </AppBar>
        <div className="content">
          <PlainCard>
            <Typography variant="h6">Settings</Typography>
            <VerticalSpacer size={16} />
            <EditEnvForm env={currentEnv} />
          </PlainCard>
          <VerticalSpacer size={32} />
          <PlainCard>
            <Typography variant="h6">Delete Environment</Typography>
            <VerticalSpacer size={16} />
            <Typography variant="body2">
              You will delete everything permanently for this entire
              environment. You MUST delete all your services before deleting the
              whole environment.
            </Typography>
            <VerticalSpacer size={16} />
            <ErrorThemeProvider>
              <TextButton
                variant="outlined"
                color="primary"
                data-cy="delete-service-button"
                text="Delete Environment"
                size="large"
                onClick={() => {
                  showDialog();
                }}
              />
            </ErrorThemeProvider>
          </PlainCard>
        </div>
      </div>
      {dialog}
      {errorDialog}
    </StyledDiv>
  );
};
