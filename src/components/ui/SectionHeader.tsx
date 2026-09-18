import { Pressable, StyleSheet, View } from 'react-native';

import { spacing } from '@/constants/spacing';
import { useTheme } from '@/hooks/use-theme';

import { Text } from './Text';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: () => void;
}

export function SectionHeader({ title, subtitle, actionLabel, onActionPress }: SectionHeaderProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <View style={styles.textCol}>
        <Text variant="subtitle">{title}</Text>
        {subtitle ? (
          <Text variant="caption" color="textSecondary" style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {actionLabel && onActionPress ? (
        <Pressable onPress={onActionPress} hitSlop={8} style={({ pressed }) => pressed && styles.pressed}>
          <Text variant="label" style={{ color: colors.accent }}>
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  textCol: { flex: 1, gap: 2 },
  subtitle: { marginTop: 2 },
  pressed: { opacity: 0.6 },
});
