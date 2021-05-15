import React from 'react';

import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import { VerticalSpacer } from 'components/atoms/Spacer';

const StyledDiv = styled.div`
  box-sizing: border-box;
  padding-top: 35%;
  padding-left: 40px;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Maintenance = () => (
  // TODO: add error logs when going to this page
  <StyledDiv>
    <Typography variant="h1">Sorry :( </Typography>
    <VerticalSpacer size={8} />
    <Typography variant="h4">404 Page not found </Typography>
  </StyledDiv>
);

export default Maintenance;
