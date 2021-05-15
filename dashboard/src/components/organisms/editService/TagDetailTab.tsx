import 'types/proto.extend/block';
import 'types/yup';

import BasicLinkButton from 'components/atoms/BasicLinkButton';
import { Column } from 'components/atoms/Column';
import FormContainer from 'components/atoms/FormContainer';
import OutlinedSelect from 'components/atoms/OutlinedSelect';
import { VerticalSpacer } from 'components/atoms/Spacer';
import StyledForm from 'components/atoms/StyledForm';
import TwoColumns from 'components/atoms/TwoColumns';
import { useServiceNavigate } from 'components/hooks/PathHook';
import { usePromotedFromService } from 'components/hooks/TagHook';
import { FormikProps } from 'formik';
import React from 'react';
import { useDispatch } from 'react-redux';
import { doHidePanel } from 'states/sidePanel/actions';
import styled from 'styled-components';
import { EditServiceTabProps } from 'types/props/editService';
import { EditServicePageValues } from 'types/service';

import Divider from '@material-ui/core/Divider';
import FormHelperText from '@material-ui/core/FormHelperText';
import Typography from '@material-ui/core/Typography';
import CommitSha from 'components/molecules/CommitSha';

const StyledDiv = styled.div`
  .divider {
    width: 100%;
  }
`;

export default ({
  release,
  service,
  isPromotedService,
  ...formikProps
}: FormikProps<EditServicePageValues> & EditServiceTabProps) => {
  const { navigateToServiceOverviewPage } = useServiceNavigate();
  const dispatch = useDispatch();

  // TODO: getting the tags from all releases (or API?)
  const tags = release.getTagsList() || [];

  const { environment } = usePromotedFromService(service);

  const selectedTag = tags.length > 0 ? tags[0] : '';

  return (
    <StyledDiv>
      <StyledForm>
        <FormContainer>
          <Typography variant="body2" color="textPrimary">
            Deploy a release tag created in another environment.
            <BasicLinkButton
              data-cy="tag-release-learn-more-button"
              // TODO: change this once it is released
              href="https://docs.kintohub.com/getting-started/introduction"
            >
              {' '}
              Learn more{' '}
            </BasicLinkButton>
          </Typography>
          <VerticalSpacer size={24} />
          <OutlinedSelect
            fullWidth={true}
            label="Choose Tag"
            variant="outlined"
            value={selectedTag}
            options={tags.map((t) => ({
              label: t,
              value: t,
            }))}
            disabled={true}
          />
          <FormHelperText>
            This tag will replace your current tag
          </FormHelperText>
          <VerticalSpacer size={16} />
        </FormContainer>
        <Divider className="divider" />
        <FormContainer color="primary">
          <TwoColumns layout="EVEN" responsive>
            <Column>
              <Typography variant="overline">TAGGED VIA</Typography>
              {environment ? (
                <BasicLinkButton
                  data-cy="tagged-env-button"
                  onClick={() => {
                    navigateToServiceOverviewPage(
                      service.getName(),
                      environment.envId
                    );
                    dispatch(doHidePanel());
                  }}
                >
                  {environment.name}
                </BasicLinkButton>
              ) : (
                <Typography>-</Typography>
              )}
            </Column>
            <Column>
              <>
                <Typography variant="overline">Commit</Typography>
                <CommitSha release={release} includeBranch={true} />
              </>
            </Column>
          </TwoColumns>
        </FormContainer>
      </StyledForm>
    </StyledDiv>
  );
};
