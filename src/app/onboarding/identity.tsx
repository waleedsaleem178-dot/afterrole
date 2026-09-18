import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { VerifiedBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { StepDots } from '@/components/ui/StepDots';
import { Text } from '@/components/ui/Text';
import { AppHeader } from '@/components/ui/AppHeader';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { fontFamily } from '@/constants/typography';
import { useTheme } from '@/hooks/use-theme';
import { useStore } from '@/store';

export default function OnboardingIdentity() {
  const { colors } = useTheme();
  const router = useRouter();
  const completeOnboarding = useStore((s) => s.completeOnboarding);

  const exploreFirst = () => {
    completeOnboarding();
    router.replace('/home');
  };

  return (
    <Screen
      edges={['top', 'bottom']}
      footer={
        <View style={styles.footer}>
          <StepDots total={2} index={1} />
          <Button label="Build my profile" size="lg" iconRight={ArrowRight} onPress={() => router.push('/create-profile')} />
          <Button label="Explore first" variant="ghost" onPress={exploreFirst} />
        </View>
      }>
      <AppHeader showBack />
      <View style={styles.body}>
        <View style={styles.headingBlock}>
          <Text variant="title">Your career has context.</Text>
          <Text variant="bodyLarge" color="textSecondary" style={styles.support}>
            AfterRole stories come from real people with real professional histories.
          </Text>
        </View>

        <Card padded style={styles.sample}>
          <View style={styles.sampleHeader}>
            <Avatar name="Waleed Saleem" color={colors.accent} size={52} verified showVerified />
            <View style={styles.sampleHeaderText}>
              <View style={styles.nameRow}>
                <Text variant="subtitle">Waleed Saleem</Text>
                <VerifiedBadge />
              </View>
              <Text variant="body" color="textSecondary">
                CRM & Automation Specialist
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.borderSubtle }]} />

          <View style={styles.employment}>
            <View style={[styles.logo, { backgroundColor: colors.accentSubtle }]}>
              <Text style={{ color: colors.accent, fontWeight: fontFamily.bold, fontSize: 18 }}>A</Text>
            </View>
            <View style={styles.employmentText}>
              <Text variant="callout">AdVital</Text>
              <Text variant="small" color="textSecondary">
                Technical Specialist
              </Text>
              <Text variant="small" color="textMuted">
                Aug 2026 – Present
              </Text>
            </View>
            <VerifiedBadge label="Verified" />
          </View>
        </Card>

        <Text variant="body" color="textSecondary" center style={styles.note}>
          Your profile gives every workplace story context.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, justifyContent: 'center', gap: spacing.xl },
  headingBlock: { gap: spacing.md },
  support: { maxWidth: 380 },
  sample: { gap: spacing.lg },
  sampleHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  sampleHeaderText: { flex: 1, gap: 2 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  divider: { height: StyleSheet.hairlineWidth },
  employment: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  logo: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  employmentText: { flex: 1, gap: 1 },
  note: { marginTop: spacing.xs },
  footer: { gap: spacing.md },
});
