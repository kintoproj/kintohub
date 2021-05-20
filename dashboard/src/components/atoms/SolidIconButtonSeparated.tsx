import React from 'react';
import styled from 'styled-components';
import { CypressButtonProps } from 'types/cypress';

import Button, { ButtonProps } from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

type Props = {
  icon?: React.ReactNode; // has a higher priority than iconComponent
  iconComponent?: React.ComponentType;

  text: string;
  onClick?: Function;
  isLoading?: boolean;
} & ButtonProps &
  CypressButtonProps;

/**
 * If we have multiple theme providers, the MUI's global class name becomes unreliable
 * https://stackoverflow.com/questions/61193095/material-ui-nested-theme-providers-breaks-withstyles-hoc
 */
const IconButton = styled(Button)`
  display: block;
  p {
    font-size: 14px;
    letter-spacing: 1.25px;
    font-weight: 500;
    color: white;
    text-transform: none;
    font-family: Roboto;
  }
  [class*='MuiSvgIcon-root'],
  [class*='MuiCircularProgress-root'] {
    color: white;
  }
  [class*='MuiCircularProgress-root'] {
    width: 20px !important;
    height: 20px !important;
  }
  [class*='MuiButton-label'] {
    justify-content: start;
    padding: 8px 0;
    p[class*='MuiTypography-root'] {
      flex-grow: 1;
    }
  }
`;

export default ({
  iconComponent: Component,
  icon,
  text,
  onClick,
  isLoading,
  disabled,
  size = 'small',
  ...rest
}: Props) => {
  const startIcon = Component ? <Component /> : null;
  return (
    <IconButton
      variant="contained"
      color="primary"
      disabled={isLoading || disabled}
      {...rest}
      startIcon={isLoading ? <CircularProgress /> : icon || startIcon}
      onClick={onClick}
    >
      <Typography>{text}</Typography>
    </IconButton>
  );
};
