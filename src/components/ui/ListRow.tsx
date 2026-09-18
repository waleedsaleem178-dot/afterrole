import { ChevronRight } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { useTheme } from '@/hooks/use-theme';

import type { IconType } from './icon';
import { Text } from './Text';

export interface ListRowProps {
  icon?: IconType;
  label: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
  showChevron?: boolean;
  rightSlot?: ReactNode;
}

export function ListRow({
  icon: Icon,
  label,
  value,
  onPress,
  danger,
  showChevron = true,
  rightSlot,
}: ListRowProps) {
  const { colors } = useTheme();
  const labelColor = danger ? colors.danger : colors.textPrimary;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [styles.row, pressed && onPress ? { backgroundColor: colors.surface } : null]}>
      {Icon ? (
        <View style={[styles.iconWrap, { backgroundColor: danger ? colors.dangerSoft : colors.surface }]}>
          <Icon size={18} color={danger ? colors.danger : colors.textSecondary} strokeWidth={2} />
        </View>
      ) : null}
      <Text variant="bodyMedium" style={[styles.label, { color: labelColor }]} numberOfLines={1}>
        {label}
      </Text>
      {value ? (
        <Text variant="caption" color="textMuted" numberOfLines={1}>
          {value}
        </Text>
      ) : null}
      {rightSlot}
      {showChevron && onPress ? (
        <ChevronRight size={18} color={colors.textMuted} strokeWidth={2} />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    borderRadius: radius.sm,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { flex: 1 },
});
