import React from "react";
import { addDecorator, configure } from "@storybook/react";
import { MuiThemeProvider } from '@material-ui/core/';
import theme from 'theme';
// automatically import all files ending in *.stories.js
configure(require.context("../src/stories", true, /\.stories\.*$/), module);

const GlobalWrapper = stories => (
  <MuiThemeProvider theme={theme}>
    {stories()}
  </MuiThemeProvider>
);

addDecorator(GlobalWrapper);