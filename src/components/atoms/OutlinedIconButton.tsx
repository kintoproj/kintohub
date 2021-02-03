import React from 'react';
import styled from 'styled-components';
import Button, { ButtonProps } from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import { CircularProgress } from '@material-ui/core';

type Props = {
  icon?: React.ComponentType<SvgIconProps>;
  text: string;
  isLoading?: boolean;
} & ButtonProps;

const IconButton = styled(Button)`
  display: block;
  p {
    font-size: 14px;
    letter-spacing: 1.25px;
    font-weight: 500;
    text-transform: none;
  }
  .MuiCircularProgress-root {
    width: 20px !important;
    height: 20px !important;
  }
`;

export default ({
  icon: Component,
  text,
  isLoading,
  disabled,
  ...rest
}: Props) => {
  return (
    <IconButton
      variant="outlined"
      disabled={disabled}
      {...rest}
      startIcon={
        isLoading ? (
          <CircularProgress color={disabled ? 'inherit' : 'primary'} />
        ) : (
          Component && <Component color={disabled ? 'inherit' : 'primary'} />
        )
      }
    >
      <Typography color={disabled ? 'initial' : 'primary'}>{text}</Typography>
    </IconButton>
  );
};
