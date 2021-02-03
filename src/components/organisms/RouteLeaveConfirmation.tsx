import React, { useState } from 'react';
import Button from 'components/atoms/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import styled from 'styled-components';

// Since this component is mounted manually with REACTDOM.render
// Using some MUI components will affect the styles of the existing ones
// So better to stick with pure css (styled components)

const Container = styled.div`
  min-width: 300px;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  font-family: Roboto;
  font-weight: normal;
  padding: 24px;

  .header {
    color: rgba(0, 0, 0, 0.87);
  }

  .content {
    margin-top: 24px;
    color: rgba(0, 0, 0, 0.6);
    letter-spacing: 0.25px;
    line-height: 20px;
  }

  .MuiDialogActions-root {
    margin-top: 24px;
    .MuiButton-root {
      margin-left: 24px;
      text-transform: none;
    }
  }
`;

interface Props {
  message: string;
  onCancel: Function;
  onConfirm: Function;
  portal: HTMLElement;
}
// we use the behaviour or passing false to <Prompt />
// https://medium.com/@michaelchan_13570/using-react-router-v4-prompt-with-custom-modal-component-ca839f5faf39
export default (props: Props) => {
  const [modalIsActive] = useState(true);

  return (
    <>
      <Dialog
        open={modalIsActive}
        onClose={() => {
          props.onCancel();
        }}
        container={props.portal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Container>
          <span className="title">Discard all changes?</span>
          <span className="content">
            All the changes will be lost if you leave this page. Press CANCEL if
            you want to remain on this page.
          </span>
          <DialogActions>
            <Button
              data-cy="leave-route-cancel-button"
              onClick={() => {
                props.onCancel();
              }}
            >
              CANCEL
            </Button>
            <Button
              data-cy="leave-route-confirm-button"
              onClick={() => {
                props.onConfirm();
              }}
              color="primary"
              autoFocus
            >
              Discard
            </Button>
          </DialogActions>
        </Container>
      </Dialog>
    </>
  );
};
