import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { PersonCard } from '@/components/cards/PersonCard';
import { AppHeader } from '@/components/ui/AppHeader';
import { Screen } from '@/components/ui/Screen';
import { spacing } from '@/constants/spacing';
import { mockUsers } from '@/data';
import { useStore } from '@/store';

export default function FollowersScreen() {
  const selfId = useStore((s) => s.profile.id);
  const followers = useMemo(() => mockUsers.filter((u) => u.id !== selfId), [selfId]);

  return (
    <Screen scroll edges={['top', 'bottom']} contentStyle={styles.content}>
      <AppHeader showBack title="Followers" />
      <View style={styles.stack}>
        {followers.map((u) => (
          <PersonCard key={u.id} user={u} contextLine={u.headline} />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.lg },
  stack: { gap: spacing.md },
});
