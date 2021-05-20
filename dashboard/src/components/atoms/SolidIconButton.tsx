import React from 'react';
import styled from 'styled-components';
import { CypressButtonProps } from 'types/cypress';

import Button, { ButtonProps } from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

type Props = {
  icon?: React.ComponentType;
  text: string;
  onClick?: Function;
  isLoading?: boolean;
} & ButtonProps &
  CypressButtonProps;

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
  onClick,
  isLoading,
  disabled,
  ...rest
}: Props) => {
  const icon = Component ? <Component /> : null;
  return (
    <IconButton
      variant="contained"
      color="primary"
      disabled={isLoading || disabled}
      {...rest}
      startIcon={
        isLoading ? (
          <CircularProgress color={disabled ? 'inherit' : 'primary'} />
        ) : (
          icon
        )
      }
      onClick={onClick}
    >
      <Typography>{text}</Typography>
    </IconButton>
  );
};
