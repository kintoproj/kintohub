import React, { useState } from 'react';
import { push } from 'connected-react-router';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import { VerticalSpacer } from 'components/atoms/Spacer';
import SolidIconButton from 'components/atoms/SolidIconButton';
import { useDispatch } from 'react-redux';
import { Formik, FormikProps } from 'formik';
import { bps } from 'theme';
import FormikTextField from 'components/atoms/FormikTextField';
import DoneButton from '../atoms/DoneButton';
import { updateToken } from '../../states/auth/actions';
import { PATH_APP } from '../../libraries/constants';


const StyledDiv = styled.div`
  box-sizing: border-box;
  padding-top: 35%;
  padding-left: 40px;
  padding-right: 40px;
  ${bps.down('sm')} {
    padding: 40% 20px 0 20px;
  }
  display: flex;
  flex-direction: column;
  height: 100%;
  .retry-button {
    width: 140px;
  }
`;

interface LoginProps {
  secret: string;
}

const LoginPage = () => {
  const dispatch = useDispatch();
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    <StyledDiv>
      <Typography variant="h1">Provide your credential :) </Typography>
      <VerticalSpacer size={32} />
      <Typography variant="h4">
        Looks like you have enabled authentication on kinto-core.
      </Typography>
      <VerticalSpacer size={32} />

      <Formik<LoginProps>
        initialValues={{
          secret: '',
        }}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true);
          dispatch(updateToken(values.secret));
          setTimeout(() => {
            setLoggedIn(true);
            setSubmitting(false);
            dispatch(push(PATH_APP));
          }, 800);
        }}
      >
        {({ handleSubmit, isSubmitting }: FormikProps<any>) => {
          return (
            <form onSubmit={handleSubmit}>
              <div>
                <FormikTextField
                  label="secret"
                  name="secret"
                  variant="outlined"
                  placeholder="The KINTO_CORE_SECRET you set on kinto-core"
                  fullWidth
                />
                <VerticalSpacer size={32} />
                <div>
                  {loggedIn ? (
                    <DoneButton
                      noPadding
                      data-cy="login-success-button"
                      text="Done"
                    />
                  ) : (
                    <SolidIconButton
                      data-cy="login-button"
                      text="LOGIN"
                      size="large"
                      isLoading={isSubmitting}
                      type="submit"
                    />
                  )}
                </div>
              </div>
            </form>
          );
        }}
      </Formik>
    </StyledDiv>
  );
};

export default LoginPage;
