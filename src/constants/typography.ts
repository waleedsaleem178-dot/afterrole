import { Platform, type TextStyle } from 'react-native';

/**
 * Inter family names match the exports of `@expo-google-fonts/inter` and the
 * keys loaded in the root layout. Each weight is a separate font file, so we
 * select weight via `fontFamily`, not numeric `fontWeight`.
 */
export const fontFamily = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  mono:
    Platform.select({
      ios: 'ui-monospace',
      android: 'monospace',
      web: 'ui-monospace, SFMono-Regular, Menlo, monospace',
      default: 'monospace',
    }) ?? 'monospace',
} as const;

export type TypographyVariant =
  | 'display'
  | 'title'
  | 'heading'
  | 'subtitle'
  | 'bodyLarge'
  | 'body'
  | 'bodyMedium'
  | 'callout'
  | 'label'
  | 'caption'
  | 'small'
  | 'overline';

export const typography: Record<TypographyVariant, TextStyle> = {
  display: { fontFamily: fontFamily.bold, fontSize: 40, lineHeight: 46, letterSpacing: -0.6 },
  title: { fontFamily: fontFamily.bold, fontSize: 30, lineHeight: 36, letterSpacing: -0.4 },
  heading: { fontFamily: fontFamily.semibold, fontSize: 22, lineHeight: 28, letterSpacing: -0.2 },
  subtitle: { fontFamily: fontFamily.semibold, fontSize: 18, lineHeight: 24, letterSpacing: -0.1 },
  bodyLarge: { fontFamily: fontFamily.regular, fontSize: 17, lineHeight: 26 },
  body: { fontFamily: fontFamily.regular, fontSize: 15, lineHeight: 22 },
  bodyMedium: { fontFamily: fontFamily.medium, fontSize: 15, lineHeight: 22 },
  callout: { fontFamily: fontFamily.semibold, fontSize: 15, lineHeight: 20 },
  label: { fontFamily: fontFamily.medium, fontSize: 13, lineHeight: 18 },
  caption: { fontFamily: fontFamily.regular, fontSize: 13, lineHeight: 18 },
  small: { fontFamily: fontFamily.regular, fontSize: 12, lineHeight: 16 },
  overline: {
    fontFamily: fontFamily.semibold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
};
