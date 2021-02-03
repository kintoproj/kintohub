import React from 'react';
import styled from 'styled-components';
import { bps } from 'theme';


const StyledDiv = styled.div`
  padding: 20px;
  overflow-y: auto;
  box-sizing: border-box;
  height: 100%;
  background-color: ${(props) => props.theme.palette.background.default};
  padding: 40px 68px 0 68px;
  ${bps.down('md')} {
    padding: 20px;
  }
  display: flex;
  justify-content: center;
  .inner-div {
    max-width: 1024px;
    flex: 1 1;
  }
`;

export default ({ children, ...props }:
  React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => {
  return (
    <StyledDiv {...props}>
      <div className="inner-div">{children}</div>
    </StyledDiv>
  );
};
