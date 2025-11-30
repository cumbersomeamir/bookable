/**
 * Bookable App Color Theme
 */

export const Colors = {
  // Primary colors
  primary: '#4A90D9',
  primaryDark: '#2E6BB0',
  primaryLight: '#7AB3E8',

  // Secondary colors
  secondary: '#FF6B6B',
  secondaryDark: '#E54545',
  secondaryLight: '#FF9B9B',

  // Accent colors
  accent: '#FFD93D',
  accentDark: '#E5C235',
  accentLight: '#FFE878',

  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  gray: '#ADB5BD',
  lightGray: '#F0F0F0',
  darkGray: '#495057',
  gray100: '#F8F9FA',
  gray200: '#E9ECEF',
  gray300: '#DEE2E6',
  gray400: '#CED4DA',
  gray500: '#ADB5BD',
  gray600: '#6C757D',
  gray700: '#495057',
  gray800: '#343A40',
  gray900: '#212529',

  // Semantic colors
  success: '#28A745',
  warning: '#FFC107',
  error: '#DC3545',
  info: '#17A2B8',

  // Background colors
  background: '#FFFFFF',
  backgroundDark: '#1A1A2E',
  card: '#FFFFFF',
  cardDark: '#16213E',

  // Text colors
  text: '#212529',
  textLight: '#6C757D',
  textDark: '#FFFFFF',
  textMuted: '#ADB5BD',

  // Border colors
  border: '#DEE2E6',
  borderDark: '#495057',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.25)',

  // Transparent
  transparent: 'transparent',
};

export type ColorKeys = keyof typeof Colors;

export default Colors;
