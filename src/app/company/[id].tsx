import { useLocalSearchParams, useRouter } from 'expo-router';
import { Check, Flag, MoreHorizontal, PenLine, Share2 } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { CompanyLogo } from '@/components/cards/CompanyCard';
import { PersonCard } from '@/components/cards/PersonCard';
import { StoryCard } from '@/components/cards/StoryCard';
import { AppHeader } from '@/components/ui/AppHeader';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { EmptyState } from '@/components/ui/EmptyState';
import { IconButton } from '@/components/ui/IconButton';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SegmentTabs } from '@/components/ui/SegmentTabs';
import { Text } from '@/components/ui/Text';
import { TopicBar } from '@/components/ui/TopicBar';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { fontFamily } from '@/constants/typography';
import { getCompanyById, getPeopleForCompany, getStoriesByCompany, mockStories } from '@/data';
import { useCompanies } from '@/lib/company-directory';
import { useTheme } from '@/hooks/use-theme';
import { haptics } from '@/lib/haptics';
import { combineStories, useStore } from '@/store';

const TABS = ['Overview', 'Stories', 'People', 'Roles'] as const;
const STORY_FILTERS = ['Most helpful', 'Newest', 'Current', 'Former'] as const;

export default function CompanyDetailScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { companies } = useCompanies();
  const company = useMemo(
    () => companies.find((c) => c.id === id) ?? getCompanyById(id),
    [companies, id],
  );

  const following = useStore((s) => s.followedCompanies.includes(id ?? ''));
  const toggleFollow = useStore((s) => s.toggleFollowCompany);
  const createdStories = useStore((s) => s.createdStories);

  const [tab, setTab] = useState<string>('Overview');
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

  // Directory companies have no aggregated insights or stories yet.
  const hasInsights =
    company.topics.length > 0 || company.positives.length > 0 || company.challenges.length > 0;
  const startStory = () => {
    haptics.light();
    router.push('/create/step-1');
  };

  return (
    <Screen scroll edges={['top']} contentStyle={styles.content}>
      <AppHeader
        showBack
        rightSlot={
          <View style={styles.headerActions}>
            <IconButton icon={Share2} accessibilityLabel="Share" variant="surface" onPress={() => haptics.light()} />
            <IconButton icon={MoreHorizontal} accessibilityLabel="More" variant="surface" onPress={() => haptics.light()} />
          </View>
        }
      />

      {/* Cover banner */}
      <View style={[styles.banner, { backgroundColor: colors.surfaceSunken }]}>
        <View style={[styles.bannerTint, { backgroundColor: company.logoColor }]} />
        <Text style={[styles.bannerInitial, { color: company.logoColor }]}>{company.name.charAt(0)}</Text>
      </View>

      {/* Identity */}
      <View style={styles.identity}>
        <View style={[styles.logoRing, { backgroundColor: colors.background }]}>
          <CompanyLogo company={company} size={60} />
        </View>
        <Text variant="title" style={styles.name}>
          {company.name}
        </Text>
        <Text variant="body" color="textSecondary">
          {company.country ? `${company.industry} · ${company.country}` : company.industry}
        </Text>
        <Text variant="callout" color="accent" style={styles.count}>
          {company.storyCount > 0
            ? `${company.storyCount.toLocaleString()} workplace experiences`
            : 'No stories yet — be the first'}
        </Text>
        <Button
          label={following ? 'Following' : 'Follow'}
          variant={following ? 'secondary' : 'primary'}
          onPress={() => {
            haptics.light();
            toggleFollow(company.id);
          }}
          style={styles.followBtn}
        />
      </View>

      <SegmentTabs tabs={TABS} value={tab} onChange={setTab} />

      {tab === 'Overview' ? (
        !hasInsights ? (
          <EmptyState
            icon={PenLine}
            title="No stories about this company yet"
            message="Worked here or interviewed? Share what it was actually like — under your real professional profile."
            actionLabel="Share your experience"
            onAction={startStory}
          />
        ) : (
          <View style={styles.section}>
            <SectionHeader title="What people talk about most" subtitle="Frequently mentioned — not a rating." />
            <View style={styles.topics}>
              {company.topics.map((topic, i) => (
                <TopicBar key={topic.label} label={topic.label} percent={topic.percent} index={i} />
              ))}
            </View>

            <View style={styles.twoCol}>
              <View style={styles.col}>
                <Text variant="subtitle">Common green flags</Text>
                {company.positives.map((p) => (
                  <Point key={p} label={p} tone="success" />
                ))}
              </View>
              <View style={styles.col}>
                <Text variant="subtitle">Common red flags</Text>
                {company.challenges.map((c) => (
                  <Point key={c} label={c} tone="danger" />
                ))}
              </View>
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
        )
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
          {company.roleCategories.length === 0 ? (
            <EmptyState title="No roles yet" message="Roles appear once people share stories from this company." />
          ) : null}
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

function Point({ label, tone }: { label: string; tone: 'success' | 'danger' }) {
  const { colors } = useTheme();
  const bg = tone === 'success' ? colors.successSoft : colors.dangerSoft;
  const fg = tone === 'success' ? colors.success : colors.danger;
  return (
    <View style={styles.point}>
      <View style={[styles.pointIcon, { backgroundColor: bg }]}>
        {tone === 'success' ? (
          <Check size={12} color={fg} strokeWidth={2.8} />
        ) : (
          <Flag size={12} color={fg} strokeWidth={2.6} />
        )}
      </View>
      <Text variant="body" color="textSecondary" style={styles.flex}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.lg },
  headerActions: { flexDirection: 'row', gap: spacing.sm },
  banner: {
    height: 128,
    borderRadius: radius.xl,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerTint: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.14 },
  bannerInitial: { fontWeight: fontFamily.bold, fontSize: 96, opacity: 0.24 },
  identity: { alignItems: 'center', gap: spacing.xs, marginTop: -42 },
  logoRing: { padding: 4, borderRadius: radius.lg },
  name: { marginTop: spacing.sm },
  count: { marginTop: spacing.xxs },
  followBtn: { marginTop: spacing.md, alignSelf: 'stretch' },
  section: { gap: spacing.lg },
  topics: { gap: spacing.md },
  twoCol: { gap: spacing.xl },
  col: { gap: spacing.md },
  point: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  pointIcon: {
    width: 24,
    height: 24,
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
    borderRadius: radius.card,
    borderWidth: StyleSheet.hairlineWidth,
  },
  flex: { flex: 1 },
});
