import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { AppHeader } from '@/components/ui/AppHeader';
import { VerifiedBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
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
        <>
          <Button label="Build my profile" size="lg" onPress={() => router.push('/create-profile')} />
          <Button label="Explore first" variant="ghost" onPress={exploreFirst} />
        </>
      }>
      <AppHeader showBack />
      <View style={styles.body}>
        <Text variant="title" style={styles.title}>
          Your career has context.
        </Text>
        <Text variant="bodyLarge" color="textSecondary" style={styles.subtitle}>
          AfterRole is built around real people and real employment histories.
        </Text>

        <Card padded elevated style={styles.sample}>
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

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.employment}>
            <View
              style={[styles.logo, { backgroundColor: colors.surfaceSunken, borderColor: colors.border }]}>
              <Text style={{ color: colors.textSecondary, fontFamily: fontFamily.bold, fontSize: 18 }}>
                A
              </Text>
            </View>
            <View style={styles.employmentText}>
              <Text variant="callout">AdVital</Text>
              <Text variant="small" color="textSecondary">
                Technical Specialist
              </Text>
              <Text variant="small" color="textMuted">
                2026 – Present
              </Text>
            </View>
            <VerifiedBadge label="Verified Role" />
          </View>
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, justifyContent: 'center', gap: spacing.lg },
  title: { maxWidth: 420 },
  subtitle: { maxWidth: 420 },
  sample: { marginTop: spacing.md, gap: spacing.lg },
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
    borderWidth: StyleSheet.hairlineWidth,
  },
  employmentText: { flex: 1, gap: 1 },
});
