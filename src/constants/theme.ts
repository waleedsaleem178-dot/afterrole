/**
 * Central theme barrel for AfterRole.
 *
 * Import design tokens from here (or the individual files). Screens should never
 * hard-code raw values; consume colors via `useTheme()` and use the scales
 * below for spacing / radius / typography / shadows.
 */

import '@/global.css';

export { colors, lightColors, darkColors } from './colors';
export type { ThemeColors, ColorScheme, ThemeColorName } from './colors';
export { spacing, layout } from './spacing';
export type { SpacingKey } from './spacing';
export { radius } from './radius';
export type { RadiusKey } from './radius';
export { fontFamily, typography } from './typography';
export type { TypographyVariant } from './typography';
export { shadows } from './shadows';
export type { ShadowKey } from './shadows';

export const Brand = {
  name: 'AfterRole',
  wordmark: 'afterrole',
  tagline: 'Know before you join.',
  positioning: 'Real names.\nReal workplace stories.',
} as const;
