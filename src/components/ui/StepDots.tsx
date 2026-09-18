import { StyleSheet, View } from 'react-native';

import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { useTheme } from '@/hooks/use-theme';

export interface StepDotsProps {
  total: number;
  /** 0-based active index. */
  index: number;
}

/** Small progress dots — the active dot elongates into a pill. */
export function StepDots({ total, index }: StepDotsProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, i) => {
        const active = i === index;
        return (
          <View
            key={i}
            style={{
              width: active ? 22 : 7,
              height: 7,
              borderRadius: radius.pill,
              backgroundColor: active ? colors.forest : colors.border,
            }}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
});
