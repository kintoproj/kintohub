import React from 'react';
import styled from 'styled-components';
import Button, { ButtonProps } from '@material-ui/core/Button';

import { CypressButtonProps } from 'types/cypress';

type Props = {} & ButtonProps & CypressButtonProps;

const StyledButton = styled(Button)`
  display: block;
  span {
    text-transform: none;
  }
`;

export default ({ onClick, children, ...rest }: Props) => {
  return (
    <StyledButton onClick={onClick} {...rest}>
      {children}
    </StyledButton>
  );
};
