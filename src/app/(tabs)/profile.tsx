import { useRouter } from 'expo-router';
import { Bookmark, Plus, Settings, Share2 } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Share, StyleSheet, View } from 'react-native';

import { EmploymentCard } from '@/components/cards/EmploymentCard';
import { StoryCard } from '@/components/cards/StoryCard';
import { ProfileStats } from '@/components/ProfileStats';
import { Avatar } from '@/components/ui/Avatar';
import { VerifiedBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { IconButton } from '@/components/ui/IconButton';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Text } from '@/components/ui/Text';
import { spacing } from '@/constants/spacing';
import { getStoriesByAuthor, mockStories } from '@/data';
import { useTheme } from '@/hooks/use-theme';
import { haptics } from '@/lib/haptics';
import { Chip } from '@/components/ui/Chip';
import { combineStories, useStore } from '@/store';

type Tab = 'Stories' | 'Experience' | 'Saved';

export default function OwnProfileScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const profile = useStore((s) => s.profile);
  const createdStories = useStore((s) => s.createdStories);
  const savedIds = useStore((s) => s.savedStories);

  const [tab, setTab] = useState<Tab>('Stories');

  const myStories = useMemo(
    () => combineStories(createdStories, getStoriesByAuthor(profile.id)),
    [createdStories, profile.id],
  );
  const savedStories = useMemo(() => {
    const all = combineStories(createdStories, mockStories);
    return savedIds
      .map((id) => all.find((s) => s.id === id))
      .filter((s): s is NonNullable<typeof s> => Boolean(s));
  }, [createdStories, savedIds]);

  const shareProfile = async () => {
    haptics.light();
    try {
      await Share.share({ message: `${profile.name} on AfterRole — ${profile.headline}` });
    } catch {
      // unavailable — no-op
    }
  };

  return (
    <Screen scroll edges={['top']} contentStyle={styles.content}>
      <View style={styles.topBar}>
        <IconButton
          icon={Settings}
          accessibilityLabel="Settings"
          variant="surface"
          onPress={() => router.push('/settings')}
        />
      </View>

      <View style={styles.header}>
        <Avatar name={profile.name} color={profile.avatarColor} size={88} verified={profile.verified} showVerified />
        <View style={styles.nameRow}>
          <Text variant="title">{profile.name}</Text>
          {profile.verified ? <VerifiedBadge /> : null}
        </View>
        <Text variant="body" color="textSecondary" center>
          {profile.headline}
        </Text>
        <Text variant="small" color="textMuted">
          {profile.location}
        </Text>
        {profile.bio ? (
          <Text variant="body" color="textSecondary" center style={styles.bio}>
            {profile.bio}
          </Text>
        ) : null}

        <ProfileStats
          storyCount={profile.storyCount}
          followerCount={profile.followerCount}
          followingCount={profile.followingCount}
          onStories={() => setTab('Stories')}
          onFollowers={() => router.push('/followers')}
          onFollowing={() => router.push('/following')}
        />

        <View style={styles.headerButtons}>
          <Button label="Edit Profile" variant="secondary" onPress={() => router.push('/edit-profile')} style={styles.flex} />
          <Button label="Share Profile" variant="secondary" icon={Share2} onPress={shareProfile} style={styles.flex} />
        </View>
      </View>

      <View style={[styles.tabs, { borderBottomColor: colors.border }]}>
        {(['Stories', 'Experience', 'Saved'] as Tab[]).map((t) => (
          <Chip key={t} label={t} selected={tab === t} onPress={() => setTab(t)} />
        ))}
      </View>

      {tab === 'Stories' ? (
        myStories.length > 0 ? (
          <View style={styles.stack}>
            {myStories.map((s) => (
              <StoryCard key={s.id} story={s} />
            ))}
          </View>
        ) : (
          <EmptyState
            title="No stories yet"
            message="Share your first workplace story."
            actionLabel="Share a story"
            onAction={() => router.push('/create/step-1')}
          />
        )
      ) : null}

      {tab === 'Experience' ? (
        <View style={styles.stack}>
          <SectionHeader title="Work history" actionLabel="Manage" onActionPress={() => router.push('/work-history')} />
          {profile.employment.map((e) => (
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
          <Button label="Add role" variant="secondary" icon={Plus} onPress={() => router.push('/add-employment')} />
        </View>
      ) : null}

      {tab === 'Saved' ? (
        savedStories.length > 0 ? (
          <View style={styles.stack}>
            {savedStories.map((s) => (
              <StoryCard key={s.id} story={s} />
            ))}
          </View>
        ) : (
          <EmptyState icon={Bookmark} title="No saved stories" message="Stories you save will appear here." />
        )
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.lg },
  topBar: { flexDirection: 'row', justifyContent: 'flex-end' },
  header: { alignItems: 'center', gap: spacing.xs },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.sm },
  bio: { marginTop: spacing.xs, maxWidth: 420 },
  headerButtons: { flexDirection: 'row', gap: spacing.md, alignSelf: 'stretch', marginTop: spacing.md },
  flex: { flex: 1 },
  tabs: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingBottom: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  stack: { gap: spacing.md },
});
