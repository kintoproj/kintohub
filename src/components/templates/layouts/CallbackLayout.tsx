import React from 'react';
import { useSelector } from 'react-redux';
import { AppState } from 'states/app/types';
import { RootState } from 'states/types';
import styled from 'styled-components';

import CircularProgress from '@material-ui/core/CircularProgress';

const StyledDiv = styled.div`
  display: flex;
  height: 100vh;
  .loading {
    z-index: 100;
    position: fixed;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .background {
      position: fixed;
      width: 100%;
      height: 100%;
      background-color: rgb(256, 256, 256, 0.4);
    }
  }
`;

const DefaultLayout = ({ children }: React.PropsWithChildren<{}>) => {
  const { isLoading } = useSelector<RootState, AppState>(
    (state: RootState) => state.app
  );

  return (
    <StyledDiv>
      <div className="main">
        {isLoading && (
          <div className="loading">
            <div className="background" />
            <CircularProgress />
          </div>
        )}

        {children}
      </div>
    </StyledDiv>
  );
};

export default DefaultLayout;
