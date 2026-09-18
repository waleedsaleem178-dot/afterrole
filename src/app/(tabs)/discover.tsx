import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { CompanyCard } from '@/components/cards/CompanyCard';
import { PersonCard } from '@/components/cards/PersonCard';
import { StoryCard } from '@/components/cards/StoryCard';
import { Chip } from '@/components/ui/Chip';
import { Screen } from '@/components/ui/Screen';
import { SearchField } from '@/components/ui/SearchField';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Text } from '@/components/ui/Text';
import { spacing } from '@/constants/spacing';
import { mockCompanies, mockStories, mockUsers } from '@/data';
import { INDUSTRIES } from '@/lib/search';
import { useStore } from '@/store';

type EmploymentFilter = 'All' | 'Current' | 'Former';
const EMPLOYMENT_FILTERS: EmploymentFilter[] = ['All', 'Current', 'Former'];

export default function DiscoverScreen() {
  const router = useRouter();
  const profile = useStore((s) => s.profile);

  const [industry, setIndustry] = useState<string | null>(null);
  const [employment, setEmployment] = useState<EmploymentFilter>('All');

  const trendingCompanies = useMemo(() => {
    const list = industry
      ? mockCompanies.filter((c) => c.industry.toLowerCase().includes(industry.toLowerCase()))
      : mockCompanies;
    return [...list].sort((a, b) => b.storyCount - a.storyCount).slice(0, 5);
  }, [industry]);

  const popularStories = useMemo(() => {
    const list =
      employment === 'All'
        ? mockStories
        : mockStories.filter((s) =>
            employment === 'Current' ? s.employmentStatus === 'current' : s.employmentStatus === 'former',
          );
    return [...list].sort((a, b) => b.helpfulCount - a.helpfulCount).slice(0, 4);
  }, [employment]);

  const careerMoves = useMemo(
    () => mockStories.filter((s) => s.employmentStatus === 'former').slice(0, 3),
    [],
  );
  const peopleToFollow = useMemo(() => mockUsers.filter((u) => u.id !== profile.id).slice(0, 3), [profile.id]);
  const discussed = useMemo(() => [...mockCompanies].slice(4, 8), []);

  return (
    <Screen scroll edges={['top']} contentStyle={styles.content}>
      <Text variant="title">Discover</Text>
      <SearchField
        editable={false}
        placeholder="Search companies, people, roles, industries..."
        onPress={() => router.push('/search')}
      />

      {/* Filters */}
      <View style={styles.filters}>
        <Text variant="label" color="textSecondary">
          Filter by industry
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          <Chip label="All" selected={industry === null} onPress={() => setIndustry(null)} />
          {INDUSTRIES.map((i) => (
            <Chip key={i} label={i} selected={industry === i} onPress={() => setIndustry(i)} />
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Trending companies" />
        <View style={styles.stack}>
          {trendingCompanies.map((c) => (
            <CompanyCard key={c.id} company={c} showFollow />
          ))}
        </View>
      </View>

      {/* Employment filter */}
      <View style={styles.section}>
        <SectionHeader title="Popular stories" />
        <View style={styles.segment}>
          {EMPLOYMENT_FILTERS.map((f) => (
            <Chip key={f} label={f} selected={employment === f} onPress={() => setEmployment(f)} />
          ))}
        </View>
        <View style={styles.stack}>
          {popularStories.map((s) => (
            <StoryCard key={s.id} story={s} />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Career moves" subtitle="Why people moved on — in their own words." />
        <View style={styles.stack}>
          {careerMoves.map((s) => (
            <StoryCard key={s.id} story={s} />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader title="People to follow" />
        <View style={styles.stack}>
          {peopleToFollow.map((u) => (
            <PersonCard key={u.id} user={u} contextLine={u.headline} />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Popular industries" />
        <View style={styles.wrapRow}>
          {INDUSTRIES.map((i) => (
            <Chip key={i} label={i} onPress={() => router.push({ pathname: '/search', params: { q: i } })} />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Recently discussed" />
        <View style={styles.stack}>
          {discussed.map((c) => (
            <CompanyCard key={c.id} company={c} />
          ))}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.xxl },
  filters: { gap: spacing.sm },
  chipRow: { gap: spacing.sm, paddingRight: spacing.lg },
  section: { gap: spacing.md },
  segment: { flexDirection: 'row', gap: spacing.sm },
  stack: { gap: spacing.md },
  wrapRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});
