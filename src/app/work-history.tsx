import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { EmploymentCard } from '@/components/cards/EmploymentCard';
import { AppHeader } from '@/components/ui/AppHeader';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { spacing } from '@/constants/spacing';
import { useStore } from '@/store';

export default function WorkHistoryScreen() {
  const router = useRouter();
  const employment = useStore((s) => s.profile.employment);

  return (
    <Screen
      scroll
      edges={['top', 'bottom']}
      contentStyle={styles.content}
      footer={<Button label="Add role" size="lg" icon={Plus} onPress={() => router.push('/add-employment')} />}>
      <AppHeader showBack title="Work history" />

      <Text variant="body" color="textSecondary">
        Your employment history gives your stories real professional context.
      </Text>

      {employment.length > 0 ? (
        <View style={styles.stack}>
          {employment.map((e) => (
            <EmploymentCard
              key={e.id}
              employment={e}
              onVerify={
                e.verified
                  ? undefined
                  : () => router.push({ pathname: '/verify-employment', params: { employmentId: e.id } })
              }
            />
          ))}
        </View>
      ) : (
        <EmptyState title="No roles yet" message="Add your first role to build your profile." />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.lg },
  stack: { gap: spacing.md },
});
