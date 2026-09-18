import { useRouter } from 'expo-router';
import { Apple, Globe, Mail } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { AfterRoleLogo } from '@/components/brand';
import { AppHeader } from '@/components/ui/AppHeader';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import type { IconType } from '@/components/ui/icon';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { fontFamily } from '@/constants/typography';
import { useTheme } from '@/hooks/use-theme';
import { haptics } from '@/lib/haptics';
import { useStore } from '@/store';

export default function SignInScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const signIn = useStore((s) => s.signIn);
  const completeOnboarding = useStore((s) => s.completeOnboarding);

  const mockSignIn = () => {
    haptics.light();
    signIn();
    completeOnboarding();
    router.replace('/home');
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <AppHeader showBack />
      <View style={styles.body}>
        <View style={styles.intro}>
          <AfterRoleLogo size={26} withMark />
          <Text variant="title" style={styles.title}>
            Welcome to afterrole.
          </Text>
          <Text variant="bodyLarge" color="textSecondary">
            Join the workplace conversation.
          </Text>
        </View>

        <View style={styles.actions}>
          <AuthButton
            icon={Apple}
            label="Continue with Apple"
            bg={colors.textPrimary}
            fg={colors.background}
            onPress={mockSignIn}
          />
          <AuthButton
            icon={Globe}
            label="Continue with Google"
            bg={colors.surface}
            fg={colors.textPrimary}
            border={colors.border}
            onPress={mockSignIn}
          />
          <AuthButton
            icon={Mail}
            label="Continue with Email"
            bg={colors.forest}
            fg={colors.accentForeground}
            onPress={mockSignIn}
          />
        </View>

        <Text variant="small" color="textMuted" center style={styles.legal}>
          By continuing you agree to post under your real professional identity.
        </Text>
      </View>
    </Screen>
  );
}

function AuthButton({
  icon: Icon,
  label,
  bg,
  fg,
  border,
  onPress,
}: {
  icon: IconType;
  label: string;
  bg: string;
  fg: string;
  border?: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.authButton,
        {
          backgroundColor: bg,
          borderColor: border ?? 'transparent',
          borderWidth: border ? StyleSheet.hairlineWidth : 0,
        },
        pressed && styles.pressed,
      ]}>
      <Icon size={20} color={fg} strokeWidth={2} />
      <Text style={{ color: fg, fontFamily: fontFamily.semibold, fontSize: 16, letterSpacing: -0.1 }}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, justifyContent: 'center', gap: spacing.xxxl },
  intro: { gap: spacing.md, alignItems: 'flex-start' },
  title: { marginTop: spacing.sm },
  actions: { gap: spacing.md },
  authButton: {
    height: 56,
    borderRadius: radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  pressed: { transform: [{ scale: 0.98 }], opacity: 0.9 },
  legal: { paddingHorizontal: spacing.lg },
});
