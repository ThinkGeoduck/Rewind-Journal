import { THEME } from './constants';

export type ThemeMode = 'light' | 'dark';

export const darkTheme = {
  ...THEME,
  colors: {
    ...THEME.colors,
    primary: '#0A84FF',
    secondary: '#6C63FF',
    background: '#000000',
    text: '#FFFFFF',
    textSecondary: '#AAAAAA',
    border: '#333333',
  },
};

export const lightTheme = {
  ...THEME,
  colors: {
    ...THEME.colors,
  },
};

export const getTheme = (mode: ThemeMode) => {
  return mode === 'dark' ? darkTheme : lightTheme;
}; 