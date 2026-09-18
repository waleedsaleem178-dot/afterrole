import { Pressable, type StyleProp, StyleSheet, type ViewStyle } from 'react-native';

import { radius } from '@/constants/radius';
import { useTheme } from '@/hooks/use-theme';
import { haptics } from '@/lib/haptics';

import type { IconType } from './icon';

type Variant = 'plain' | 'surface' | 'accent';

export interface IconButtonProps {
  icon: IconType;
  onPress?: () => void;
  accessibilityLabel: string;
  variant?: Variant;
  size?: number;
  color?: string;
  active?: boolean;
  haptic?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function IconButton({
  icon: Icon,
  onPress,
  accessibilityLabel,
  variant = 'plain',
  size = 40,
  color,
  active,
  haptic = true,
  style,
}: IconButtonProps) {
  const { colors } = useTheme();

  const bg =
    variant === 'surface' ? colors.surface : variant === 'accent' ? colors.forest : 'transparent';
  const iconColor =
    color ?? (variant === 'accent' ? colors.accentForeground : active ? colors.accent : colors.textSecondary);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      onPress={() => {
        if (haptic) haptics.light();
        onPress?.();
      }}
      style={({ pressed }) => [
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: radius.pill,
          backgroundColor: bg,
          borderColor: variant === 'surface' ? colors.border : 'transparent',
          borderWidth: variant === 'surface' ? StyleSheet.hairlineWidth : 0,
        },
        pressed && styles.pressed,
        style,
      ]}>
      <Icon size={Math.round(size * 0.5)} color={iconColor} strokeWidth={2} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
  pressed: { transform: [{ scale: 0.92 }], opacity: 0.7 },
});
