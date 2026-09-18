import { BadgeCheck } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { fontFamily } from '@/constants/typography';
import { useTheme } from '@/hooks/use-theme';

import { Text } from './Text';

type Tone = 'neutral' | 'accent' | 'success' | 'danger' | 'warning';

export interface BadgeProps {
  label: string;
  tone?: Tone;
}

export function Badge({ label, tone = 'neutral' }: BadgeProps) {
  const { colors } = useTheme();
  const map = {
    neutral: { bg: colors.surface, fg: colors.textSecondary },
    accent: { bg: colors.accentSoft, fg: colors.accent },
    success: { bg: colors.successSoft, fg: colors.success },
    danger: { bg: colors.dangerSoft, fg: colors.danger },
    warning: { bg: colors.warningSoft, fg: colors.warning },
  }[tone];

  return (
    <View style={[styles.badge, { backgroundColor: map.bg }]}>
      <Text style={{ color: map.fg, fontFamily: fontFamily.semibold, fontSize: 11 }}>{label}</Text>
    </View>
  );
}

export interface VerifiedBadgeProps {
  label?: string;
  size?: number;
}

/** Inline verified indicator — a check + optional label (e.g. "Verified Role"). */
export function VerifiedBadge({ label, size = 14 }: VerifiedBadgeProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <BadgeCheck size={size} color={colors.verified} strokeWidth={2.4} />
      {label ? (
        <Text style={{ color: colors.verified, fontFamily: fontFamily.medium, fontSize: 12 }}>
          {label}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 3 },
});
