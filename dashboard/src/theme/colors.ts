export const KINTO_PURPLE = 'rgb(98, 0, 238)';

export const KINTO_LIGHT_PURPLE = '#BB86FC';
export const KINTO_GREY = 'rgb(158, 158, 158)';
export const KINTO_LIGHT_GREY = '#f6f7f9';
export const KINTO_FONT_DARK_GREY = 'rgba(0, 0, 0, 0.87)';
export const KINTO_FONT_LIGHT_GREY = 'rgba(0, 0, 0, 0.6)';
export const KINTO_FONT_MORE_LIGHT_GREY = 'rgba(0, 0, 0, 0.38)';
export const KINTO_FONT_SUPER_LIGHT_GREY = 'rgba(0, 0, 0, 0.12)';

export const KINTO_ERROR_LIGHT = 'rgb(198,40,40)';
export const KINTO_ERROR = '#B00020';
export const KINTO_ERROR_DARK = '#B00020';

export const KINTO_FONT_WHITE = 'rgba(255, 255, 255, 0.87)';

export const KINTO_COLOR_STATUS_RED = 'rgb(207, 102, 121)';

export const AVATAR_COLORS = [
  '#ff004d', // red
  '#fee11a', // yellow
  '#007030', // green
  '#5a27c1', // purple
  '#ed177a', // red?
  '#de4118', // orange
  '#b1c844', // dirt yellow
  '#9b3920', // brown
  '#fe9cd6', // pink
  '#6d99b4', // light blue
];

// TBD
export const KINTO_COLOR_STATUS_YELLOW = 'rgb(3, 218, 197)';
export const KINTO_COLOR_STATUS_BLUE = 'rgb(3, 218, 197)';

type Shade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

export const kintoPurple = (shade: Shade): string => {
  return {
    50: '#F2E7FE',
    100: '#DBB2FF',
    200: '#BB86FC',
    300: '#985EFF',
    400: '#7F39FB',
    500: '#6200EE',
    600: '#5600E8',
    700: '#3700B3',
    800: '#30009C',
    900: '#23036A',
  }[shade];
};

export const kintoGreen = (shade: Shade): string => {
  return {
    50: '#C8FFF4',
    100: '#70EFDE',
    200: '#03DAC5',
    300: '#00C4B4',
    400: '#00B3A6',
    500: '#01A299',
    600: '#019592',
    700: '#018786',
    800: '#017374',
    900: '#005457',
  }[shade];
};
