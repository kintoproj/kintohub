import { createMuiTheme } from '@material-ui/core/styles';
import createBreakpoints from '@material-ui/core/styles/createBreakpoints';
import {
  KINTO_FONT_LIGHT_GREY,
  kintoPurple,
  KINTO_ERROR_LIGHT,
  KINTO_ERROR,
  KINTO_ERROR_DARK,
  kintoGreen,
  KINTO_GREY,
} from 'theme/colors';
import createPalette, {
  PaletteOptions,
} from '@material-ui/core/styles/createPalette';

export const bps = createBreakpoints({});

export const headingFontFamily = 'Roboto';
export const bodyFontFamily = 'Roboto';

const palette: PaletteOptions = {
  primary: {
    light: kintoPurple(200),
    main: kintoPurple(500),
    dark: kintoPurple(700),
    contrastText: '#fff',
  },
  action: {
    hover: 'rgba(86, 0, 232, 0.07)',
  },
  secondary: {
    main: '#ffffff',
    light: '#ff867c',
    dark: '#b61827',
    contrastText: '#000',
  },
  background: {
    default: '#f6f7f9',
    paper: '#ffffff',
  },
  common: {
    black: '#121212',
  },
  text: {
    primary: 'rgba(0, 0, 0, 0.87)',
    secondary: 'rgba(0, 0, 0, 0.54)',
    disabled: 'rgba(0, 0, 0, 0.38)',
    hint: 'rgba(0, 0, 0, 0.74)',
  },
  divider: 'rgba(0, 0, 0, 0.12)',
  error: {
    light: KINTO_ERROR_LIGHT,
    main: KINTO_ERROR,
    dark: KINTO_ERROR_DARK,
    contrastText: '#fff',
  },
  success: {
    light: kintoGreen(200),
    main: kintoGreen(400),
    dark: kintoGreen(700),
    contrastText: '#fff',
  },
};

const darkPalette: PaletteOptions = {
  primary: {
    light: kintoPurple(700),
    main: kintoPurple(300),
    dark: kintoPurple(200),
    contrastText: '#fff',
  },
  secondary: {
    main: kintoPurple(200),
    light: '#ff867c',
    dark: '#b61827',
    contrastText: '#fff',
  },
  background: {
    default: '#121212',
    paper: '#333',
  },
  divider: 'rgba(255, 255, 255, 0.12)',
  text: {
    primary: 'rgba(255, 255, 255, 0.87)',
    secondary: 'rgba(255, 255, 255, 0.6)',
    disabled: 'rgba(255, 255, 255, 0.38)',
    hint: 'rgba(255, 255, 255, 0.74)',
  },
  error: {
    light: KINTO_ERROR_LIGHT,
    main: KINTO_ERROR,
    dark: KINTO_ERROR_DARK,
    contrastText: '#fff',
  },
  grey: {
    900: '#fafafa',
    800: '#f5f5f5',
    700: '#eeeeee',
    600: '#e0e0e0',
    500: '#bdbdbd',
    400: '#9e9e9e',
    300: '#757575',
    200: '#616161',
    100: '#424242',
    50: '#212121',
  },
};

const errorPalette: PaletteOptions = {
  primary: {
    main: KINTO_ERROR,
    contrastText: '#fff',
  },
  background: {
    default: '#ffffff',
    paper: '#ffffff',
  },
  text: {
    primary: '#000',
    secondary: KINTO_FONT_LIGHT_GREY,
  },
};

const darkErrorPalette: PaletteOptions = {
  primary: {
    main: KINTO_ERROR_DARK,
    contrastText: '#fff',
  },
  background: {
    default: '#ffffff',
    paper: '#ffffff',
  },
  text: {
    primary: '#fff',
    secondary: KINTO_GREY,
  },
};

export const typography = {
  useNextVariants: true,
  xsmallFontSize: 12,
  smallFontSize: 14,
  fontSize: 16,
  fontFamily: headingFontFamily,
  h1: {
    fontFamily: headingFontFamily,
    fontSize: 34,
    fontWeight: 500,
  },
  h2: {
    fontFamily: headingFontFamily,
    fontSize: 30,
    fontWeight: 500,
  },
  h3: {
    fontFamily: headingFontFamily,
    fontSize: 26,
    fontWeight: 500,
  },
  h4: {
    fontFamily: headingFontFamily,
    fontSize: 24,
    fontWeight: 500,
  },
  h5: {
    fontFamily: headingFontFamily,
    fontSize: 20,
    fontWeight: 500,
  },
  h6: {
    fontFamily: headingFontFamily,
    fontSize: 18,
    fontWeight: 500,
  },
  subtitle1: {
    fontFamily: headingFontFamily,
    fontSize: 16,
    fontWeight: 500,
  },
  subtitle2: {
    fontFamily: headingFontFamily,
    fontSize: 14,
  },
  body1: {
    fontFamily: headingFontFamily,
    fontSize: 16,
    letterSpacing: 0.5,
  },
  body2: {
    fontFamily: headingFontFamily,
    fontSize: 14,
    letterSpacing: 0.25,
  },
  caption: {
    fontFamily: headingFontFamily,
    fontSize: 12,
    letterSpacing: 0.4,
  },
  overline: {
    fontFamily: headingFontFamily,
    fontSize: 10,
    letterSpacing: '1.4px',
    lineHeight: '16px',
  },
  button: {
    fontFamily: headingFontFamily,
    fontSize: 14,
    letterSpacing: '1.25px',
    lineHeight: '16px',
  },
};

export const mainTheme = createMuiTheme({
  typography,
  palette: createPalette(palette),
});

export const blackTheme = createMuiTheme({
  typography,
  palette: createPalette({
    ...palette,
    primary: {
      light: 'rgba(0,0,0,0.87)',
      main: 'rgba(0,0,0,0.87)',
      dark: 'rgba(0,0,0,0.87)',
      contrastText: '#fff',
    },
  }),
});

export const darkTheme = createMuiTheme({
  typography,
  palette: createPalette({
    ...darkPalette,
    type: 'dark',
  }),
});

export const errorTheme = createMuiTheme({
  typography,
  palette: createPalette({
    ...errorPalette,
  }),
});

export const darkErrorTheme = createMuiTheme({
  typography,
  palette: createPalette({
    ...darkErrorPalette,
  }),
});
