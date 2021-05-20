import React from 'react';
import styled from 'styled-components';
import { Divider, Typography } from '@material-ui/core';

const StyledDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  .MuiDivider-root {
    margin: 0 8px;
    flex-grow: 1;
  }
`;

interface Props {
  text: string;
}

export default ({ text }: Props) => {
  return (
    <StyledDiv>
      <Divider />
      <Typography variant="body2">{text}</Typography>
      <Divider />
    </StyledDiv>
  );
};
