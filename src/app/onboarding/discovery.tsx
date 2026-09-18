import { useRouter } from 'expo-router';
import { Building2, Lightbulb, NotebookText } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { AppHeader } from '@/components/ui/AppHeader';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import type { IconType } from '@/components/ui/icon';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { useTheme } from '@/hooks/use-theme';
import { useStore } from '@/store';

const FEATURES: { icon: IconType; title: string; body: string }[] = [
  {
    icon: Building2,
    title: 'Explore companies',
    body: 'Browse real workplaces and the people who’ve been there.',
  },
  {
    icon: NotebookText,
    title: 'Read first-hand workplace experiences',
    body: 'Attributed stories from people who actually did the job.',
  },
  {
    icon: Lightbulb,
    title: 'Know what people wish they’d known',
    body: 'Understand the reality before you accept an offer.',
  },
];

export default function OnboardingDiscovery() {
  const { colors } = useTheme();
  const router = useRouter();
  const completeOnboarding = useStore((s) => s.completeOnboarding);

  const skip = () => {
    completeOnboarding();
    router.replace('/home');
  };

  return (
    <Screen
      edges={['top', 'bottom']}
      footer={
        <>
          <Button label="Continue" size="lg" onPress={() => router.push('/onboarding/identity')} />
          <Button label="Skip" variant="ghost" onPress={skip} />
        </>
      }>
      <AppHeader showBack />
      <View style={styles.body}>
        <Text variant="title" style={styles.title}>
          Better decisions start with real stories.
        </Text>

        <View style={styles.features}>
          {FEATURES.map((f) => (
            <View key={f.title} style={styles.feature}>
              <View style={[styles.iconWrap, { backgroundColor: colors.accentSoft }]}>
                <f.icon size={22} color={colors.accent} strokeWidth={2} />
              </View>
              <View style={styles.featureText}>
                <Text variant="subtitle">{f.title}</Text>
                <Text variant="body" color="textSecondary">
                  {f.body}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, justifyContent: 'center', gap: spacing.xxxl },
  title: { maxWidth: 420 },
  features: { gap: spacing.xl },
  feature: { flexDirection: 'row', gap: spacing.lg, alignItems: 'flex-start' },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: { flex: 1, gap: spacing.xs, paddingTop: spacing.xs },
});
