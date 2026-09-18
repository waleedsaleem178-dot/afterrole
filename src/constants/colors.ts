/**
 * Semantic color tokens for AfterRole.
 *
 * The palette is warm and editorial — ivory canvas, deep forest ink, muted
 * green and soft sage accents. No electric/LinkedIn blue anywhere. Primary
 * actions use deep forest with warm-white text; highlights use brand green.
 *
 * Screens must never hard-code hex values — consume these via `useTheme()`.
 */

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceSubtle: string;
  surfaceElevated: string;
  surfaceSunken: string;

  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;

  /** Deep forest — primary action background. */
  forest: string;
  forestSecondary: string;
  /** Brand green — links, active states, bars, verification. */
  accent: string;
  accentMedium: string;
  accentForeground: string;
  /** Soft sage — selected chip / highlight fills. */
  accentSoft: string;
  /** Very light sage — icon circle backgrounds. */
  accentSubtle: string;

  border: string;
  borderStrong: string;
  borderSubtle: string;

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
  background: '#F8F6F0',
  surface: '#FFFFFF',
  surfaceSubtle: '#FBFAF6',
  surfaceElevated: '#FFFFFF',
  surfaceSunken: '#F3F0E8',

  textPrimary: '#151816',
  textSecondary: '#666B66',
  textMuted: '#919691',
  textInverse: '#F8F6F0',

  forest: '#112A21',
  forestSecondary: '#183C2F',
  accent: '#3D725E',
  accentMedium: '#568770',
  accentForeground: '#F8F6F0',
  accentSoft: '#DCE8DF',
  accentSubtle: '#EDF4EE',

  border: '#E4E1D9',
  borderStrong: '#D6D1C5',
  borderSubtle: '#ECE9E2',

  success: '#3F865F',
  successSoft: '#E9F4EC',
  danger: '#C45E55',
  dangerSoft: '#FBEDEA',
  warning: '#B98B42',
  warningSoft: '#F6ECD9',

  verified: '#3D725E',
  overlay: 'rgba(17, 24, 20, 0.45)',

  tabBar: '#FFFFFF',
  tabBarBorder: '#E4E1D9',
  skeleton: '#ECE9E2',
};

export const darkColors: ThemeColors = {
  background: '#0C110F',
  surface: '#151C18',
  surfaceSubtle: '#131A16',
  surfaceElevated: '#1A221D',
  surfaceSunken: '#101713',

  textPrimary: '#F4F3ED',
  textSecondary: '#AEB4AF',
  textMuted: '#7E8781',
  textInverse: '#0C110F',

  forest: '#1E4536',
  forestSecondary: '#23543F',
  accent: '#82AE98',
  accentMedium: '#6E9F87',
  accentForeground: '#F4F3ED',
  accentSoft: '#23352B',
  accentSubtle: '#1A2620',

  border: '#28332D',
  borderStrong: '#38443C',
  borderSubtle: '#202923',

  success: '#72AD88',
  successSoft: '#1B2C22',
  danger: '#DF8178',
  dangerSoft: '#2E1E1B',
  warning: '#C79A4E',
  warningSoft: '#2A2314',

  verified: '#82AE98',
  overlay: 'rgba(0, 0, 0, 0.55)',

  tabBar: '#101713',
  tabBarBorder: '#28332D',
  skeleton: '#202923',
};

export const colors = {
  light: lightColors,
  dark: darkColors,
} as const;

export type ColorScheme = keyof typeof colors;
export type ThemeColorName = keyof ThemeColors;
