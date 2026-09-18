/**
 * Semantic color tokens for AfterRole.
 *
 * Screens must never hard-code hex values — consume these via `useTheme()`.
 * The final palette will change during the visual redesign; keeping everything
 * semantic here means that redesign is a token change, not a rewrite.
 */

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceElevated: string;
  surfaceSunken: string;

  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;

  accent: string;
  accentForeground: string;
  accentSoft: string;

  border: string;
  borderStrong: string;

  success: string;
  successSoft: string;
  danger: string;
  dangerSoft: string;
  warning: string;
  warningSoft: string;

  verified: string;
  overlay: string;

  tabBar: string;
  tabBarBorder: string;
  skeleton: string;
}

export const lightColors: ThemeColors = {
  background: '#FFFFFF',
  surface: '#F5F7F9',
  surfaceElevated: '#FFFFFF',
  surfaceSunken: '#EEF1F5',

  textPrimary: '#0E1621',
  textSecondary: '#4A5567',
  textMuted: '#8A94A6',
  textInverse: '#FFFFFF',

  accent: '#2B50E2',
  accentForeground: '#FFFFFF',
  accentSoft: '#E9EEFF',

  border: '#E6E9EE',
  borderStrong: '#D2D7E0',

  success: '#128A5B',
  successSoft: '#E1F3EA',
  danger: '#D64545',
  dangerSoft: '#FBE9E9',
  warning: '#B7791F',
  warningSoft: '#FBEFD8',

  verified: '#2B50E2',
  overlay: 'rgba(15, 22, 33, 0.45)',

  tabBar: '#FFFFFF',
  tabBarBorder: '#E6E9EE',
  skeleton: '#E9ECF1',
};

export const darkColors: ThemeColors = {
  background: '#0B0F17',
  surface: '#141A24',
  surfaceElevated: '#1B222E',
  surfaceSunken: '#0E131C',

  textPrimary: '#F1F4F9',
  textSecondary: '#A7B0BF',
  textMuted: '#6C7688',
  textInverse: '#0B0F17',

  accent: '#4E6EF2',
  accentForeground: '#FFFFFF',
  accentSoft: '#1D2740',

  border: '#232C3B',
  borderStrong: '#313C4E',

  success: '#3ECF8E',
  successSoft: '#16281F',
  danger: '#F26D6D',
  dangerSoft: '#2A1618',
  warning: '#E0A44A',
  warningSoft: '#2A2113',

  verified: '#6C8BFF',
  overlay: 'rgba(0, 0, 0, 0.55)',

  tabBar: '#0E131C',
  tabBarBorder: '#232C3B',
  skeleton: '#1E2632',
};

export const colors = {
  light: lightColors,
  dark: darkColors,
} as const;

export type ColorScheme = keyof typeof colors;
export type ThemeColorName = keyof ThemeColors;
