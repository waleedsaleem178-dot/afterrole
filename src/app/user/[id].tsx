import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { EmploymentCard } from '@/components/cards/EmploymentCard';
import { StoryCard } from '@/components/cards/StoryCard';
import { AppHeader } from '@/components/ui/AppHeader';
import { Avatar } from '@/components/ui/Avatar';
import { VerifiedBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProfileStats } from '@/components/ProfileStats';
import { Screen } from '@/components/ui/Screen';
import { SegmentTabs } from '@/components/ui/SegmentTabs';
import { Text } from '@/components/ui/Text';
import { spacing } from '@/constants/spacing';
import { getStoriesByAuthor, getUserById } from '@/data';
import { formatCount } from '@/lib/format';
import { haptics } from '@/lib/haptics';
import { combineStories, useStore } from '@/store';

type Tab = 'Stories' | 'Experience';

export default function PublicProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const user = getUserById(id);

  const isSelf = useStore((s) => s.profile.id === id);
  const following = useStore((s) => s.followedUsers.includes(id ?? ''));
  const toggleFollow = useStore((s) => s.toggleFollowUser);
  const createdStories = useStore((s) => s.createdStories);

  const [tab, setTab] = useState<Tab>('Stories');

  const stories = useMemo(() => {
    if (!id) return [];
    const base = getStoriesByAuthor(id);
    const created = isSelf ? createdStories : [];
    return combineStories(created, base);
  }, [id, isSelf, createdStories]);

  if (!user) {
    return (
      <Screen edges={['top']}>
        <AppHeader showBack title="Profile" />
        <EmptyState title="Profile not found" message="This person is no longer available." />
      </Screen>
    );
  }

  return (
    <Screen scroll edges={['top']} contentStyle={styles.content}>
      <AppHeader showBack />

      <View style={styles.header}>
        <Avatar name={user.name} color={user.avatarColor} size={84} verified={user.verified} showVerified />
        <View style={styles.nameRow}>
          <Text variant="title">{user.name}</Text>
          {user.verified ? <VerifiedBadge /> : null}
        </View>
        <Text variant="body" color="textSecondary" center>
          {user.headline}
        </Text>
        <Text variant="small" color="textMuted">
          {user.location}
        </Text>
        {user.bio ? (
          <Text variant="body" color="textSecondary" center style={styles.bio}>
            {user.bio}
          </Text>
        ) : null}

        <ProfileStats
          storyCount={user.storyCount}
          followerCount={user.followerCount}
          followingCount={user.followingCount}
          onFollowers={() => router.push('/followers')}
          onFollowing={() => router.push('/following')}
        />

        {!isSelf ? (
          <Button
            label={following ? 'Following' : 'Follow'}
            variant={following ? 'secondary' : 'primary'}
            onPress={() => {
              haptics.light();
              toggleFollow(user.id);
            }}
            style={styles.followBtn}
          />
        ) : (
          <Button
            label="Edit profile"
            variant="secondary"
            onPress={() => router.push('/edit-profile')}
            style={styles.followBtn}
          />
        )}
      </View>

      <SegmentTabs tabs={['Stories', 'Experience']} value={tab} onChange={(t) => setTab(t as Tab)} />

      {tab === 'Stories' ? (
        stories.length > 0 ? (
          <View style={styles.stack}>
            {stories.map((s) => (
              <StoryCard key={s.id} story={s} />
            ))}
          </View>
        ) : (
          <EmptyState title="No stories yet" message={`${user.name.split(' ')[0]} hasn't shared a story yet.`} />
        )
      ) : (
        <View style={styles.stack}>
          {user.employment.map((e) => (
            <EmploymentCard key={e.id} employment={e} />
          ))}
        </View>
      )}

      <Text variant="small" color="textMuted" center style={styles.count}>
        {formatCount(user.followerCount)} followers
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.lg },
  header: { alignItems: 'center', gap: spacing.xs },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.sm },
  bio: { marginTop: spacing.xs, maxWidth: 420 },
  followBtn: { marginTop: spacing.md, alignSelf: 'stretch' },
  stack: { gap: spacing.md },
  count: { marginTop: spacing.sm },
});
