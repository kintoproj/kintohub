import 'types/proto.extend/block';

import FormContainer from 'components/atoms/FormContainer';
import FormikTextField from 'components/atoms/FormikTextField';
import { FlexEndRow } from 'components/atoms/Row';
import SolidIconButton from 'components/atoms/SolidIconButton';
import { VerticalSpacer } from 'components/atoms/Spacer';
import StyledA from 'components/atoms/StyledA';
import StyledForm from 'components/atoms/StyledForm';
import { Formik, FormikProps } from 'formik';
import { removeTrailingSlash } from 'libraries/helpers';
import { getHttpsRepository } from 'libraries/helpers/service';
import isEmpty from 'lodash.isempty';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from 'states/app/types';
import { doHidePanel, showPanel } from 'states/sidePanel/actions';
import { CreateReleaseData } from 'states/sidePanel/types';
import { RootState } from 'states/types';
import { BlockType } from 'types';
import { Block } from 'types/proto/kkc_models_pb';
import * as Yup from 'yup';
import {
  getFieldTooShortMessage,
  getFieldRequiredMessage,
  getFieldTooLongMessage,
} from 'libraries/constants';

interface Props {
  serviceType: BlockType;
}

interface ConnectRepoValues {
  repository: string;
  branch: string;
  accessToken: string | null;
}

const ConnectRepoSchema = Yup.object().shape({
  repository: Yup.string()
    .matches(
      // eslint-disable-next-line max-len
      /(github\.com|gitlab\.com|bitbucket\.org)/,
      'Make sure it is a valid repo on github/gitlab/bitbucket'
    )
    .matches(
      // eslint-disable-next-line max-len
      /(((git|ssh|http(s)?)|(git@[\w.]+))(:(\/\/)?))?([\w.@:/\-~]+)((\.git)(\/)?)?/
    )
    .trim()
    .required(getFieldRequiredMessage('repository url')),
  // branch is optional
  branch: Yup.string()
    .min(2, getFieldTooShortMessage('branch', 2))
    .max(128, getFieldTooLongMessage('branch', 128))
    .trim(),
});

// TODO: add test connection on repository
export default ({ serviceType }: Props) => {
  const { config: kintoConfig } = useSelector<RootState, AppState>(
    (s: RootState) => s.app
  );

  const dispatch = useDispatch();
  const initialValues: ConnectRepoValues = {
    repository: '',
    branch: 'master',
    accessToken: '',
  };
  return (
    <Formik<ConnectRepoValues>
      initialValues={initialValues}
      validationSchema={ConnectRepoSchema}
      onSubmit={(values, actions) => {
        // allow empty submit, but will immediate set the value and re-validate the form
        if (values.branch === '') {
          actions.setFieldValue('branch', 'master');
          actions.submitForm();
          return;
        }

        const repoUrl = removeTrailingSlash(values.repository);
        let repoName = repoUrl.split('/').pop();
        repoName = repoName && repoName.replace('.git', '');
        const service = new Block();
        const release = service.initWithParams(
          repoName || '',
          serviceType,
          getHttpsRepository(repoUrl),
          values.branch,
          values.accessToken,
          null,
          kintoConfig
        );

        actions.setSubmitting(false);
        dispatch(doHidePanel());
        setTimeout(() => {
          const data: CreateReleaseData = {
            type: 'CREATE_RELEASE',
            release: release!,
            service,
            tabIndex: 0,
            // for updating the initialValues when restoring edit after billing
            buildConfig: release?.getBuildconfig()!,
            runConfig: release?.getRunconfig()!,
          };
          dispatch(showPanel(data));
        }, 300);
      }}
    >
      {(props: FormikProps<any>) => (
        <StyledForm>
          <FormContainer>
            <FormikTextField
              name="repository"
              label="Repository URL"
              placeholder="e.g. https://github.com/kintohub/kintohub.com.git"
              variant="outlined"
            />
            <VerticalSpacer size={40} />
            <FormikTextField
              name="branch"
              label="Branch"
              variant="outlined"
              placeholder="master"
            />
            <VerticalSpacer size={40} />
            <FormikTextField
              name="accessToken"
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
            <VerticalSpacer size={40} />
            <FlexEndRow>
              <SolidIconButton
                data-cy="connect-repo-button"
                type="submit"
                text="Connect"
                isLoading={props.isSubmitting}
                disabled={!isEmpty(props.errors)}
              />
            </FlexEndRow>
          </FormContainer>
        </StyledForm>
      )}
    </Formik>
  );
};
