import React from 'react';
import styled from 'styled-components';
import { RouteComponentProps } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';

type Props = {
  children: React.ComponentType | React.ComponentType[];
  anonymous?: boolean;
} & RouteComponentProps;

const LayoutContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const DefaultLayout = ({
  children,
  anonymous = false,
  location,
  ...rest
}: Props) => {
  return (
    <LayoutContainer>
      <CircularProgress />
      <div className="main">{children}</div>
    </LayoutContainer>
  );
};

export default DefaultLayout;
