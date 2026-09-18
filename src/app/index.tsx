import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { Brand } from '@/constants/theme';
import { fontFamily } from '@/constants/typography';
import { Screen } from '@/components/ui/Screen';
import { useTheme } from '@/hooks/use-theme';

/**
 * Welcome — TEMPORARY. Kept intentionally simple; the full branding redesign
 * comes in a later phase. Do not invest in visual polish here yet.
 */
export default function WelcomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.content}>
        <Text style={[styles.wordmark, { color: colors.textPrimary }]}>{Brand.wordmark}</Text>

        <View style={styles.hero}>
          <View style={[styles.eyebrow, { borderColor: colors.border }]}>
            <View style={[styles.dot, { backgroundColor: colors.success }]} />
            <Text variant="caption" color="textSecondary">
              Real names · Not anonymous reviews
            </Text>
          </View>

          <Text variant="display" style={styles.tagline}>
            {Brand.tagline}
          </Text>

          <Text variant="bodyLarge" color="textSecondary" style={styles.positioning}>
            {Brand.positioning}
          </Text>
        </View>

        <View style={styles.actions}>
          <Button label="Get started" size="lg" onPress={() => router.push('/onboarding/discovery')} />
          <Button
            label="I already have an account"
            variant="ghost"
            onPress={() => router.push('/sign-in')}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, justifyContent: 'space-between', paddingVertical: spacing.xxl },
  wordmark: { fontFamily: fontFamily.bold, fontSize: 20, letterSpacing: -0.4, paddingTop: spacing.sm },
  hero: { flex: 1, justifyContent: 'center', gap: spacing.lg },
  eyebrow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.pill,
  },
  dot: { width: 7, height: 7, borderRadius: radius.pill },
  tagline: { fontSize: 46, lineHeight: 50 },
  positioning: { maxWidth: 420 },
  actions: { gap: spacing.sm },
});
