import React from 'react';
import styled from 'styled-components';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
} from '@material-ui/core';
import Button from 'components/atoms/Button';
import { VerticalSpacer } from 'components/atoms/Spacer';
import { ErrorThemeProvider } from 'components/molecules/ErrorThemeProvider';

export type AlertDialogProps = {
  title: string;
  text?: string;
  textNode?: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onConfirm?: () => void;
  closeOnConfirm?: boolean;
  onCancel?: () => void;
  hideConfirmButton?: boolean;
  hideCancelButton?: boolean;
  cancelText?: string;
  confirmText?: string;
  useDefaultTheme?: boolean;
};

const StyledDialog = styled(Dialog)`
  .MuiPaper-root {
    width: 350px;
  }
  span {
    text-transform: none;
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
  text,
  title,
  onCancel,
  onConfirm,
  textNode,
  hideConfirmButton,
  closeOnConfirm = true,
  hideCancelButton,
  cancelText,
  confirmText,
  useDefaultTheme,
}: AlertDialogProps) => {
  const renderContent = () => {
    return (
      <>
        <DialogContent>
          <Typography variant="subtitle1">{title}</Typography>
          <VerticalSpacer size={16} />
          {textNode || (
            <Typography className="text" variant="body2" color="textSecondary">
              {text}
            </Typography>
          )}

          <VerticalSpacer size={24} />
        </DialogContent>
        <DialogActions className="dialog-actions">
          {!hideCancelButton && (
            <Button
              data-cy="alert-cancel-button"
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
          )}
          {!hideConfirmButton && (
            <Button
              data-cy="alert-confirm-button"
              className="confirm-button"
              variant="contained"
              onClick={() => {
                if (closeOnConfirm) {
                  setIsOpen(false);
                }
                if (onConfirm) {
                  onConfirm();
                }
              }}
              color="primary"
            >
              <Typography variant="button">
                {confirmText || 'Confirm'}
              </Typography>
            </Button>
          )}
        </DialogActions>
      </>
    );
  };
  return (
    <div>
      <StyledDialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {useDefaultTheme ? (
          renderContent()
        ) : (
          <ErrorThemeProvider> {renderContent()}</ErrorThemeProvider>
        )}
      </StyledDialog>
    </div>
  );
};
