import { Pressable, type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';

import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { fontFamily } from '@/constants/typography';
import { useTheme } from '@/hooks/use-theme';
import { haptics } from '@/lib/haptics';

import type { IconType } from './icon';
import { Text } from './Text';

/**
 * `sage`  — selected = soft sage fill, forest text (reasons, tabs, tags).
 * `forest`— selected = deep forest fill, ivory text (category filters).
 */
export type ChipTone = 'sage' | 'forest';

export interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: IconType;
  size?: 'sm' | 'md';
  tone?: ChipTone;
  style?: StyleProp<ViewStyle>;
}

export function Chip({ label, selected, onPress, icon: Icon, size = 'md', tone = 'sage', style }: ChipProps) {
  const { colors } = useTheme();
  const height = size === 'sm' ? 30 : 36;

  let bg = colors.surface;
  let fg = colors.textSecondary;
  let border = colors.border;
  if (selected) {
    if (tone === 'forest') {
      bg = colors.forest;
      fg = colors.accentForeground;
      border = colors.forest;
    } else {
      bg = colors.accentSoft;
      fg = colors.accent;
      border = colors.accentSoft;
    }
  }

  const content = (
    <View
      style={[
        styles.base,
        {
          height,
          borderRadius: radius.pill,
          paddingHorizontal: size === 'sm' ? spacing.md : spacing.lg,
          backgroundColor: bg,
          borderColor: border,
        },
        style,
      ]}>
      {Icon ? <Icon size={size === 'sm' ? 13 : 15} color={fg} strokeWidth={2.2} /> : null}
      <Text
        style={{
          color: fg,
          fontWeight: selected ? fontFamily.semibold : fontFamily.medium,
          fontSize: size === 'sm' ? 12.5 : 13.5,
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
