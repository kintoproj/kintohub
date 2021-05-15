import BasicLinkButton from 'components/atoms/BasicLinkButton';
import { VerticalSpacer } from 'components/atoms/Spacer';
import AlertDialog from 'components/molecules/AlertDialog';
import React, { useState } from 'react';
import styled from 'styled-components';

import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { TagNameSchema } from 'libraries/helpers/yup';

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSubmit: (tag: string) => void;
  onCancel: () => void;
};

const StyledDiv = styled.div``;

export default ({ isOpen, setIsOpen, onSubmit, onCancel }: Props) => {
  const [userInput, setUserInput] = useState('');
  const [validateErr, setValidateErr] = useState('');

  const checkSubmit = () => {
    TagNameSchema.validate(userInput)
      .then(() => {
        setIsOpen(false);
        onSubmit(userInput);
      })
      .catch((error) => {
        setValidateErr(error.errors[0]);
      });
  };
  return (
    <StyledDiv>
      <AlertDialog
        title="Tag Release"
        textNode={
          <>
            <>
              <Typography variant="body2" color="textSecondary">
                Create a systematic label to identify this milestone release.
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
              <TextField
                data-cy="alert-dialog-confirm-field"
                fullWidth={true}
                placeholder="e.g. 1.0.0-stable"
                variant="outlined"
                onChange={(evt) => {
                  setUserInput(evt.target.value);
                }}
                onFocus={(evt) => {
                  setValidateErr('');
                }}
                error={validateErr !== ''}
                helperText={validateErr}
                onKeyUp={(event) => {
                  if (event.key === 'Enter') {
                    checkSubmit();
                  }
                }}
              />
            </>
          </>
        }
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        closeOnConfirm={false}
        confirmText="Tag Release"
        onConfirm={() => {
          checkSubmit();
        }}
        onCancel={() => {
          onCancel();
        }}
        useDefaultTheme={true}
      />
    </StyledDiv>
  );
};
