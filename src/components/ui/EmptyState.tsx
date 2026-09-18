import { StyleSheet, View } from 'react-native';

import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { useTheme } from '@/hooks/use-theme';

import { Button } from './Button';
import type { IconType } from './icon';
import { Text } from './Text';

export interface EmptyStateProps {
  icon?: IconType;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon: Icon, title, message, actionLabel, onAction }: EmptyStateProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      {Icon ? (
        <View
          style={[
            styles.iconWrap,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}>
          <Icon size={26} color={colors.textMuted} strokeWidth={1.8} />
        </View>
      ) : null}
      <Text variant="subtitle" center>
        {title}
      </Text>
      {message ? (
        <Text variant="body" color="textSecondary" center style={styles.message}>
          {message}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} fullWidth={false} size="sm" style={styles.action} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: spacing.huge, gap: spacing.md },
  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: spacing.xs,
  },
  message: { maxWidth: 320 },
  action: { marginTop: spacing.sm },
});
