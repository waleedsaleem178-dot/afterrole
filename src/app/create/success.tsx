import { useLocalSearchParams, useRouter } from 'expo-router';
import { CircleCheck } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { useTheme } from '@/hooks/use-theme';

export default function PublishSuccess() {
  const { colors } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const dismiss = () => {
    try {
      router.dismissAll();
    } catch {
      // not in a dismissable stack — ignore
    }
  };

  const viewStory = () => {
    dismiss();
    if (id) router.push({ pathname: '/story/[id]', params: { id } });
  };

  const backHome = () => {
    dismiss();
    router.replace('/home');
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.body}>
        <View style={[styles.iconWrap, { backgroundColor: colors.successSoft }]}>
          <CircleCheck size={44} color={colors.success} strokeWidth={2} />
        </View>
        <Text variant="title" center>
          Your story is live.
        </Text>
        <Text variant="bodyLarge" color="textSecondary" center style={styles.message}>
          Thanks for helping someone understand the workplace a little better.
        </Text>
      </View>

      <View style={styles.actions}>
        <Button label="View story" size="lg" onPress={viewStory} />
        <Button label="Back to home" variant="ghost" onPress={backHome} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  message: { maxWidth: 340 },
  actions: { gap: spacing.sm, paddingBottom: spacing.lg },
});
