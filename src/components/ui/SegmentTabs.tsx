import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { spacing } from '@/constants/spacing';
import { useTheme } from '@/hooks/use-theme';

import { Text } from './Text';

export interface SegmentTabsProps {
  tabs: readonly string[];
  value: string;
  onChange: (tab: string) => void;
  scrollable?: boolean;
}

/** Thin, quiet underline tabs (company / profile). Never thick browser tabs. */
export function SegmentTabs({ tabs, value, onChange, scrollable }: SegmentTabsProps) {
  const { colors } = useTheme();

  const row = tabs.map((t) => {
    const active = t === value;
    return (
      <Pressable key={t} onPress={() => onChange(t)} style={styles.tab} hitSlop={6}>
        <Text variant="callout" style={{ color: active ? colors.textPrimary : colors.textMuted }}>
          {t}
        </Text>
        <View style={[styles.underline, { backgroundColor: active ? colors.forest : 'transparent' }]} />
      </Pressable>
    );
  });

  if (scrollable) {
    return (
      <View style={[styles.wrap, { borderBottomColor: colors.borderSubtle }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {row}
        </ScrollView>
      </View>
    );
  }

  return <View style={[styles.wrap, styles.spread, { borderBottomColor: colors.borderSubtle }]}>{row}</View>;
}

const styles = StyleSheet.create({
  wrap: { borderBottomWidth: StyleSheet.hairlineWidth },
  spread: { flexDirection: 'row', gap: spacing.xl },
  scroll: { gap: spacing.xl },
  tab: { paddingBottom: spacing.md, gap: spacing.sm, alignItems: 'center' },
  underline: { height: 2, borderRadius: 2, alignSelf: 'stretch', minWidth: 24 },
});
