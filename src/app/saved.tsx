import { useRouter } from 'expo-router';
import { Bookmark } from 'lucide-react-native';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { StoryCard } from '@/components/cards/StoryCard';
import { AppHeader } from '@/components/ui/AppHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Screen } from '@/components/ui/Screen';
import { spacing } from '@/constants/spacing';
import { mockStories } from '@/data';
import { combineStories, useStore } from '@/store';

export default function SavedScreen() {
  const router = useRouter();
  const savedIds = useStore((s) => s.savedStories);
  const createdStories = useStore((s) => s.createdStories);

  const savedStories = useMemo(() => {
    const all = combineStories(createdStories, mockStories);
    return savedIds
      .map((id) => all.find((s) => s.id === id))
      .filter((s): s is NonNullable<typeof s> => Boolean(s));
  }, [createdStories, savedIds]);

  return (
    <Screen scroll edges={['top', 'bottom']} contentStyle={styles.content}>
      <AppHeader showBack title="Saved stories" />
      {savedStories.length > 0 ? (
        <View style={styles.stack}>
          {savedStories.map((s) => (
            <StoryCard key={s.id} story={s} />
          ))}
        </View>
      ) : (
        <EmptyState
          icon={Bookmark}
          title="No saved stories"
          message="Tap the bookmark on any story to save it for later."
          actionLabel="Explore stories"
          onAction={() => router.push('/discover')}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.lg },
  stack: { gap: spacing.md },
});
