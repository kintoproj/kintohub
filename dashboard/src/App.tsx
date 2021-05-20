import { useAppState } from 'components/hooks/ReduxStateHook';
import { ConnectedRouter } from 'connected-react-router';
import { History } from 'history';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { darkTheme, mainTheme } from 'theme';

import { MuiThemeProvider } from '@material-ui/core/styles';
import Notifier from 'components/templates/Notifier';
import Routes from 'routes';

const StyledDivRoot = styled.div`
  .z-alert {
    z-index: 1200;
  }
  .MuiButton-root {
    text-transform: none;
  }
`;

const ModalContainer = styled.div`
  position: absolute;
`;

const StyledSnackbarProvider = styled(SnackbarProvider)`
  .MuiSnackbarContent-root {
    width: 70vw;
  }
  .MuiButton-root {
    color: white;
    text-transform: none;
  }
`;

interface AppProps {
  history: History;
}

const App = ({ history }: AppProps) => {
  const { isDarkMode } = useAppState();
  return (
    <MuiThemeProvider theme={isDarkMode ? darkTheme : mainTheme}>
      <ThemeProvider theme={isDarkMode ? darkTheme : mainTheme}>
          <StyledDivRoot>
            <ConnectedRouter history={history}>
              <StyledSnackbarProvider
                maxSnack={3}
                classes={{
                  containerAnchorOriginBottomCenter: 'z-alert',
                }}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
              >
                <Notifier />
                <Routes />
              </StyledSnackbarProvider>
              <ModalContainer id="route-modal" />
            </ConnectedRouter>
          </StyledDivRoot>
      </ThemeProvider>
    </MuiThemeProvider>
  );
};

export default App;
