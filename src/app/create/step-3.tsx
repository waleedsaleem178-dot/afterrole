import { useRouter } from 'expo-router';
import { Check, Minus, ThumbsDown, ThumbsUp } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { AppHeader } from '@/components/ui/AppHeader';
import { VerifiedBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressIndicator } from '@/components/ui/ProgressIndicator';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { TextArea } from '@/components/ui/TextArea';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { useTheme } from '@/hooks/use-theme';
import { haptics } from '@/lib/haptics';
import { useStore } from '@/store';
import type { WouldWorkAgain } from '@/types';

const WWA: WouldWorkAgain[] = ['Yes', 'Maybe', 'No'];

export default function CreateStep3() {
  const { colors } = useTheme();
  const router = useRouter();
  const draft = useStore((s) => s.draft);
  const setDraft = useStore((s) => s.setDraft);
  const publishStory = useStore((s) => s.publishStory);
  const profile = useStore((s) => s.profile);

  const canPublish = Boolean(draft.body?.trim() && draft.confirmed && draft.companyId);
  const context = `${draft.current ? 'Current' : 'Former'} ${draft.role ?? profile.headline}${
    draft.companyName ? ` at ${draft.companyName}` : ''
  }`;

  const publish = () => {
    const story = publishStory();
    if (!story) return;
    haptics.light();
    router.replace({ pathname: '/create/success', params: { id: story.id } });
  };

  return (
    <Screen
      scroll
      keyboardAware
      edges={['top', 'bottom']}
      contentStyle={styles.content}
      footer={<Button label="Publish story" size="lg" disabled={!canPublish} onPress={publish} />}>
      <AppHeader showBack title="New story" />
      <ProgressIndicator step={3} total={3} />

      <Text variant="title">Tell the story</Text>

      <TextArea
        label="What do you wish you'd known before accepting the job?"
        value={draft.body ?? ''}
        onChangeText={(v) => setDraft({ body: v })}
        placeholder="Share what the role was really like…"
        minHeight={140}
      />

      <TextArea
        label="What was the final straw? (optional)"
        value={draft.finalStraw ?? ''}
        onChangeText={(v) => setDraft({ finalStraw: v })}
        placeholder="The moment you knew…"
        minHeight={80}
      />

      <TextArea
        label="What was good? (optional)"
        value={draft.whatWasGood ?? ''}
        onChangeText={(v) => setDraft({ whatWasGood: v })}
        placeholder="Credit where it's due…"
        minHeight={80}
      />

      <View style={styles.field}>
        <Text variant="label" color="textSecondary">
          Would you work there again?
        </Text>
        <View style={styles.wwaRow}>
          {WWA.map((w) => (
            <WwaOption key={w} value={w} selected={draft.wouldWorkAgain === w} onPress={() => setDraft({ wouldWorkAgain: w })} />
          ))}
        </View>
      </View>

      {/* Identity preview — no anonymous option */}
      <View style={styles.field}>
        <Text variant="overline" color="textMuted">
          Your story will appear as
        </Text>
        <Card padded>
          <View style={styles.previewRow}>
            <Avatar name={profile.name} color={profile.avatarColor} size={44} verified={profile.verified} showVerified />
            <View style={styles.flex}>
              <View style={styles.nameRow}>
                <Text variant="callout">{profile.name}</Text>
                {profile.verified ? <VerifiedBadge /> : null}
              </View>
              <Text variant="small" color="textSecondary">
                {profile.headline}
              </Text>
              <Text variant="small" color="textMuted">
                {context}
              </Text>
            </View>
          </View>
        </Card>
      </View>

      {/* Confirm */}
      <Pressable
        style={styles.confirm}
        onPress={() => {
          haptics.selection();
          setDraft({ confirmed: !draft.confirmed });
        }}>
        <View
          style={[
            styles.checkbox,
            {
              backgroundColor: draft.confirmed ? colors.accent : 'transparent',
              borderColor: draft.confirmed ? colors.accent : colors.borderStrong,
            },
          ]}>
          {draft.confirmed ? <Check size={14} color={colors.accentForeground} strokeWidth={3} /> : null}
        </View>
        <Text variant="body" color="textSecondary" style={styles.flex}>
          I confirm this reflects my own workplace experience.
        </Text>
      </Pressable>
    </Screen>
  );
}

function WwaOption({
  value,
  selected,
  onPress,
}: {
  value: WouldWorkAgain;
  selected: boolean;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  const tone =
    value === 'Yes'
      ? { bg: colors.successSoft, fg: colors.success, Icon: ThumbsUp }
      : value === 'No'
        ? { bg: colors.dangerSoft, fg: colors.danger, Icon: ThumbsDown }
        : { bg: colors.surfaceSunken, fg: colors.textSecondary, Icon: Minus };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={() => {
        haptics.selection();
        onPress();
      }}
      style={({ pressed }) => [
        styles.wwaCard,
        {
          backgroundColor: selected ? tone.bg : colors.surface,
          borderColor: selected ? tone.fg : colors.border,
          borderWidth: selected ? 1.5 : StyleSheet.hairlineWidth,
        },
        pressed && { opacity: 0.85 },
      ]}>
      <tone.Icon size={18} color={selected ? tone.fg : colors.textMuted} strokeWidth={2.2} />
      <Text variant="callout" style={{ color: selected ? tone.fg : colors.textSecondary }}>
        {value}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.lg },
  field: { gap: spacing.sm },
  wwaRow: { flexDirection: 'row', gap: spacing.sm },
  wwaCard: {
    flex: 1,
    height: 64,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  previewRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  flex: { flex: 1 },
  confirm: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.xs },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: radius.sm,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
