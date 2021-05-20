import React from 'react';
import styled from 'styled-components';

interface StyledProps {
  color: string;
}

const Container = styled.div<StyledProps>`
  div {
    background-color: ${(props) => props.color};
    width: 12px;
    height: 12px;
    border-radius: 6px;
    margin-right: 6px;
  }
  .animated {
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0%,
    100% {
      opacity: 0.2;
    }
    50% {
      opacity: 1;
    }
  }
`;

interface Props {
  color: string;
  animated?: boolean;
}

export default ({ color, animated }: Props) => {
  return (
    <Container color={color}>
      <div className={animated ? 'animated' : ''} />
    </Container>
  );
};
