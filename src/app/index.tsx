import * as Haptics from 'expo-haptics';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Brand, Fonts, MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/**
 * Welcome screen — the front door for AfterRole.
 *
 * This is the branded entry point; the auth flow and the rest of the product
 * are built out from the design brief. The CTAs are intentionally inert until
 * those screens exist.
 */
export default function WelcomeScreen() {
  const theme = useTheme();

  const onPrimary = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    // TODO: navigate to onboarding / sign-up once those screens exist.
  };

  const onSecondary = () => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    // TODO: navigate to sign-in once those screens exist.
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.content}>
          <View style={styles.header}>
            <ThemedText style={styles.wordmark}>{Brand.wordmark}</ThemedText>
          </View>

          <View style={styles.hero}>
            <View style={[styles.eyebrow, { borderColor: theme.border }]}>
              <View style={[styles.dot, { backgroundColor: theme.success }]} />
              <ThemedText type="caption" style={styles.eyebrowText}>
                Real names · Not anonymous reviews
              </ThemedText>
            </View>

            <ThemedText type="title" style={styles.title}>
              {Brand.tagline}
            </ThemedText>

            <ThemedText type="default" themeColor="textSecondary" style={styles.subtitle}>
              {Brand.positioning} Read first-hand accounts from people who actually did the job —
              attributed, accountable, and honest.
            </ThemedText>
          </View>

          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              onPress={onPrimary}
              style={({ pressed }) => [
                styles.primaryButton,
                { backgroundColor: theme.tint },
                pressed && styles.pressed,
              ]}>
              <ThemedText style={[styles.primaryLabel, { color: theme.tintText }]}>
                Get started
              </ThemedText>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={onSecondary}
              style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
              <ThemedText type="link">I already have an account</ThemedText>
            </Pressable>

            <ThemedText type="caption" themeColor="textSecondary" style={styles.fineprint}>
              By continuing you agree to post under your real professional identity.
            </ThemedText>
          </View>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: Spacing.four,
  },
  header: {
    paddingTop: Spacing.two,
  },
  wordmark: {
    fontFamily: Fonts.bold,
    fontSize: 20,
    letterSpacing: -0.4,
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    gap: Spacing.three,
  },
  eyebrow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: Spacing.two,
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.pill,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: Radius.pill,
  },
  eyebrowText: {
    letterSpacing: 0.2,
  },
  title: {
    fontSize: 44,
    lineHeight: 48,
  },
  subtitle: {
    maxWidth: 440,
  },
  actions: {
    gap: Spacing.three,
  },
  primaryButton: {
    height: 54,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryLabel: {
    fontFamily: Fonts.semibold,
    fontSize: 16,
  },
  secondaryButton: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
  fineprint: {
    textAlign: 'center',
    paddingHorizontal: Spacing.four,
  },
});
