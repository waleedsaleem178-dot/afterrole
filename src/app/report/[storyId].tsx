import { useLocalSearchParams, useRouter } from 'expo-router';
import { Check, CircleCheck } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppHeader } from '@/components/ui/AppHeader';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { useTheme } from '@/hooks/use-theme';
import { haptics } from '@/lib/haptics';
import { useStore } from '@/store';

const REASONS = [
  'Harassment',
  'Personal information',
  'Spam',
  'Not a first-hand experience',
  'False identity',
  'Threats',
  'Hate or abuse',
  'Other',
];

export default function ReportStoryScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { storyId } = useLocalSearchParams<{ storyId: string }>();
  const reportStory = useStore((s) => s.reportStory);

  const [reason, setReason] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const submit = () => {
    if (!reason) return;
    if (storyId) reportStory(storyId);
    haptics.success();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Screen edges={['top', 'bottom']}>
        <AppHeader title="Report" />
        <View style={styles.doneBody}>
          <View style={[styles.doneIcon, { backgroundColor: colors.successSoft }]}>
            <CircleCheck size={44} color={colors.success} strokeWidth={2} />
          </View>
          <Text variant="title" center>
            Report submitted
          </Text>
          <Text variant="bodyLarge" color="textSecondary" center style={styles.message}>
            Thanks — our team will review this against the community guidelines.
          </Text>
        </View>
        <Button label="Done" size="lg" onPress={() => router.back()} />
      </Screen>
    );
  }

  return (
    <Screen
      scroll
      edges={['top', 'bottom']}
      contentStyle={styles.content}
      footer={<Button label="Submit report" size="lg" disabled={!reason} onPress={submit} />}>
      <AppHeader title="Report story" rightSlot={<CloseButton onPress={() => router.back()} />} />

      <Text variant="body" color="textSecondary">
        Why are you reporting this story?
      </Text>

      <View style={styles.options}>
        {REASONS.map((r) => {
          const selected = reason === r;
          return (
            <Pressable
              key={r}
              onPress={() => {
                haptics.selection();
                setReason(r);
              }}
              style={({ pressed }) => [
                styles.option,
                {
                  backgroundColor: selected ? colors.accentSoft : colors.surface,
                  borderColor: selected ? colors.accent : colors.border,
                },
                pressed && styles.pressed,
              ]}>
              <Text variant="bodyMedium" style={styles.flex} color={selected ? 'accent' : 'textPrimary'}>
                {r}
              </Text>
              {selected ? <Check size={18} color={colors.accent} strokeWidth={2.6} /> : null}
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}

function CloseButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} hitSlop={8}>
      <Text variant="label" color="textSecondary">
        Cancel
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.lg },
  options: { gap: spacing.sm },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
  flex: { flex: 1 },
  pressed: { opacity: 0.8 },
  doneBody: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  doneIcon: {
    width: 88,
    height: 88,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: { maxWidth: 340 },
});
