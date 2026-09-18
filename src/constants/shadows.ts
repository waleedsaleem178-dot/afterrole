import { Platform, type ViewStyle } from 'react-native';

/**
 * Elevation presets. AfterRole separates surfaces mainly through background,
 * border and spacing — shadows are barely-there and warm-toned. Never large
 * floating Material shadows.
 */
type Shadow = Pick<
  ViewStyle,
  'shadowColor' | 'shadowOffset' | 'shadowOpacity' | 'shadowRadius' | 'elevation'
>;

const make = (offsetY: number, radius: number, opacity: number, elevation: number): Shadow =>
  Platform.select<Shadow>({
    ios: {
      shadowColor: '#1B241C',
      shadowOffset: { width: 0, height: offsetY },
      shadowOpacity: opacity,
      shadowRadius: radius,
    },
    android: { elevation },
    default: {},
  }) ?? {};

export const shadows = {
  none: {} as Shadow,
  sm: make(1, 4, 0.04, 1),
  md: make(4, 12, 0.06, 3),
  lg: make(10, 22, 0.08, 6),
} as const;

export type ShadowKey = keyof typeof shadows;
