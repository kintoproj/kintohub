import { MuiThemeProvider } from '@material-ui/core/styles';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { darkErrorTheme, errorTheme } from 'theme';
import { useAppState } from '../hooks/ReduxStateHook';

export type ErrorThemeProps = {
  children: React.ReactNode;
};

export const ErrorThemeProvider = ({ children }: ErrorThemeProps) => {
  const { isDarkMode } = useAppState();
  return (
    <MuiThemeProvider theme={isDarkMode ? darkErrorTheme : errorTheme}>
      <ThemeProvider theme={isDarkMode ? darkErrorTheme : errorTheme}>
        {children}
      </ThemeProvider>
    </MuiThemeProvider>
  );
};
