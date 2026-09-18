import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { spacing } from '@/constants/spacing';
import { getCompanyById, getUserById } from '@/data';
import { useTheme } from '@/hooks/use-theme';
import { relativeTime } from '@/lib/format';
import type { Story } from '@/types';

import { ReactionBar } from '../ReactionBar';
import { Avatar } from '../ui/Avatar';
import { Card } from '../ui/Card';
import { Chip } from '../ui/Chip';
import { Text } from '../ui/Text';
import { VerifiedBadge } from '../ui/Badge';

export interface StoryCardProps {
  story: Story;
  onPress?: () => void;
  showReactions?: boolean;
}

export function StoryCard({ story, onPress, showReactions = true }: StoryCardProps) {
  const { colors } = useTheme();
  const router = useRouter();
  const author = getUserById(story.authorId);
  const company = getCompanyById(story.companyId);

  const goToStory = () => router.push({ pathname: '/story/[id]', params: { id: story.id } });
  const goToAuthor = () =>
    author && router.push({ pathname: '/user/[id]', params: { id: author.id } });

  return (
    <Card padded onPress={onPress ?? goToStory}>
      <View style={styles.header}>
        <Pressable onPress={goToAuthor} hitSlop={4}>
          <Avatar name={author?.name ?? '?'} color={author?.avatarColor} size={44} />
        </Pressable>
        <View style={styles.headerText}>
          <View style={styles.nameRow}>
            <Text variant="callout" numberOfLines={1}>
              {author?.name ?? 'Unknown'}
            </Text>
            {author?.verified ? <VerifiedBadge /> : null}
          </View>
          <Text variant="small" color="textSecondary" numberOfLines={1}>
            {story.role}
            {company ? ` · ${company.name}` : ''}
          </Text>
          <Text variant="small" color="textMuted" numberOfLines={1}>
            {story.employmentContext} · {relativeTime(story.createdAt)}
          </Text>
        </View>
      </View>

      <Pressable onPress={goToStory}>
        {story.isFinalStraw && story.finalStraw ? (
          <Text variant="bodyLarge" style={[styles.finalStraw, { color: colors.textPrimary }]}>
            “{story.finalStraw}”
          </Text>
        ) : (
          <Text variant="body" color="textSecondary" numberOfLines={4} style={styles.excerpt}>
            {story.excerpt}
          </Text>
        )}
      </Pressable>

      {story.topics.length > 0 ? (
        <View style={styles.topics}>
          {story.topics.slice(0, 3).map((t) => (
            <Chip key={t} label={t} size="sm" />
          ))}
        </View>
      ) : null}

      {showReactions ? (
        <View style={[styles.reactions, { borderTopColor: colors.border }]}>
          <ReactionBar
            story={story}
            onComment={goToStory}
            onMenu={() =>
              router.push({ pathname: '/report/[storyId]', params: { storyId: story.id } })
            }
          />
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  headerText: { flex: 1, gap: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  finalStraw: { marginTop: spacing.md, fontStyle: 'italic' },
  excerpt: { marginTop: spacing.md },
  topics: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginTop: spacing.md },
  reactions: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
