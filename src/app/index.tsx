import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { AfterRoleLogo } from '@/components/brand';
import { Avatar } from '@/components/ui/Avatar';
import { VerifiedBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { useTheme } from '@/hooks/use-theme';

/**
 * Welcome — quiet, premium, editorial. Warm ivory canvas, confident logo,
 * a real story preview instead of empty hero space, forest CTA.
 */
export default function WelcomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.content}>
        <View style={styles.top}>
          <AfterRoleLogo size={40} withMark />
        </View>

        <View style={styles.hero}>
          <View style={[styles.eyebrow, { borderColor: colors.border, backgroundColor: colors.surface }]}>
            <View style={[styles.dot, { backgroundColor: colors.accent }]} />
            <Text variant="label" color="textSecondary">
              Real people · Real work stories
            </Text>
          </View>

          <Text variant="display" style={styles.tagline}>
            Know before{'\n'}you join.
          </Text>

          <Text variant="bodyLarge" color="textSecondary" style={styles.support}>
            See what working somewhere was actually like — from people who&apos;ve been there.
          </Text>

          {/* Subtle real-story preview */}
          <View style={[styles.preview, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Avatar name="Maya Chen" color="#7C3AED" size={38} verified showVerified />
            <View style={styles.previewText}>
              <View style={styles.previewNameRow}>
                <Text variant="callout">Maya Chen</Text>
                <VerifiedBadge />
              </View>
              <Text variant="small" color="textMuted">
                Staff Engineer · Amazon
              </Text>
              <Text variant="body" color="textSecondary" numberOfLines={2} style={styles.previewQuote}>
                “The scope is unmatched — just ask about on-call load before you sign.”
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <Button label="Get started" size="lg" iconRight={ArrowRight} onPress={() => router.push('/onboarding/discovery')} />
          <Button label="I already have an account" variant="ghost" onPress={() => router.push('/sign-in')} />
          <Text variant="small" color="textMuted" center style={styles.trust}>
            Stories are connected to real professional profiles.
          </Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, justifyContent: 'space-between', paddingTop: spacing.md, paddingBottom: spacing.sm },
  top: { paddingTop: spacing.sm },
  hero: { flex: 1, justifyContent: 'center', gap: spacing.lg },
  eyebrow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.sm,
    paddingVertical: 7,
    paddingHorizontal: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.pill,
  },
  dot: { width: 7, height: 7, borderRadius: radius.pill },
  tagline: { fontSize: 44, lineHeight: 50 },
  support: { maxWidth: 380 },
  preview: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: spacing.sm,
  },
  previewText: { flex: 1, gap: 2 },
  previewNameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  previewQuote: { marginTop: spacing.xs, fontStyle: 'italic' },
  actions: { gap: spacing.sm },
  trust: { marginTop: spacing.sm },
});
