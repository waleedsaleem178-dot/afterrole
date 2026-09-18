import { useLocalSearchParams, useRouter } from 'expo-router';
import { Send, Share2, ThumbsUp } from 'lucide-react-native';
import { useMemo, useRef, useState } from 'react';
import { Platform, Pressable, Share, StyleSheet, TextInput, View } from 'react-native';

import { ReactionBar } from '@/components/ReactionBar';
import { AppHeader } from '@/components/ui/AppHeader';
import { Avatar } from '@/components/ui/Avatar';
import { Badge, VerifiedBadge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { EmptyState } from '@/components/ui/EmptyState';
import { IconButton } from '@/components/ui/IconButton';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { fontFamily, typography } from '@/constants/typography';
import { getBaseCommentsForStory, getCompanyById, getStoryById, getUserById } from '@/data';
import { useTheme } from '@/hooks/use-theme';
import { relativeTime } from '@/lib/format';
import { haptics } from '@/lib/haptics';
import { useStore } from '@/store';
import type { Comment, WouldWorkAgain } from '@/types';

const EMPTY_COMMENTS: Comment[] = [];

const WWA_TONE: Record<WouldWorkAgain, 'success' | 'warning' | 'danger'> = {
  Yes: 'success',
  Maybe: 'warning',
  No: 'danger',
};

export default function StoryDetailScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const createdStories = useStore((s) => s.createdStories);
  const commentsByStory = useStore((s) => s.commentsByStory);
  const storeComments = id ? (commentsByStory[id] ?? EMPTY_COMMENTS) : EMPTY_COMMENTS;
  const addComment = useStore((s) => s.addComment);

  const story = useMemo(
    () => createdStories.find((s) => s.id === id) ?? getStoryById(id),
    [createdStories, id],
  );

  const [draft, setDraft] = useState('');
  const inputRef = useRef<TextInput>(null);

  const comments = useMemo(() => {
    if (!id) return [];
    return [...storeComments, ...getBaseCommentsForStory(id)];
  }, [storeComments, id]);

  if (!story) {
    return (
      <Screen edges={['top']}>
        <AppHeader showBack title="Story" />
        <EmptyState title="Story not found" message="This story is no longer available." />
      </Screen>
    );
  }

  const author = getUserById(story.authorId);
  const company = getCompanyById(story.companyId);
  const totalComments = story.commentCount + storeComments.length;

  const onShare = async () => {
    haptics.light();
    try {
      await Share.share({
        message: `${author?.name} on ${company?.name}: ${story.excerpt}`,
      });
    } catch {
      // sharing unavailable (e.g. web) — no-op
    }
  };

  const submitComment = () => {
    if (!draft.trim()) return;
    haptics.light();
    addComment(story.id, draft);
    setDraft('');
  };

  return (
    <Screen
      scroll
      keyboardAware
      edges={['top']}
      contentStyle={styles.content}
      footer={
        <View style={styles.composer}>
          <TextInput
            ref={inputRef}
            value={draft}
            onChangeText={setDraft}
            placeholder="Add a comment…"
            placeholderTextColor={colors.textMuted}
            selectionColor={colors.accent}
            style={[
              styles.composerInput,
              typography.body,
              { color: colors.textPrimary, backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          />
          <IconButton
            icon={Send}
            accessibilityLabel="Send comment"
            variant="accent"
            onPress={submitComment}
          />
        </View>
      }>
      <AppHeader
        showBack
        rightSlot={
          <IconButton icon={Share2} accessibilityLabel="Share" variant="surface" onPress={onShare} />
        }
      />

      {/* Author */}
      <Pressable
        style={styles.author}
        onPress={() => author && router.push({ pathname: '/user/[id]', params: { id: author.id } })}>
        <Avatar name={author?.name ?? '?'} color={author?.avatarColor} size={48} verified={author?.verified} showVerified />
        <View style={styles.flex}>
          <View style={styles.nameRow}>
            <Text variant="callout">{author?.name}</Text>
            {author?.verified ? <VerifiedBadge /> : null}
          </View>
          <Text variant="small" color="textSecondary">
            {story.role}
            {company ? ` · ${company.name}` : ''}
          </Text>
          <Text variant="small" color="textMuted">
            {story.employmentContext} · {relativeTime(story.createdAt)}
          </Text>
        </View>
      </Pressable>

      {/* Final straw highlight */}
      {story.finalStraw ? (
        <View style={[styles.quote, { borderLeftColor: colors.accent, backgroundColor: colors.surface }]}>
          <Text variant="overline" color="textMuted">
            The final straw
          </Text>
          <Text variant="bodyLarge" style={styles.quoteText}>
            “{story.finalStraw}”
          </Text>
        </View>
      ) : null}

      {/* Body */}
      <Text variant="bodyLarge" color="textSecondary" style={styles.body}>
        {story.body}
      </Text>

      {/* What was good */}
      {story.whatWasGood ? (
        <Card padded>
          <Text variant="overline" color="textMuted">
            What was good
          </Text>
          <Text variant="body" style={styles.goodText}>
            {story.whatWasGood}
          </Text>
        </Card>
      ) : null}

      {/* Meta */}
      <View style={styles.meta}>
        {story.wouldWorkAgain ? (
          <View style={styles.wwa}>
            <Text variant="label" color="textSecondary">
              Would work there again
            </Text>
            <Badge label={story.wouldWorkAgain} tone={WWA_TONE[story.wouldWorkAgain]} />
          </View>
        ) : null}
        {story.topics.length > 0 ? (
          <View style={styles.topics}>
            {story.topics.map((t) => (
              <Chip key={t} label={t} size="sm" />
            ))}
          </View>
        ) : null}
      </View>

      {/* Reactions */}
      <View style={[styles.reactions, { borderColor: colors.border }]}>
        <ReactionBar
          story={story}
          onComment={() => inputRef.current?.focus()}
          onMenu={() => router.push({ pathname: '/report/[storyId]', params: { storyId: story.id } })}
        />
      </View>

      {/* Comments */}
      <View style={styles.commentsSection}>
        <Text variant="subtitle">Comments · {totalComments}</Text>
        {comments.length > 0 ? (
          comments.map((c) => (
            <CommentRow key={c.id} comment={c} onReply={() => inputRef.current?.focus()} />
          ))
        ) : (
          <Text variant="body" color="textMuted">
            No comments yet. Be the first — under your real name.
          </Text>
        )}
      </View>
    </Screen>
  );
}

function CommentRow({ comment, onReply }: { comment: Comment; onReply: () => void }) {
  const { colors } = useTheme();
  const router = useRouter();
  const author = getUserById(comment.authorId);
  const [helpful, setHelpful] = useState(false);
  const count = comment.helpfulCount + (helpful ? 1 : 0);

  return (
    <View style={styles.comment}>
      <Avatar name={author?.name ?? '?'} color={author?.avatarColor} size={36} />
      <View style={styles.flex}>
        <View style={styles.nameRow}>
          <Text variant="bodyMedium">{author?.name}</Text>
          {author?.verified ? <VerifiedBadge /> : null}
          <Text variant="small" color="textMuted">
            · {relativeTime(comment.createdAt)}
          </Text>
        </View>
        <Text variant="body" color="textSecondary" style={styles.commentBody}>
          {comment.body}
        </Text>
        <View style={styles.commentActions}>
          <Pressable
            hitSlop={6}
            onPress={() => {
              haptics.light();
              setHelpful((v) => !v);
            }}
            style={styles.commentAction}>
            <ThumbsUp size={14} color={helpful ? colors.accent : colors.textMuted} strokeWidth={2} />
            <Text variant="small" style={{ color: helpful ? colors.accent : colors.textMuted }}>
              {count > 0 ? count : 'Helpful'}
            </Text>
          </Pressable>
          <Pressable hitSlop={6} onPress={onReply}>
            <Text variant="small" color="textMuted" style={{ fontFamily: fontFamily.medium }}>
              Reply
            </Text>
          </Pressable>
          <Pressable
            hitSlop={6}
            onPress={() =>
              router.push({ pathname: '/report/[storyId]', params: { storyId: comment.storyId } })
            }>
            <Text variant="small" color="textMuted" style={{ fontFamily: fontFamily.medium }}>
              Report
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.lg },
  author: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, flexWrap: 'wrap' },
  flex: { flex: 1, gap: 1 },
  quote: {
    borderLeftWidth: 3,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  quoteText: { fontStyle: 'italic' },
  body: { lineHeight: 26 },
  goodText: { marginTop: spacing.xs },
  meta: { gap: spacing.md },
  wwa: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  topics: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  reactions: {
    paddingVertical: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  commentsSection: { gap: spacing.lg, paddingTop: spacing.xs },
  comment: { flexDirection: 'row', gap: spacing.md },
  commentBody: { marginTop: 2, marginBottom: spacing.xs },
  commentActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  commentAction: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  composer: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  composerInput: {
    flex: 1,
    height: 44,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing.lg,
    paddingVertical: Platform.OS === 'ios' ? spacing.md : spacing.sm,
  },
});
