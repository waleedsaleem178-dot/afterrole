import { useRouter } from 'expo-router';
import { Apple, Globe, Mail } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { AppHeader } from '@/components/ui/AppHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { spacing } from '@/constants/spacing';
import { Brand } from '@/constants/theme';
import { useStore } from '@/store';

export default function SignInScreen() {
  const router = useRouter();
  const signIn = useStore((s) => s.signIn);
  const completeOnboarding = useStore((s) => s.completeOnboarding);

  const mockSignIn = () => {
    signIn();
    completeOnboarding();
    router.replace('/home');
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <AppHeader showBack />
      <View style={styles.body}>
        <View style={styles.intro}>
          <Text variant="title">Welcome back</Text>
          <Text variant="bodyLarge" color="textSecondary">
            Sign in to {Brand.name} to share and read real workplace stories.
          </Text>
          <Badge label="Prototype · mock sign-in" tone="warning" />
        </View>

        <View style={styles.actions}>
          <Button label="Continue with Apple" icon={Apple} variant="secondary" size="lg" onPress={mockSignIn} />
          <Button label="Continue with Google" icon={Globe} variant="secondary" size="lg" onPress={mockSignIn} />
          <Button label="Continue with Email" icon={Mail} variant="secondary" size="lg" onPress={mockSignIn} />
        </View>

        <Text variant="small" color="textMuted" center style={styles.legal}>
          By continuing you agree to post under your real professional identity.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, justifyContent: 'center', gap: spacing.xxxl },
  intro: { gap: spacing.md, alignItems: 'flex-start' },
  actions: { gap: spacing.md },
  legal: { paddingHorizontal: spacing.lg },
});
