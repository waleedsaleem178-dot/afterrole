import { useLocalSearchParams, useRouter } from 'expo-router';
import { Banknote, CircleCheck, FileCheck2, FileText, Lock, Mail } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { AppHeader } from '@/components/ui/AppHeader';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import type { IconType } from '@/components/ui/icon';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { useTheme } from '@/hooks/use-theme';
import { haptics } from '@/lib/haptics';
import { useStore } from '@/store';

const METHODS: { id: string; label: string; icon: IconType; hint: string }[] = [
  { id: 'email', label: 'Work email', icon: Mail, hint: 'Confirm with a company email address' },
  { id: 'employment', label: 'Employment document', icon: FileText, hint: 'Contract or employment letter' },
  { id: 'offer', label: 'Offer letter', icon: FileCheck2, hint: 'Signed offer of employment' },
  { id: 'pay', label: 'Pay document', icon: Banknote, hint: 'Payslip or pay statement' },
];

type Status = 'idle' | 'verifying' | 'done';

export default function VerifyEmploymentScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { employmentId } = useLocalSearchParams<{ employmentId?: string }>();

  const employment = useStore((s) => s.profile.employment);
  const verifyEmployment = useStore((s) => s.verifyEmployment);

  const [method, setMethod] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const targetId = employmentId ?? employment.find((e) => !e.verified)?.id;

  const startVerify = () => {
    setStatus('verifying');
    timer.current = setTimeout(() => {
      if (targetId) verifyEmployment(targetId);
      haptics.success();
      setStatus('done');
    }, 1300);
  };

  if (status === 'done') {
    return (
      <Screen edges={['top', 'bottom']}>
        <AppHeader showBack />
        <View style={styles.doneBody}>
          <View style={[styles.doneIcon, { backgroundColor: colors.successSoft }]}>
            <CircleCheck size={44} color={colors.success} strokeWidth={2} />
          </View>
          <Text variant="title" center>
            Employment verified
          </Text>
          <Text variant="bodyLarge" color="textSecondary" center style={styles.message}>
            Your role now shows a verified badge. This is a prototype — no documents were uploaded.
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
      footer={
        <Button
          label={status === 'verifying' ? 'Verifying…' : 'Verify now'}
          size="lg"
          disabled={!method || status === 'verifying'}
          onPress={startVerify}
        />
      }>
      <AppHeader showBack title="Verify your role" />

      <View style={styles.intro}>
        <Text variant="title">Verify your role</Text>
        <Text variant="bodyLarge" color="textSecondary">
          Verified employment gives workplace stories additional context.
        </Text>
      </View>

      <View style={styles.methods}>
        {METHODS.map((m) => {
          const selected = method === m.id;
          return (
            <Pressable
              key={m.id}
              onPress={() => {
                haptics.selection();
                setMethod(m.id);
              }}
              style={({ pressed }) => [
                styles.method,
                {
                  backgroundColor: selected ? colors.accentSoft : colors.surface,
                  borderColor: selected ? colors.accent : colors.border,
                },
                pressed && styles.pressed,
              ]}>
              <View style={[styles.methodIcon, { backgroundColor: colors.background }]}>
                <m.icon size={20} color={selected ? colors.accent : colors.textSecondary} strokeWidth={2} />
              </View>
              <View style={styles.flex}>
                <Text variant="callout">{m.label}</Text>
                <Text variant="small" color="textMuted">
                  {m.hint}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      {status === 'verifying' ? (
        <View style={styles.verifying}>
          <ActivityIndicator color={colors.accent} />
          <Text variant="body" color="textSecondary">
            Confirming your employment…
          </Text>
        </View>
      ) : null}

      <View style={[styles.privacy, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Lock size={16} color={colors.textMuted} strokeWidth={2} />
        <Text variant="small" color="textMuted" style={styles.flex}>
          Verification evidence is used only to confirm employment and is not shown publicly.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.lg },
  intro: { gap: spacing.sm },
  methods: { gap: spacing.md },
  method: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: { flex: 1 },
  pressed: { opacity: 0.8 },
  verifying: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, justifyContent: 'center' },
  privacy: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
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
