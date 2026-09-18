import { Pressable, type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';

import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { fontFamily } from '@/constants/typography';
import { useTheme } from '@/hooks/use-theme';
import { haptics } from '@/lib/haptics';

import type { IconType } from './icon';
import { Text } from './Text';

export interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: IconType;
  size?: 'sm' | 'md';
  style?: StyleProp<ViewStyle>;
}

export function Chip({ label, selected, onPress, icon: Icon, size = 'md', style }: ChipProps) {
  const { colors } = useTheme();
  const height = size === 'sm' ? 28 : 36;
  const fg = selected ? colors.accent : colors.textSecondary;

  const content = (
    <View
      style={[
        styles.base,
        {
          height,
          borderRadius: radius.pill,
          paddingHorizontal: size === 'sm' ? spacing.md : spacing.lg,
          backgroundColor: selected ? colors.accentSoft : colors.surface,
          borderColor: selected ? colors.accent : colors.border,
        },
        style,
      ]}>
      {Icon ? <Icon size={size === 'sm' ? 13 : 15} color={fg} strokeWidth={2.2} /> : null}
      <Text
        style={{
          color: fg,
          fontFamily: selected ? fontFamily.semibold : fontFamily.medium,
          fontSize: size === 'sm' ? 12 : 13,
        }}>
        {label}
      </Text>
    </View>
  );

  if (!onPress) return content;
  return (
    <Pressable
      onPress={() => {
        haptics.selection();
        onPress();
      }}
      style={({ pressed }) => pressed && styles.pressed}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: StyleSheet.hairlineWidth,
  },
  pressed: { opacity: 0.7 },
});
