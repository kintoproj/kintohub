import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import {
  KINTO_COLOR_STATUS_RED,
  KINTO_COLOR_STATUS_BLUE,
  KINTO_COLOR_STATUS_YELLOW,
  kintoGreen, kintoPurple,
} from 'theme/colors';
import { Variant } from '@material-ui/core/styles/createTypography';
import { mainTheme } from 'theme';

interface StyledProps {
  color: string;
}

const Container = styled.div<StyledProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  .circle {
    background-color: ${(props) => props.color};
    width: 12px;
    height: 12px;
    border-radius: 6px;
    margin-right: 6px;
  }
`;

interface Props {
  status: 'success' | 'info' | 'warning' | 'error' | 'sleeping' | 'disabled';
  text: string;
  variant?: Variant;
}

const getColorFromStatus = (status: Props['status']): string => {
  switch (status) {
    case 'error':
      return KINTO_COLOR_STATUS_RED;
    case 'info':
      return KINTO_COLOR_STATUS_BLUE;
    case 'warning':
      return KINTO_COLOR_STATUS_YELLOW;
    case 'success':
      return kintoGreen(200);
    case 'sleeping':
      return kintoPurple(200);
    case 'disabled':
      return mainTheme.palette.grey[500];
  }
  return KINTO_COLOR_STATUS_RED;
};

export default ({ status, text, variant }: Props) => {
  return (
    <Container color={getColorFromStatus(status)}>
      <div className="circle" />
      <Typography variant={variant || 'body2'}>{text}</Typography>
    </Container>
  );
};
