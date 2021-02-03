import React, { useState } from 'react';
import styled from 'styled-components';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
} from '@material-ui/core';
import Button from 'components/atoms/Button';
import { VerticalSpacer } from 'components/atoms/Spacer';
import { ErrorThemeProvider } from 'components/molecules/ErrorThemeProvider';

type Props = {
  title: string;
  toConfirmText: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onConfirm: () => void;
  onCancel?: () => void;
  cancelText?: string;
  confirmText?: string;
};

const StyledDialog = styled(Dialog)`
  .MuiPaper-root {
    width: 350px;
  }
  span {
    text-transform: none;
  }
  .text {
    .confirm-text {
      color: ${(props) => props.theme.palette.error.main};
      font-weight: 800;
    }
  }
  .dialog-actions {
    padding: 16px;
    button {
      min-width: 100px;
      min-height: 36px;
    }
  }
`;

export default ({
  isOpen,
  setIsOpen,
  toConfirmText,
  title,
  onCancel,
  onConfirm,
  cancelText,
  confirmText,
}: Props) => {
  const [userInput, setUserInput] = useState('');

  const isConfirmEnabled = userInput === toConfirmText;
  return (
    <div>
      <StyledDialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <ErrorThemeProvider>
          <DialogContent>
            <Typography variant="subtitle1">{title}</Typography>
            <VerticalSpacer size={16} />
            <Typography className="text" variant="body2" color="textSecondary">
              Type
              <span className="confirm-text">{` ${toConfirmText} `}</span>
              to confirm
            </Typography>
            <VerticalSpacer size={16} />
            <TextField
              data-cy="alert-dialog-confirm-field"
              fullWidth={true}
              placeholder={toConfirmText}
              variant="outlined"
              size="small"
              onChange={(evt) => {
                setUserInput(evt.target.value);
              }}
              onKeyUp={async (event) => {
                if (event.key === 'Enter') {
                  if (onConfirm && isConfirmEnabled) {
                    setIsOpen(false);
                    onConfirm();
                  }
                }
              }}
            />
            <VerticalSpacer size={32} />
          </DialogContent>

          <DialogActions className="dialog-actions">
            <Button
              data-cy="confirm-alert-cancel-button"
              className="cancel-button"
              variant="text"
              onClick={() => {
                setIsOpen(false);
                if (onCancel) {
                  onCancel();
                }
              }}
              color="primary"
            >
              <Typography variant="button" color="textSecondary">
                {cancelText || 'Cancel'}
              </Typography>
            </Button>
            <Button
              data-cy="confirm-alert-confirm-button"
              variant="contained"
              onClick={() => {
                setIsOpen(false);
                if (onConfirm) {
                  onConfirm();
                }
              }}
              color="primary"
              disabled={!isConfirmEnabled}
            >
              <Typography variant="button">
                {confirmText || 'Confirm'}
              </Typography>
            </Button>
          </DialogActions>
        </ErrorThemeProvider>
      </StyledDialog>
    </div>
  );
};
