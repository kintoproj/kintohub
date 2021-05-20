import 'types/yup';

import FormikTextField from 'components/atoms/FormikTextField';
import LandingBackdrop from 'components/atoms/LandingBackdrop';
import SolidIconButtonSeparated from 'components/atoms/SolidIconButtonSeparated';
import { VerticalSpacer } from 'components/atoms/Spacer';
import { useServiceNavigate } from 'components/hooks/PathHook';
import { useAuthState } from 'components/hooks/ReduxStateHook';
import { Formik, FormikProps } from 'formik';
import { EnvNameSchema } from 'libraries/helpers/yup';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateEnvList as updateEnvironments } from 'states/auth/actions';
import { doHidePanel } from 'states/sidePanel/actions';
import styled from 'styled-components';
import * as Yup from 'yup';

import { IconButton, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/CloseRounded';
import { createEnvironment } from 'libraries/grpc/environment';
import { bps } from 'theme';
import { useGRPCWrapper } from '../../templates/GRPCWrapper';

const StyledDiv = styled.div`
  position: relative;
  overflow: hidden;
  height: 100%;
  width: 100vw;
  display: flex;
  flex-direction: row;
  .content {
    padding: 20px;
    overflow-y: auto;
    height: 100%;
    .MuiButton-root {
      width: 100%;
    }
    display: flex;
    align-items: center;
  }
  .content-wrapper {
    display: flex;
    flex-direction: column;
  }
  .main {
    width: 60%;
    height: 100%;
    ${bps.down('md')} {
      width: 100%;
    }
    padding: 16px;
    flex-direction: column;
    display: flex;
    transform: translate(0, 0);
  }
`;

const validationSchema = Yup.object({
  envName: EnvNameSchema,
  clusterId: Yup.string().required(),
});

type SignUpValues = {
  envName: string;
};

const renderNameEnv = (props: FormikProps<SignUpValues>, next: Function) => {
  return (
    <>
      <div className="content-wrapper">
        <Typography variant="h2">Name Your Environment</Typography>
        <Typography variant="body2">
          Choose an intuitive name for your new environment.
        </Typography>
        <VerticalSpacer size={40} />
        <FormikTextField
          variant="outlined"
          name="envName"
          placeholder="e.g. Production"
          onKeyUp={async (event) => {
            // add this because this is not a real managed form
            if (event.key === 'Enter') {
              const errors = await props.validateForm();
              if (!(errors && errors.envName)) {
                next(true);
              }
            }
          }}
        />
        <VerticalSpacer size={16} />

        <SolidIconButtonSeparated
          data-cy="name-env-continue-button"
          text="Next"
          isLoading={props.isSubmitting}
          disabled={!!props.errors.envName}
          onClick={() => {
            next(true);
          }}
        />
      </div>
    </>
  );
};

export default () => {
  const dispatch = useDispatch();
  const grpcWrapper = useGRPCWrapper();

  const { environments } = useAuthState();
  const { navigateToServices } = useServiceNavigate();

  return (
    <Formik<SignUpValues>
      initialValues={{
        envName: '',
      }}
      validationSchema={validationSchema}
      onSubmit={(values, actions) => {
        actions.setSubmitting(false);
      }}
    >
      {(props: FormikProps<SignUpValues>) => {
        // force to validate the form at first load
        useEffect(() => {
          props.validateForm();
        }, []);

        const createEnv = async () => {
          props.setSubmitting(true);
          try {
            const env = await grpcWrapper(createEnvironment, {
              envName: props.values.envName,
            });

            // submit the env token
            const envId = env.getId();
            // Must update the environment first
            dispatch(
              updateEnvironments([
                ...environments,
                {
                  name: props.values.envName,
                  envId,
                },
              ])
            );

            navigateToServices({ targetEnvId: envId });

            props.setSubmitting(false);

            dispatch(doHidePanel());
          } catch (error) {
            props.setSubmitting(false);
            props.setFieldError('envName', error.message);
          }
        };

        return (
          <StyledDiv>
            <div className="main">
              <div className="top-button">
                <IconButton
                  data-cy="panel-close-button"
                  onClick={() => {
                    dispatch(doHidePanel());
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </div>
              <div className="content">{renderNameEnv(props, createEnv)}</div>
            </div>
            <LandingBackdrop />
          </StyledDiv>
        );
      }}
    </Formik>
  );
};
