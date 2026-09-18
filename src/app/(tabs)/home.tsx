import { useRouter } from 'expo-router';
import { Bell, Compass } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { CompanyCard, CompanyLogo } from '@/components/cards/CompanyCard';
import { PersonCard } from '@/components/cards/PersonCard';
import { StoryCard } from '@/components/cards/StoryCard';
import { Avatar } from '@/components/ui/Avatar';
import { Chip } from '@/components/ui/Chip';
import { EmptyState } from '@/components/ui/EmptyState';
import { IconButton } from '@/components/ui/IconButton';
import { Screen } from '@/components/ui/Screen';
import { SearchField } from '@/components/ui/SearchField';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Text } from '@/components/ui/Text';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { Brand } from '@/constants/theme';
import { fontFamily } from '@/constants/typography';
import { getCompanyById, getFinalStraws, mockCompanies, mockStories, mockUsers } from '@/data';
import { useNotifications } from '@/hooks/use-notifications';
import { useTheme } from '@/hooks/use-theme';
import { combineStories, useStore } from '@/store';
import type { Story } from '@/types';

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
  const { unreadCount } = useNotifications();

  const [category, setCategory] = useState<string>('Trending');

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
    const list = keyword
      ? allStories.filter((s) => storyMatches(s, keyword))
      : allStories;
    return list.slice(0, 8);
  }, [allStories, category]);

  return (
    <Screen scroll edges={['top']} contentStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.wordmark, { color: colors.textPrimary }]}>{Brand.wordmark}</Text>
        <View style={styles.headerRight}>
          <View>
            <IconButton
              icon={Bell}
              accessibilityLabel="Activity"
              variant="surface"
              onPress={() => router.push('/activity')}
            />
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
          placeholder="Search a company, role or industry..."
          onPress={() => router.push('/search')}
        />
      </View>

      {/* Category chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}>
        {CATEGORIES.map((c) => (
          <Chip key={c} label={c} selected={category === c} onPress={() => setCategory(c)} />
        ))}
      </ScrollView>

      {/* Trending this week */}
      <View style={styles.section}>
        <SectionHeader title="Trending this week" subtitle="Most-discussed workplaces right now" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.trendingRow}>
          {trendingCompanies.map((c) => (
            <Pressable
              key={c.id}
              onPress={() => router.push({ pathname: '/company/[id]', params: { id: c.id } })}
              style={({ pressed }) => [styles.trendingTile, pressed && styles.pressed]}>
              <CompanyLogo company={c} size={56} />
              <Text variant="label" numberOfLines={1} style={styles.trendingName}>
                {c.name}
              </Text>
            </Pressable>
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
    </Screen>
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: spacing.sm },
  wordmark: { fontFamily: fontFamily.bold, fontSize: 22, letterSpacing: -0.4 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
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
  trendingRow: { gap: spacing.lg, paddingVertical: spacing.xs },
  trendingTile: { alignItems: 'center', gap: spacing.sm, width: 76 },
  trendingName: { textAlign: 'center' },
  pressed: { opacity: 0.7 },
});
