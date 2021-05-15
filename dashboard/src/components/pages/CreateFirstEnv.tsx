import 'types/yup';

import FormikTextField from 'components/atoms/FormikTextField';
import SolidIconButtonSeparated from 'components/atoms/SolidIconButtonSeparated';
import { VerticalSpacer } from 'components/atoms/Spacer';
import { useServiceNavigate } from 'components/hooks/PathHook';
import { Formik, FormikProps } from 'formik';
import { EnvNameSchema } from 'libraries/helpers/yup';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled, { ThemeProvider } from 'styled-components';
import * as Yup from 'yup';

import { MuiThemeProvider, Typography } from '@material-ui/core';

import { mainTheme } from 'theme';
import { createEnvironment, getEnvironments } from 'libraries/grpc/environment';
import { updateEnvList as updateEnvironments } from 'states/auth/actions';
import { doHidePanel } from 'states/sidePanel/actions';
import { PATH_MAINTENANCE } from 'libraries/constants';
import { push } from 'connected-react-router';
import FullPageLoading from '../molecules/FullPageLoading';
import { useGRPCWrapper } from '../templates/GRPCWrapper';

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
    .content-wrapper {
      display: flex;
      flex-direction: column;
    }
  }

  .main {
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
  }
`;

const validationSchema = Yup.object({
  envName: EnvNameSchema,
  clusterId: Yup.string().required(),
});

type SignUpValues = {
  envName: string;
};

export default () => {
  const grpcWrapper = useGRPCWrapper();

  const dispatch = useDispatch();
  const { navigateToServices } = useServiceNavigate();
  const [initLoaded, setInitLoaded] = useState(true);

  useEffect(() => {
    const initLoad = async () => {
      try {
        const envs = await grpcWrapper(getEnvironments, {});
        const envList = envs.getItemsList();
        if (envList.length !== 0) {
          navigateToServices({ targetEnvId: envList[0].getId() });
        }
      } catch (error) {
        dispatch(push(PATH_MAINTENANCE, { error }));
      }
      setInitLoaded(true);
    };

    initLoad();
  }, []);

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
            {!initLoaded && <FullPageLoading />}
            <MuiThemeProvider theme={mainTheme}>
              <ThemeProvider theme={mainTheme}>
                <form onSubmit={props.handleSubmit}>
                  <div className="main">
                    <div className="content">
                      <div className="content-wrapper">
                        <Typography variant="h2">
                          Name Your First Environment
                        </Typography>
                        <Typography variant="body2">
                          Choose an intuitive name for your new environment.
                        </Typography>
                        <VerticalSpacer size={40} />
                        <FormikTextField
                          variant="outlined"
                          name="envName"
                          placeholder="e.g. Production"
                        />
                        <VerticalSpacer size={16} />

                        <SolidIconButtonSeparated
                          data-cy="name-env-continue-button"
                          text="Create"
                          isLoading={props.isSubmitting}
                          disabled={!!props.errors.envName}
                          onClick={createEnv}
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </ThemeProvider>
            </MuiThemeProvider>
          </StyledDiv>
        );
      }}
    </Formik>
  );
};
