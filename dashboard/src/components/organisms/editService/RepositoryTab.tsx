import 'types/proto.extend/block';
import 'types/yup';

import FormContainer from 'components/atoms/FormContainer';
import FormikTextField from 'components/atoms/FormikTextField';
import { VerticalSpacer } from 'components/atoms/Spacer';
import StyledA from 'components/atoms/StyledA';
import StyledForm from 'components/atoms/StyledForm';
import TwoColumns from 'components/atoms/TwoColumns';
import { FormikProps } from 'formik';
import { getGitProvider, getGitProviderIcon } from 'libraries/helpers/service';
import React from 'react';
import { EditServicePageValues } from 'types/service';

import IconButton from '@material-ui/core/IconButton';
import { EditServiceTabProps } from 'types/props/editService';

export default ({
  isPromotedService,
  ...formikProps
}: FormikProps<EditServicePageValues> & EditServiceTabProps) => {
  const repo = formikProps.values.repository;
  const gitProvider = getGitProvider(repo);
  const providerIcon = getGitProviderIcon(gitProvider);
  const isGithubConnectedRepo =
    formikProps.values.repoGithubInstallationId !== '' || // deprecated
    formikProps.values.repoGithubAccessToken !== '';

  return (
    <StyledForm>
      <FormContainer>
        <TwoColumns layout="EVEN" responsive>
          <FormikTextField
            name="repository"
            label="Repository URL"
            variant="outlined"
            disabled={true}
            endAdornment={
              providerIcon && (
                <IconButton
                  onClick={() => {
                    window.open(repo, '_blank');
                  }}
                >
                  {providerIcon}
                </IconButton>
              )
            }
          />
        </TwoColumns>
        <VerticalSpacer size={40} />
        <TwoColumns layout="EVEN" responsive>
          <FormikTextField
            name="branch"
            label="Branch"
            variant="outlined"
            placeholder="master"
            disabled={isPromotedService}
          />
        </TwoColumns>
        <VerticalSpacer size={40} />
        {!isGithubConnectedRepo && (
          <TwoColumns layout="EVEN" responsive>
            <FormikTextField
              name="repoToken"
              label="Access Token"
              type="password"
              autoComplete="one-time-code"
              helperText={
                <>
                  <span>{'Leave blank for public repository.    '}</span>
                  <StyledA
                    href="https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line"
                    target="_blank"
                    rel="noreferrer"
                  >
                    How to create an access token
                  </StyledA>
                </>
              }
              variant="outlined"
            />
          </TwoColumns>
        )}
      </FormContainer>
    </StyledForm>
  );
};
