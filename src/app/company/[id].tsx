import { useLocalSearchParams } from 'expo-router';
import { Check, TriangleAlert } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { CompanyLogo } from '@/components/cards/CompanyCard';
import { PersonCard } from '@/components/cards/PersonCard';
import { StoryCard } from '@/components/cards/StoryCard';
import { AppHeader } from '@/components/ui/AppHeader';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { EmptyState } from '@/components/ui/EmptyState';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Text } from '@/components/ui/Text';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { getCompanyById, getPeopleForCompany, getStoriesByCompany, mockStories } from '@/data';
import { useTheme } from '@/hooks/use-theme';
import { haptics } from '@/lib/haptics';
import { combineStories, useStore } from '@/store';

type Tab = 'Overview' | 'Stories' | 'People' | 'Roles';
const TABS: Tab[] = ['Overview', 'Stories', 'People', 'Roles'];
const STORY_FILTERS = ['Most helpful', 'Newest', 'Current', 'Former'] as const;

export default function CompanyDetailScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const company = getCompanyById(id);

  const following = useStore((s) => s.followedCompanies.includes(id ?? ''));
  const toggleFollow = useStore((s) => s.toggleFollowCompany);
  const createdStories = useStore((s) => s.createdStories);

  const [tab, setTab] = useState<Tab>('Overview');
  const [storyFilter, setStoryFilter] = useState<(typeof STORY_FILTERS)[number]>('Most helpful');

  const people = useMemo(() => (id ? getPeopleForCompany(id) : []), [id]);
  const companyStories = useMemo(() => {
    if (!id) return [];
    const all = combineStories(createdStories, mockStories).filter((s) => s.companyId === id);
    switch (storyFilter) {
      case 'Newest':
        return [...all].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'Current':
        return all.filter((s) => s.employmentStatus === 'current');
      case 'Former':
        return all.filter((s) => s.employmentStatus === 'former');
      default:
        return [...all].sort((a, b) => b.helpfulCount - a.helpfulCount);
    }
  }, [id, createdStories, storyFilter]);

  const recentStories = useMemo(() => (id ? getStoriesByCompany(id).slice(0, 2) : []), [id]);

  if (!company) {
    return (
      <Screen edges={['top']}>
        <AppHeader showBack title="Company" />
        <EmptyState title="Company not found" message="This company is no longer available." />
      </Screen>
    );
  }

  return (
    <Screen scroll edges={['top']} contentStyle={styles.content}>
      <AppHeader showBack />

      {/* Company header */}
      <View style={styles.headerBlock}>
        <CompanyLogo company={company} size={68} />
        <Text variant="title" style={styles.name}>
          {company.name}
        </Text>
        <Text variant="body" color="textSecondary">
          {company.industry}
        </Text>
        <Text variant="callout" color="textSecondary">
          {company.storyCount.toLocaleString()} workplace stories
        </Text>
        <Button
          label={following ? 'Following' : 'Follow'}
          variant={following ? 'secondary' : 'primary'}
          fullWidth={false}
          onPress={() => {
            haptics.light();
            toggleFollow(company.id);
          }}
          style={styles.followBtn}
        />
      </View>

      {/* Tabs */}
      <View style={[styles.tabs, { borderBottomColor: colors.border }]}>
        {TABS.map((t) => (
          <Chip key={t} label={t} selected={tab === t} onPress={() => setTab(t)} />
        ))}
      </View>

      {tab === 'Overview' ? (
        <View style={styles.section}>
          <SectionHeader title="What people talk about most" subtitle="Frequently mentioned — not a rating." />
          <View style={styles.topics}>
            {company.topics.map((topic) => (
              <View key={topic.label} style={styles.topicRow}>
                <View style={styles.topicLabel}>
                  <Text variant="bodyMedium">{topic.label}</Text>
                  <Text variant="small" color="textMuted">
                    {topic.percent}%
                  </Text>
                </View>
                <View style={[styles.track, { backgroundColor: colors.surfaceSunken }]}>
                  <View
                    style={[styles.fill, { width: `${topic.percent}%`, backgroundColor: colors.accent }]}
                  />
                </View>
              </View>
            ))}
          </View>

          <SectionHeader title="Common positives" />
          <View style={styles.pointList}>
            {company.positives.map((p) => (
              <View key={p} style={styles.point}>
                <View style={[styles.pointIcon, { backgroundColor: colors.successSoft }]}>
                  <Check size={14} color={colors.success} strokeWidth={2.6} />
                </View>
                <Text variant="body" style={styles.flex}>
                  {p}
                </Text>
              </View>
            ))}
          </View>

          <SectionHeader title="Common challenges" />
          <View style={styles.pointList}>
            {company.challenges.map((c) => (
              <View key={c} style={styles.point}>
                <View style={[styles.pointIcon, { backgroundColor: colors.warningSoft }]}>
                  <TriangleAlert size={14} color={colors.warning} strokeWidth={2.4} />
                </View>
                <Text variant="body" style={styles.flex}>
                  {c}
                </Text>
              </View>
            ))}
          </View>

          <SectionHeader title="Recent stories" actionLabel="See all" onActionPress={() => setTab('Stories')} />
          <View style={styles.stack}>
            {recentStories.map((s) => (
              <StoryCard key={s.id} story={s} />
            ))}
          </View>

          <SectionHeader title="People who've worked here" actionLabel="See all" onActionPress={() => setTab('People')} />
          <View style={styles.stack}>
            {people.slice(0, 3).map((u) => (
              <PersonCard key={u.id} user={u} contextLine={u.headline} />
            ))}
          </View>
        </View>
      ) : null}

      {tab === 'Stories' ? (
        <View style={styles.section}>
          <View style={styles.filterRow}>
            {STORY_FILTERS.map((f) => (
              <Chip key={f} label={f} selected={storyFilter === f} onPress={() => setStoryFilter(f)} />
            ))}
          </View>
          {companyStories.length > 0 ? (
            <View style={styles.stack}>
              {companyStories.map((s) => (
                <StoryCard key={s.id} story={s} />
              ))}
            </View>
          ) : (
            <EmptyState title="No stories yet" message="No stories match this filter." />
          )}
        </View>
      ) : null}

      {tab === 'People' ? (
        <View style={styles.section}>
          {people.length > 0 ? (
            <View style={styles.stack}>
              {people.map((u) => (
                <PersonCard key={u.id} user={u} contextLine={u.headline} />
              ))}
            </View>
          ) : (
            <EmptyState title="No people yet" message="No one has added this company to their history." />
          )}
        </View>
      ) : null}

      {tab === 'Roles' ? (
        <View style={styles.section}>
          <View style={styles.stack}>
            {company.roleCategories.map((r) => (
              <View
                key={r.name}
                style={[styles.roleRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.flex}>
                  <Text variant="callout">{r.name}</Text>
                  <Text variant="small" color="textMuted">
                    {r.peopleCount.toLocaleString()} people
                  </Text>
                </View>
                <Text variant="bodyMedium" color="textSecondary">
                  {r.storyCount.toLocaleString()} stories
                </Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.lg },
  headerBlock: { alignItems: 'center', gap: spacing.xs, paddingTop: spacing.sm },
  name: { marginTop: spacing.sm },
  followBtn: { marginTop: spacing.md },
  tabs: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingBottom: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexWrap: 'wrap',
  },
  section: { gap: spacing.md },
  topics: { gap: spacing.md },
  topicRow: { gap: spacing.xs },
  topicLabel: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  track: { height: 8, borderRadius: radius.pill, overflow: 'hidden' },
  fill: { height: 8, borderRadius: radius.pill },
  pointList: { gap: spacing.sm },
  point: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  pointIcon: {
    width: 26,
    height: 26,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stack: { gap: spacing.md },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  flex: { flex: 1 },
});
