import React from 'react';
import styled from 'styled-components';
import { CypressButtonProps } from 'types/cypress';

import { ButtonProps } from '@material-ui/core/Button';
import { Variant } from '@material-ui/core/styles/createTypography';
import Typography from '@material-ui/core/Typography';

type OnClickProps = {
  onClick: () => void;
  href?: never;
};

type HrefProps = {
  onClick?: never;
  href: string;
};

type Props = {
  children: string | React.ReactNode | React.ReactNode[];
  color?:
    | 'initial'
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'textPrimary'
    | 'textSecondary'
    | 'error';
  variant?: Variant;
} & Omit<ButtonProps, 'color' | 'variant'> &
  CypressButtonProps &
  (HrefProps | OnClickProps);

const StyledTypography = styled(Typography)`
  display: block;
  cursor: pointer;
  span {
    text-transform: none;
  }
  // in case any icon
  .MuiSvgIcon-root {
    font-size: 14px;
  }
`;

export default ({ children, onClick, color, variant, href }: Props) => {
  const goToHref = () => {
    window.open(href, '_blank');
  };

  return (
    <StyledTypography
      variant={variant || 'body2'}
      color={color || 'primary'}
      variantMapping={{
        body2: 'span',
      }}
      display="inline"
      onClick={onClick || goToHref}
    >
      {children}
    </StyledTypography>
  );
};
