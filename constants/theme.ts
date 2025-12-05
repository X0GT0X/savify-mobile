/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#202020',
    textOnDarkBackground: '#FFFFFF',
    background: '#F8F8F8',
    white: '#FFFFFF',

    primary: '#202020',
    neutral: '#808080',

    success: '#43B878',
    warning: '#FEAD4F',
    danger: '#DD4747',
    info: '#55AFE7',
  },

  dark: {
    text: '#E6E6E6',
    textOnDarkBackground: '#FFFFFF', // TODO: probably to change
    background: '#202020',
    white: '#FFFFFF',

    primary: '#E6E6E6',
    neutral: '#9BA1A6',

    success: '#43B878',
    warning: '#FEAD4F',
    danger: '#DD4747',
    info: '#55AFE7',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
