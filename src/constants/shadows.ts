import { Platform, type ViewStyle } from 'react-native';

/**
 * Elevation presets. iOS uses shadow*, Android uses elevation. Values are kept
 * soft/premium; the redesign phase can tune them in one place.
 */
type Shadow = Pick<
  ViewStyle,
  'shadowColor' | 'shadowOffset' | 'shadowOpacity' | 'shadowRadius' | 'elevation'
>;

const make = (
  offsetY: number,
  radius: number,
  opacity: number,
  elevation: number,
): Shadow =>
  Platform.select<Shadow>({
    ios: {
      shadowColor: '#0B1220',
      shadowOffset: { width: 0, height: offsetY },
      shadowOpacity: opacity,
      shadowRadius: radius,
    },
    android: { elevation },
    default: {},
  }) ?? {};

export const shadows = {
  none: {} as Shadow,
  sm: make(2, 6, 0.08, 2),
  md: make(6, 16, 0.1, 5),
  lg: make(12, 28, 0.14, 10),
} as const;

export type ShadowKey = keyof typeof shadows;
