import {
  ActivityIndicator,
  Pressable,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';

import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { fontFamily } from '@/constants/typography';
import { useTheme } from '@/hooks/use-theme';
import { haptics } from '@/lib/haptics';

import type { IconType } from './icon';
import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  icon?: IconType;
  /** Icon shown after the label (e.g. a trailing arrow). */
  iconRight?: IconType;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  haptic?: boolean;
  style?: StyleProp<ViewStyle>;
}

const HEIGHTS: Record<Size, number> = { sm: 42, md: 50, lg: 56 };

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconRight: IconRight,
  disabled,
  loading,
  fullWidth = true,
  haptic = true,
  style,
}: ButtonProps) {
  const { colors } = useTheme();

  const bg: Record<Variant, string> = {
    primary: colors.forest,
    secondary: colors.surface,
    ghost: 'transparent',
    danger: colors.danger,
  };
  const fg: Record<Variant, string> = {
    primary: colors.accentForeground,
    secondary: colors.textPrimary,
    ghost: colors.accent,
    danger: colors.accentForeground,
  };
  const border = variant === 'secondary' ? colors.border : 'transparent';

  const handlePress = () => {
    if (disabled || loading) return;
    if (haptic) haptics.light();
    onPress?.();
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      onPress={handlePress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        {
          height: HEIGHTS[size],
          backgroundColor: bg[variant],
          borderColor: border,
          borderWidth: variant === 'secondary' ? StyleSheet.hairlineWidth : 0,
          opacity: disabled ? 0.45 : 1,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
          paddingHorizontal: fullWidth ? spacing.lg : spacing.xl,
        },
        pressed && !disabled && styles.pressed,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={fg[variant]} />
      ) : (
        <View style={styles.row}>
          {Icon ? <Icon size={18} color={fg[variant]} strokeWidth={2.2} /> : null}
          <Text
            style={{
              color: fg[variant],
              fontFamily: fontFamily.semibold,
              fontSize: size === 'sm' ? 14 : 16,
              letterSpacing: -0.1,
            }}>
            {label}
          </Text>
          {IconRight ? <IconRight size={18} color={fg[variant]} strokeWidth={2.2} /> : null}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  pressed: { transform: [{ scale: 0.98 }], opacity: 0.9 },
});
