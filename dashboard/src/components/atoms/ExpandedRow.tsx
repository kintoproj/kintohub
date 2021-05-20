import React, { ReactChild } from 'react';
import styled from 'styled-components';

type Props = {
  children: ReactChild | ReactChild[];
};

const RowContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

export default ({ children }: Props) => {
  return <RowContainer>{children}</RowContainer>;
};
