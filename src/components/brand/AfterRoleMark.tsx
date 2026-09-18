import { Image } from 'expo-image';
import type { StyleProp, ImageStyle } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

// Real brand marks (open-door symbol) from the AfterRole brand kit.
const MARKS = {
  forest: require('@/assets/brand/afterrole-mark-forest.png'),
  ivory: require('@/assets/brand/afterrole-mark-ivory.png'),
};

export interface AfterRoleMarkProps {
  size?: number;
  /** Force a variant; defaults to forest on light, ivory on dark. */
  variant?: 'forest' | 'ivory';
  style?: StyleProp<ImageStyle>;
}

/** AfterRole open-door mark. Raster brand asset, light/dark aware. */
export function AfterRoleMark({ size = 32, variant, style }: AfterRoleMarkProps) {
  const { isDark } = useTheme();
  const v = variant ?? (isDark ? 'ivory' : 'forest');
  return (
    <Image
      source={MARKS[v]}
      style={[{ width: size, height: size }, style]}
      contentFit="contain"
      accessibilityLabel="AfterRole"
    />
  );
}
