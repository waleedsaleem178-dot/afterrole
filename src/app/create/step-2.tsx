import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppHeader } from '@/components/ui/AppHeader';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { ProgressIndicator } from '@/components/ui/ProgressIndicator';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { spacing } from '@/constants/spacing';
import { haptics } from '@/lib/haptics';
import { useStore } from '@/store';

const REASONS = [
  'Management',
  'Pay',
  'Burnout',
  'Career growth',
  'Work-life balance',
  'Culture',
  'Relocation',
  'Better opportunity',
  'Layoff',
  'Return to office',
  "Job wasn't as advertised",
  'Team changes',
  'Leadership changes',
  'Benefits',
  'Commute',
  'Personal reasons',
  'Other',
];

const MAX_FACTORS = 3;

export default function CreateStep2() {
  const router = useRouter();
  const draft = useStore((s) => s.draft);
  const setDraft = useStore((s) => s.setDraft);

  const toggleReason = (r: string) => {
    const next = draft.topics.includes(r)
      ? draft.topics.filter((t) => t !== r)
      : [...draft.topics, r];
    // Keep top factors a subset of chosen reasons.
    const topFactors = draft.topFactors.filter((t) => next.includes(t));
    setDraft({ topics: next, topFactors });
  };

  const toggleFactor = (r: string) => {
    if (draft.topFactors.includes(r)) {
      setDraft({ topFactors: draft.topFactors.filter((t) => t !== r) });
    } else if (draft.topFactors.length < MAX_FACTORS) {
      haptics.selection();
      setDraft({ topFactors: [...draft.topFactors, r] });
    }
  };

  return (
    <Screen
      scroll
      edges={['top', 'bottom']}
      contentStyle={styles.content}
      footer={
        <View style={styles.footer}>
          <Button label="Back" variant="secondary" fullWidth={false} onPress={() => router.back()} style={styles.flex} />
          <Button
            label="Next"
            fullWidth={false}
            disabled={draft.topics.length === 0}
            onPress={() => router.push('/create/step-3')}
            style={styles.flex}
          />
        </View>
      }>
      <AppHeader showBack title="New story" />
      <ProgressIndicator step={2} total={3} />

      <View style={styles.intro}>
        <Text variant="title">Why did you leave?</Text>
        <Text variant="bodyLarge" color="textSecondary">
          Select everything that influenced your decision.
        </Text>
      </View>
      <View style={styles.wrap}>
        {REASONS.map((r) => (
          <Chip key={r} label={r} selected={draft.topics.includes(r)} onPress={() => toggleReason(r)} />
        ))}
      </View>

      {draft.topics.length > 0 ? (
        <View style={styles.factors}>
          <Text variant="subtitle">Which factors mattered most?</Text>
          <Text variant="small" color="textMuted">
            Pick up to {MAX_FACTORS}.
          </Text>
          <View style={styles.wrap}>
            {draft.topics.map((r) => (
              <Chip
                key={r}
                label={r}
                selected={draft.topFactors.includes(r)}
                onPress={() => toggleFactor(r)}
              />
            ))}
          </View>
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.md },
  intro: { gap: spacing.sm },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.xs },
  factors: { gap: spacing.xs, marginTop: spacing.lg },
  footer: { flexDirection: 'row', gap: spacing.md },
  flex: { flex: 1 },
});
