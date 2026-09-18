import { Platform, type TextStyle } from 'react-native';

/**
 * AfterRole uses the platform system font — San Francisco on iOS/macOS (exactly
 * what Apple ships), Roboto on Android, and the `-apple-system` stack on web
 * (SF in Safari/Apple devices). Weight comes from `fontWeight`, never a
 * weighted family name, so no fonts need bundling.
 */
export const fontWeights = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

/**
 * Weight tokens + the mono family. NOTE: `regular/medium/semibold/bold` are
 * `fontWeight` values (used as `fontWeight: fontFamily.semibold`), because UI
 * text renders the system font (San Francisco on Apple) and only needs weight.
 * Only `mono` is an actual font family.
 */
export const fontFamily = {
  regular: fontWeights.regular,
  medium: fontWeights.medium,
  semibold: fontWeights.semibold,
  bold: fontWeights.bold,
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

const W = fontWeights;

export const typography: Record<TypographyVariant, TextStyle> = {
  display: { fontWeight: W.bold, fontSize: 34, lineHeight: 40, letterSpacing: -0.6 },
  title: { fontWeight: W.bold, fontSize: 27, lineHeight: 33, letterSpacing: -0.5 },
  heading: { fontWeight: W.bold, fontSize: 21, lineHeight: 27, letterSpacing: -0.4 },
  subtitle: { fontWeight: W.semibold, fontSize: 18, lineHeight: 24, letterSpacing: -0.3 },
  bodyLarge: { fontWeight: W.regular, fontSize: 16, lineHeight: 25, letterSpacing: -0.2 },
  body: { fontWeight: W.regular, fontSize: 15, lineHeight: 23, letterSpacing: -0.1 },
  bodyMedium: { fontWeight: W.medium, fontSize: 15, lineHeight: 23, letterSpacing: -0.1 },
  callout: { fontWeight: W.semibold, fontSize: 16, lineHeight: 22, letterSpacing: -0.3 },
  label: { fontWeight: W.medium, fontSize: 13, lineHeight: 18, letterSpacing: -0.1 },
  caption: { fontWeight: W.regular, fontSize: 13, lineHeight: 18 },
  small: { fontWeight: W.regular, fontSize: 12, lineHeight: 16 },
  overline: {
    fontWeight: W.semibold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
};
