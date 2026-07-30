import {
  Config,
  CustomThemeConfig,
  KeyValuePair,
  PluginUtils,
  RecursiveKeyValuePair,
  ResolvableTo,
  ScreensConfig,
  ThemeConfig,
} from 'tailwindcss/types/config';
import defaultTheme from 'tailwindcss/defaultTheme';
import defaultColors from 'tailwindcss/colors';

const ThemeScreens = {
  xxs: '320px', //'320px',
  xs: '480px', //'480px',
  sm: '640px', //'640px',
  md: '768px', //'768px',
  lg: '1024px', //'1024px',
  xl: '1280px', //'1280px',
  xxl: '1680px', //'1680px',
  xxxl: '1920px', //1920px
};
const primary = defaultColors.blue[500] as string;
const secondary = defaultColors.blue[300] as string;

const ThemeColors: KeyValuePair<string, string> = {
  primary,
  secondary,
};

const CustomTheme: Partial<CustomThemeConfig> = {
  screens: ThemeScreens,
  colors: ThemeColors,
};

export { ThemeScreens, ThemeColors, CustomTheme };
