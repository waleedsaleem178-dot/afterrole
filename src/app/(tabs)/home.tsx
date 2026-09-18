import { useRouter } from 'expo-router';
import { Bell, Compass, SlidersHorizontal } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { CompanyCard, CompanyLogo } from '@/components/cards/CompanyCard';
import { PersonCard } from '@/components/cards/PersonCard';
import { StoryCard } from '@/components/cards/StoryCard';
import { StoryCardSkeleton } from '@/components/cards/StoryCardSkeleton';
import { AfterRoleLogo } from '@/components/brand';
import { Avatar } from '@/components/ui/Avatar';
import { Chip } from '@/components/ui/Chip';
import { EmptyState } from '@/components/ui/EmptyState';
import { IconButton } from '@/components/ui/IconButton';
import { Screen } from '@/components/ui/Screen';
import { SearchField } from '@/components/ui/SearchField';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { getCompanyById, getFinalStraws, mockCompanies, mockStories, mockUsers } from '@/data';
import { useNotifications } from '@/hooks/use-notifications';
import { useTheme } from '@/hooks/use-theme';
import { formatCount } from '@/lib/format';
import { combineStories, useStore } from '@/store';
import type { Company, Story } from '@/types';

const CATEGORIES = ['Trending', 'Tech', 'Healthcare', 'Finance', 'Marketing', 'Remote'] as const;
const CATEGORY_KEYWORDS: Record<string, string | null> = {
  Trending: null,
  Tech: 'techn',
  Healthcare: 'health',
  Finance: 'fintech',
  Marketing: 'marketing',
  Remote: 'remote',
};

export default function HomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const profile = useStore((s) => s.profile);
  const createdStories = useStore((s) => s.createdStories);
  const hydrated = useStore((s) => s.hydrated);
  const { unreadCount } = useNotifications();

  const [category, setCategory] = useState<string>('Trending');
  const [minElapsed, setMinElapsed] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMinElapsed(true), 480);
    return () => clearTimeout(t);
  }, []);
  const loading = !hydrated || !minElapsed;

  const allStories = useMemo(() => combineStories(createdStories, mockStories), [createdStories]);
  const trendingCompanies = useMemo(
    () => [...mockCompanies].sort((a, b) => b.storyCount - a.storyCount).slice(0, 6),
    [],
  );
  const finalStraws = useMemo(() => getFinalStraws(), []);
  const peopleToFollow = useMemo(() => mockUsers.filter((u) => u.id !== profile.id).slice(0, 3), [profile.id]);
  const discussedCompanies = useMemo(() => mockCompanies.slice(0, 4), []);

  const recentStories = useMemo(() => {
    const keyword = CATEGORY_KEYWORDS[category];
    const list = keyword ? allStories.filter((s) => storyMatches(s, keyword)) : allStories;
    return list.slice(0, 8);
  }, [allStories, category]);

  return (
    <Screen scroll edges={['top']} contentStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <AfterRoleLogo size={50} withMark />
        <View style={styles.headerRight}>
          <View>
            <IconButton icon={Bell} accessibilityLabel="Activity" variant="surface" onPress={() => router.push('/activity')} />
            {unreadCount > 0 ? (
              <View style={[styles.badge, { backgroundColor: colors.danger, borderColor: colors.background }]} />
            ) : null}
          </View>
          <Pressable onPress={() => router.push('/profile')} hitSlop={4}>
            <Avatar name={profile.name} color={profile.avatarColor} size={40} />
          </Pressable>
        </View>
      </View>

      {/* Hero + search */}
      <View style={styles.hero}>
        <Text variant="title" style={styles.headline}>
          Where are you{'\n'}thinking of working?
        </Text>
        <SearchField
          editable={false}
          size="lg"
          placeholder="Search a company, role or industry..."
          onPress={() => router.push('/search')}
          trailingIcon={SlidersHorizontal}
          onTrailingPress={() => router.push('/discover')}
        />
      </View>

      {/* Category chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {CATEGORIES.map((c) => (
          <Chip key={c} label={c} tone="forest" selected={category === c} onPress={() => setCategory(c)} />
        ))}
      </ScrollView>

      {loading ? (
        <View style={styles.section}>
          <Skeleton width={180} height={20} />
          <View style={styles.stack}>
            <StoryCardSkeleton />
            <StoryCardSkeleton />
            <StoryCardSkeleton />
          </View>
        </View>
      ) : (
        <>
      {/* Trending this week */}
      <View style={styles.section}>
        <SectionHeader title="Trending this week" actionLabel="See all" onActionPress={() => router.push('/discover')} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.trendingRow}>
          {trendingCompanies.map((c) => (
            <TrendingCompanyCard key={c.id} company={c} onPress={() => router.push({ pathname: '/company/[id]', params: { id: c.id } })} />
          ))}
        </ScrollView>
      </View>

      {/* Final Straws */}
      <View style={styles.section}>
        <SectionHeader title="Final Straws" subtitle="The moment people knew it was time to leave." />
        <View style={styles.stack}>
          {finalStraws.map((s) => (
            <StoryCard key={s.id} story={s} />
          ))}
        </View>
      </View>

      {/* Recent workplace stories */}
      <View style={styles.section}>
        <SectionHeader title="Recent workplace stories" />
        {recentStories.length > 0 ? (
          <View style={styles.stack}>
            {recentStories.map((s) => (
              <StoryCard key={s.id} story={s} />
            ))}
          </View>
        ) : (
          <EmptyState
            icon={Compass}
            title={`No ${category} stories yet`}
            message="Try another category, or be the first to share one."
            actionLabel="Share a story"
            onAction={() => router.push('/create/step-1')}
          />
        )}
      </View>

      {/* People to follow */}
      <View style={styles.section}>
        <SectionHeader title="People to follow" actionLabel="See all" onActionPress={() => router.push('/discover')} />
        <View style={styles.stack}>
          {peopleToFollow.map((u) => (
            <PersonCard key={u.id} user={u} contextLine={u.location} />
          ))}
        </View>
      </View>

      {/* Recently discussed companies */}
      <View style={styles.section}>
        <SectionHeader title="Recently discussed companies" actionLabel="Discover" onActionPress={() => router.push('/discover')} />
        <View style={styles.stack}>
          {discussedCompanies.map((c) => (
            <CompanyCard key={c.id} company={c} showFollow />
          ))}
        </View>
      </View>
        </>
      )}
    </Screen>
  );
}

function TrendingCompanyCard({ company, onPress }: { company: Company; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.trendingCard,
        { backgroundColor: colors.surface, borderColor: colors.border },
        pressed && styles.pressed,
      ]}>
      <CompanyLogo company={company} size={42} />
      <View style={styles.trendingText}>
        <Text variant="callout" numberOfLines={1}>
          {company.name}
        </Text>
        <Text variant="small" color="textSecondary" numberOfLines={1}>
          {company.industry}
        </Text>
      </View>
      <Text variant="small" color="textMuted">
        {formatCount(company.storyCount)} stories
      </Text>
    </Pressable>
  );
}

function storyMatches(story: Story, keyword: string): boolean {
  const hay = [story.role, ...story.topics].join(' ').toLowerCase();
  const company = getCompanyById(story.companyId);
  const companyHay = company ? `${company.name} ${company.industry}`.toLowerCase() : '';
  return hay.includes(keyword) || companyHay.includes(keyword);
}

const styles = StyleSheet.create({
  content: { gap: spacing.xxl },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: spacing.xs },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  badge: {
    position: 'absolute',
    top: 1,
    right: 1,
    width: 10,
    height: 10,
    borderRadius: radius.pill,
    borderWidth: 1.5,
  },
  hero: { gap: spacing.lg },
  headline: { letterSpacing: -0.4 },
  chips: { gap: spacing.sm, paddingRight: spacing.lg },
  section: { gap: spacing.md },
  stack: { gap: spacing.md },
  trendingRow: { gap: spacing.md, paddingVertical: spacing.xxs, paddingRight: spacing.lg },
  trendingCard: {
    width: 210,
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.card,
    borderWidth: StyleSheet.hairlineWidth,
  },
  trendingText: { gap: 2 },
  pressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
});
