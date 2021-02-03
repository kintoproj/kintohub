import React from 'react';
import styled from 'styled-components';

interface Props {
  height: number;
  percentage: number;
}

interface StyledDivProps {
  height: number;
}

const StyledDiv = styled.div<StyledDivProps>`
  width: 100%;
  background-color: rgb(224, 224, 224);
  border-radius: 9.5px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  .progress-bar-fill {
    display: block;
    height: ${(props) => props.height || 0}px;
    background-color: ${(props) => props.theme.palette.primary.main};
    border-radius: 9.5px 0px 0px 9.5px;
  }
`;

export default ({ percentage, height }: Props) => {
  return (
    <StyledDiv height={height}>
      <span
        className="progress-bar-fill"
        style={{
          width: `${isNaN(percentage) ? 0 : Math.round(100 * percentage)}%`,
        }}
      />
    </StyledDiv>
  );
};
