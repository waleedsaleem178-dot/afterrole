import { StyleSheet, View } from 'react-native';

import { Card } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';
import { spacing } from '@/constants/spacing';
import { radius } from '@/constants/radius';

/** Placeholder that mirrors StoryCard's shape while content loads. */
export function StoryCardSkeleton() {
  return (
    <Card padded>
      <View style={styles.header}>
        <Skeleton width={42} height={42} radius={radius.pill} />
        <View style={styles.headerText}>
          <Skeleton width="45%" height={13} />
          <Skeleton width="65%" height={11} />
          <Skeleton width="55%" height={11} />
        </View>
      </View>
      <View style={styles.body}>
        <Skeleton width="100%" height={12} />
        <Skeleton width="92%" height={12} />
        <Skeleton width="70%" height={12} />
      </View>
      <View style={styles.tags}>
        <Skeleton width={64} height={24} radius={radius.pill} />
        <Skeleton width={80} height={24} radius={radius.pill} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  headerText: { flex: 1, gap: 6 },
  body: { gap: 8, marginTop: spacing.lg },
  tags: { flexDirection: 'row', gap: spacing.xs, marginTop: spacing.lg },
});
