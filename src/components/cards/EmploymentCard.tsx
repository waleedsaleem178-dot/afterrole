import { StyleSheet, View } from 'react-native';

import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { fontFamily } from '@/constants/typography';
import { useTheme } from '@/hooks/use-theme';
import type { Employment } from '@/types';

import { VerifiedBadge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Text } from '../ui/Text';

export interface EmploymentCardProps {
  employment: Employment;
  onVerify?: () => void;
  onPress?: () => void;
}

export function EmploymentCard({ employment, onVerify, onPress }: EmploymentCardProps) {
  const { colors } = useTheme();
  const period = `${employment.startLabel} – ${employment.endLabel}`;

  return (
    <Card padded onPress={onPress}>
      <View style={styles.row}>
        <View style={[styles.logo, { backgroundColor: colors.accentSubtle }]}>
          <Text style={{ color: colors.accent, fontWeight: fontFamily.bold, fontSize: 18 }}>
            {employment.companyName.charAt(0)}
          </Text>
        </View>
        <View style={styles.info}>
          <Text variant="callout" numberOfLines={1}>
            {employment.companyName}
          </Text>
          <Text variant="small" color="textSecondary" numberOfLines={1}>
            {employment.role}
          </Text>
          <Text variant="small" color="textMuted" numberOfLines={1}>
            {period}
            {employment.location ? ` · ${employment.location}` : ''}
          </Text>
          <View style={styles.badgeRow}>
            {employment.verified ? (
              <VerifiedBadge label="Verified Role" />
            ) : onVerify ? (
              <Button label="Verify role" variant="secondary" size="sm" fullWidth={false} onPress={onVerify} />
            ) : (
              <Text variant="small" color="textMuted">
                Unverified
              </Text>
            )}
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.md },
  logo: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1, gap: 2 },
  badgeRow: { marginTop: spacing.xs, flexDirection: 'row', alignItems: 'center' },
});
