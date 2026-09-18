import { useEffect, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { useTheme } from '@/hooks/use-theme';

import { Text } from './Text';

export interface TopicBarProps {
  label: string;
  /** 0–100. */
  percent: number;
  /** Stagger index for a gentle cascade on mount. */
  index?: number;
}

/** Understated horizontal bar that fills gently on first render. */
export function TopicBar({ label, percent, index = 0 }: TopicBarProps) {
  const { colors } = useTheme();
  const [anim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const a = Animated.timing(anim, {
      toValue: 1,
      duration: 650,
      delay: 80 * index,
      useNativeDriver: false,
    });
    a.start();
    return () => a.stop();
  }, [anim, index]);

  const width = anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', `${percent}%`] });

  return (
    <View style={styles.row}>
      <View style={styles.labelRow}>
        <Text variant="bodyMedium">{label}</Text>
        <Text variant="small" color="textMuted">
          {percent}%
        </Text>
      </View>
      <View style={[styles.track, { backgroundColor: colors.surfaceSunken }]}>
        <Animated.View style={[styles.fill, { width, backgroundColor: colors.accent }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { gap: spacing.sm },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  track: { height: 8, borderRadius: radius.pill, overflow: 'hidden' },
  fill: { height: 8, borderRadius: radius.pill },
});
