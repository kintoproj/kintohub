import BasicLinkButton from 'components/atoms/BasicLinkButton';
import OutlinedSelect from 'components/atoms/OutlinedSelect';
import { VerticalSpacer } from 'components/atoms/Spacer';
import { useAuthState } from 'components/hooks/ReduxStateHook';
import AlertDialog from 'components/molecules/AlertDialog';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Block } from 'types/proto/models_pb';

import Typography from '@material-ui/core/Typography';

type Props = {
  service: Block;
  tag: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSubmit: (envId: string, tag: string) => void;
  onCancel: () => void;
};

const StyledDiv = styled.div`
  .MuiFormLabel-root {
    background-color: ${(props) => props.theme.palette.background.paper};
  }
`;

export default ({
  isOpen,
  setIsOpen,
  onSubmit,
  onCancel,
  service,
  tag,
}: Props) => {
  const { environments, envId } = useAuthState();

  const serviceName = service.getName() || '';
  const parentEnvId = service.getParentblockenvid() || '';

  // only environments for same cluster is available
  // and filter out the parent env
  const avaliableEnvironments = environments.filter(
    (e) => e.envId !== envId && e.envId !== parentEnvId
  );

  const [selectedEnvId, setSelectedEnvId] = useState(
    avaliableEnvironments.length > 0 ? avaliableEnvironments[0].envId : ''
  );

  return (
    <AlertDialog
      title={`Promote ${serviceName} ${tag}`}
      textNode={
        <StyledDiv>
          <Typography variant="body2" color="textSecondary">
            Tagged releases can be deployed in other environments like a release
            pipeline. You’ll be able to edit the settings first.
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
          {avaliableEnvironments.length > 0 ? (
            <OutlinedSelect
              fullWidth={true}
              label="Promote To"
              name="env-promote"
              onChange={(evt) => {
                if (evt.target.value) {
                  setSelectedEnvId(`${evt.target.value}`);
                }
              }}
              value={selectedEnvId}
              options={avaliableEnvironments.map((e) => ({
                label: e.name,
                value: e.envId,
              }))}
            />
          ) : (
            <Typography variant="body2" color="textSecondary">
              Sorry, there is no environments available to promote. Please
              create a new environment withing the same region.
            </Typography>
          )}
        </StyledDiv>
      }
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      confirmText="Promote Release"
      onConfirm={() => {
        onSubmit(selectedEnvId, tag);
      }}
      onCancel={() => {
        onCancel();
      }}
      hideConfirmButton={avaliableEnvironments.length === 0}
      useDefaultTheme={true}
    />
  );
};
