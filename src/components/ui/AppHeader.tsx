import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { spacing } from '@/constants/spacing';
import { useTheme } from '@/hooks/use-theme';

import { IconButton } from './IconButton';
import { Text } from './Text';

export interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
  bordered?: boolean;
}

export function AppHeader({
  title,
  subtitle,
  showBack,
  onBack,
  leftSlot,
  rightSlot,
  bordered,
}: AppHeaderProps) {
  const { colors } = useTheme();
  const router = useRouter();

  const handleBack = () => {
    if (onBack) onBack();
    else if (router.canGoBack()) router.back();
  };

  return (
    <View
      style={[
        styles.container,
        bordered && { borderBottomColor: colors.border, borderBottomWidth: StyleSheet.hairlineWidth },
      ]}>
      <View style={styles.side}>
        {showBack ? (
          <IconButton
            icon={ChevronLeft}
            accessibilityLabel="Go back"
            onPress={handleBack}
            variant="surface"
            haptic={false}
          />
        ) : (
          leftSlot
        )}
      </View>

      <View style={styles.center}>
        {title ? (
          <Text variant="callout" numberOfLines={1}>
            {title}
          </Text>
        ) : null}
        {subtitle ? (
          <Text variant="small" color="textMuted" numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      <View style={[styles.side, styles.right]}>{rightSlot}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    gap: spacing.sm,
  },
  side: { minWidth: 40, justifyContent: 'center' },
  right: { alignItems: 'flex-end' },
  center: { flex: 1, alignItems: 'center' },
});
