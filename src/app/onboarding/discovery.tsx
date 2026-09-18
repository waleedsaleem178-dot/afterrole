import { useRouter } from 'expo-router';
import { ArrowRight, Building2, Lightbulb, NotebookText } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import type { IconType } from '@/components/ui/icon';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { useTheme } from '@/hooks/use-theme';
import { StepDots } from '@/components/ui/StepDots';
import { useStore } from '@/store';

const FEATURES: { icon: IconType; title: string; body: string }[] = [
  { icon: Building2, title: 'Explore companies', body: 'See the real inside story.' },
  { icon: NotebookText, title: 'Read workplace stories', body: 'Understand what people experienced.' },
  { icon: Lightbulb, title: 'Make informed decisions', body: 'Know what people wish they had known.' },
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
        <View style={styles.footer}>
          <StepDots total={2} index={0} />
          <Button label="Continue" size="lg" iconRight={ArrowRight} onPress={() => router.push('/onboarding/identity')} />
        </View>
      }>
      <View style={styles.topBar}>
        <Pressable onPress={skip} hitSlop={10}>
          <Text variant="label" color="textSecondary">
            Skip
          </Text>
        </Pressable>
      </View>

      <View style={styles.body}>
        <View style={styles.headingBlock}>
          <Text variant="title" style={styles.title}>
            Better decisions{'\n'}start with real stories.
          </Text>
          <Text variant="bodyLarge" color="textSecondary" style={styles.support}>
            Read and share workplace experiences from people who&apos;ve actually been there.
          </Text>
        </View>

        <View style={styles.features}>
          {FEATURES.map((f) => (
            <View key={f.title} style={styles.feature}>
              <View style={[styles.iconWrap, { backgroundColor: colors.accentSubtle }]}>
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
  topBar: { flexDirection: 'row', justifyContent: 'flex-end', minHeight: 32, alignItems: 'center' },
  body: { flex: 1, justifyContent: 'center', gap: spacing.xxxl },
  headingBlock: { gap: spacing.md },
  title: { maxWidth: 360 },
  support: { maxWidth: 380 },
  features: { gap: spacing.xl },
  feature: { flexDirection: 'row', gap: spacing.lg, alignItems: 'center' },
  iconWrap: {
    width: 50,
    height: 50,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: { flex: 1, gap: 3 },
  footer: { gap: spacing.lg, alignItems: 'stretch' },
});
