import React from 'react';
import styled from 'styled-components';
import Button, { ButtonProps } from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { CypressButtonProps } from 'types/cypress';

type Props = {
  text: string;
} & ButtonProps &
  CypressButtonProps;

const StyledButton = styled(Button)`
  display: block;
  span {
    text-transform: none;
  }
`;

export default ({ text, onClick, ...rest }: Props) => {
  return (
    <StyledButton onClick={onClick} {...rest}>
      <Typography variant="button">{text}</Typography>
    </StyledButton>
  );
};
