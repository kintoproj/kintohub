import SolidIconButton from 'components/atoms/SolidIconButton';
import { HorizontalSpacer } from 'components/atoms/Spacer';
import React from 'react';
import { useDispatch } from 'react-redux';
import { doHidePanel } from 'states/sidePanel/actions';
import styled from 'styled-components';

import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/CloseRounded';

const StyledDiv = styled.div`
background-color: ${(props) => props.theme.palette.background.paper};
  display: flex;
  padding: 8px 16px 8px 8px;
  align-items: center;
  .spacer {
    flex: 1;
  }

  .MuiButton-root {
    height: 36px;
  }
`;

export interface SideBarTitleBarProps {
  onActionButtonClicked?: Function;
  title?: string;
  titleComponent?: JSX.Element;
  buttonTitle?: string;
  buttonComponent?: JSX.Element;
  closeButtonComponent?: JSX.Element;
  onCloseButtonClicked?: Function;
}

export default (props: SideBarTitleBarProps) => {
  const dispatch = useDispatch();
  const {
    title,
    buttonTitle,
    onActionButtonClicked,
    titleComponent,
    buttonComponent,
    closeButtonComponent,
    onCloseButtonClicked,
  } = props;

  return (
    <StyledDiv>
      {closeButtonComponent || (
        <IconButton
          data-cy="panel-close-button"
          onClick={() => {
            onCloseButtonClicked
              ? onCloseButtonClicked()
              : dispatch(doHidePanel());
          }}
        >
          <CloseIcon />
        </IconButton>
      )}
      <HorizontalSpacer size={8} />
      {titleComponent || <Typography variant="h5">{title}</Typography>}
      <div className="spacer" />
      {buttonComponent ||
        (buttonTitle && (
          <SolidIconButton
            data-cy="side-panel-button"
            text={buttonTitle}
            onClick={() => {
              if (onActionButtonClicked) {
                onActionButtonClicked();
              }
            }}
          />
        ))}
    </StyledDiv>
  );
};
