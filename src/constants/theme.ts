/**
 * AfterRole design tokens.
 *
 * AfterRole is a real-name professional workplace-story app — the visual
 * language is calm, editorial and trustworthy rather than loud. Colors are
 * defined for light and dark mode; typography uses Inter across platforms so
 * type reads identically on iOS, Android and web.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Brand = {
  name: 'AfterRole',
  wordmark: 'afterrole',
  tagline: 'Know before you join.',
  positioning: 'Real names. Real workplace stories.',
} as const;

export const Colors = {
  light: {
    text: '#0F172A',
    textSecondary: '#556070',
    background: '#FFFFFF',
    backgroundElement: '#F4F6F8',
    backgroundSelected: '#E9EDF2',
    border: '#E2E8F0',
    tint: '#2B50E2',
    tintText: '#FFFFFF',
    success: '#128A5B',
    danger: '#D64545',
  },
  dark: {
    text: '#F1F5F9',
    textSecondary: '#97A2B3',
    background: '#0B0F17',
    backgroundElement: '#151B26',
    backgroundSelected: '#1E2634',
    border: '#232C3B',
    tint: '#5B7CFA',
    tintText: '#FFFFFF',
    success: '#3ECF8E',
    danger: '#F26D6D',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

/**
 * Inter family names match the exports of `@expo-google-fonts/inter` and the
 * keys loaded in the root layout. Each weight is a distinct font file, so we
 * select by `fontFamily` rather than by numeric `fontWeight`.
 */
export const Fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  mono:
    Platform.select({
      ios: 'ui-monospace',
      android: 'monospace',
      web: 'var(--font-mono)',
      default: 'monospace',
    }) ?? 'monospace',
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 720;
