import { useRouter } from 'expo-router';
import { StyleSheet, Switch, View } from 'react-native';

import { AppHeader } from '@/components/ui/AppHeader';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Input } from '@/components/ui/Input';
import { ProgressIndicator } from '@/components/ui/ProgressIndicator';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { mockCompanies } from '@/data';
import { useTheme } from '@/hooks/use-theme';
import { useStore } from '@/store';
import type { EmploymentEndReason } from '@/types';

const END_REASONS: EmploymentEndReason[] = [
  'Resigned',
  'Laid off',
  'Contract ended',
  'Terminated',
  'Still employed',
  'Prefer not to say',
];

export default function CreateStep1() {
  const { colors } = useTheme();
  const router = useRouter();
  const draft = useStore((s) => s.draft);
  const setDraft = useStore((s) => s.setDraft);

  const canContinue = Boolean(draft.companyId && draft.role?.trim());

  return (
    <Screen
      scroll
      keyboardAware
      edges={['top', 'bottom']}
      contentStyle={styles.content}
      footer={
        <Button
          label="Next"
          size="lg"
          disabled={!canContinue}
          onPress={() => router.push('/create/step-2')}
        />
      }>
      <AppHeader showBack title="New story" />
      <ProgressIndicator step={1} total={3} />

      <View style={styles.intro}>
        <Text variant="title">Share your story</Text>
        <Text variant="bodyLarge" color="textSecondary">
          Your experience could help someone make a better decision.
        </Text>
      </View>

      <View style={styles.field}>
        <Text variant="label" color="textSecondary">
          Where did you work?
        </Text>
        <View style={styles.wrap}>
          {mockCompanies.map((c) => (
            <Chip
              key={c.id}
              label={c.name}
              selected={draft.companyId === c.id}
              onPress={() => setDraft({ companyId: c.id, companyName: c.name })}
            />
          ))}
        </View>
      </View>

      <Input
        label="What was your role?"
        value={draft.role ?? ''}
        onChangeText={(v) => setDraft({ role: v })}
        placeholder="e.g. Marketing Manager"
      />

      <View style={styles.dates}>
        <Input
          label="Started"
          value={draft.startLabel ?? ''}
          onChangeText={(v) => setDraft({ startLabel: v })}
          placeholder="e.g. 2023"
          containerStyle={styles.flex}
        />
        <Input
          label="Ended"
          value={draft.current ? 'Present' : (draft.endLabel ?? '')}
          onChangeText={(v) => setDraft({ endLabel: v })}
          editable={!draft.current}
          placeholder="e.g. 2025"
          containerStyle={styles.flex}
        />
      </View>

      <View style={[styles.toggleRow, { borderColor: colors.border }]}>
        <Text variant="bodyMedium">I still work here</Text>
        <Switch
          value={Boolean(draft.current)}
          onValueChange={(v) =>
            setDraft({ current: v, endLabel: v ? 'Present' : '', endReason: v ? 'Still employed' : draft.endReason })
          }
          trackColor={{ true: colors.accent, false: colors.borderStrong }}
          thumbColor="#FFFFFF"
        />
      </View>

      <View style={styles.field}>
        <Text variant="label" color="textSecondary">
          How did your employment end?
        </Text>
        <View style={styles.wrap}>
          {END_REASONS.map((r) => (
            <Chip
              key={r}
              label={r}
              selected={draft.endReason === r}
              onPress={() => setDraft({ endReason: r })}
            />
          ))}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.lg },
  intro: { gap: spacing.sm },
  field: { gap: spacing.sm },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  dates: { flexDirection: 'row', gap: spacing.md },
  flex: { flex: 1 },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.input,
  },
});
