import { useRouter } from 'expo-router';
import { SlidersHorizontal } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { CompanyCard } from '@/components/cards/CompanyCard';
import { PersonCard } from '@/components/cards/PersonCard';
import { StoryCard } from '@/components/cards/StoryCard';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Screen } from '@/components/ui/Screen';
import { SearchField } from '@/components/ui/SearchField';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Text } from '@/components/ui/Text';
import { spacing } from '@/constants/spacing';
import { directoryCompanies, mockCompanies, mockStories, mockUsers } from '@/data';
import { INDUSTRIES } from '@/lib/search';
import { useStore } from '@/store';

type EmploymentFilter = 'All' | 'Current' | 'Former';
const EMPLOYMENT_FILTERS: EmploymentFilter[] = ['All', 'Current', 'Former'];
const LOCATIONS = ['Remote', 'Hybrid', 'On-site'];
const ROLES = ['Engineering', 'Product', 'Marketing', 'Sales', 'Operations'];
const SIZES = ['Startup', 'Mid-size', 'Enterprise'];

type CountryFilter = 'All' | 'United States' | 'Pakistan';
const COUNTRY_FILTERS: CountryFilter[] = ['All', 'United States', 'Pakistan'];

export default function DiscoverScreen() {
  const router = useRouter();
  const profile = useStore((s) => s.profile);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [industry, setIndustry] = useState<string | null>(null);
  const [employment, setEmployment] = useState<EmploymentFilter>('All');
  const [location, setLocation] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);

  const activeCount = [industry, location, role, size].filter(Boolean).length + (employment !== 'All' ? 1 : 0);

  const exploringCompanies = useMemo(() => {
    const list = industry
      ? mockCompanies.filter((c) => c.industry.toLowerCase().includes(industry.toLowerCase()))
      : mockCompanies;
    return [...list].sort((a, b) => b.storyCount - a.storyCount).slice(0, 5);
  }, [industry]);

  const trendingStories = useMemo(() => {
    const list =
      employment === 'All'
        ? mockStories
        : mockStories.filter((s) =>
            employment === 'Current' ? s.employmentStatus === 'current' : s.employmentStatus === 'former',
          );
    return [...list].sort((a, b) => b.helpfulCount - a.helpfulCount).slice(0, 4);
  }, [employment]);

  const careerMoves = useMemo(() => mockStories.filter((s) => s.employmentStatus === 'former').slice(0, 3), []);
  const peopleToFollow = useMemo(() => mockUsers.filter((u) => u.id !== profile.id).slice(0, 3), [profile.id]);
  const discussed = useMemo(() => [...mockCompanies].slice(4, 8), []);

  const [country, setCountry] = useState<CountryFilter>('All');
  const browseCompanies = useMemo(() => {
    const list =
      country === 'All' ? directoryCompanies : directoryCompanies.filter((c) => c.country === country);
    return list.slice(0, 8);
  }, [country]);

  const resetFilters = () => {
    setIndustry(null);
    setEmployment('All');
    setLocation(null);
    setRole(null);
    setSize(null);
  };

  return (
    <>
      <Screen scroll edges={['top']} contentStyle={styles.content}>
        <Text variant="title">Discover</Text>
        <SearchField
          editable={false}
          size="lg"
          placeholder="Search companies, people, roles..."
          onPress={() => router.push('/search')}
          trailingIcon={SlidersHorizontal}
          onTrailingPress={() => setSheetOpen(true)}
        />

        {activeCount > 0 ? (
          <Text variant="label" color="accent">
            {activeCount} filter{activeCount > 1 ? 's' : ''} applied
          </Text>
        ) : null}

        <View style={styles.section}>
          <SectionHeader title="Companies people are exploring" />
          <View style={styles.stack}>
            {exploringCompanies.map((c) => (
              <CompanyCard key={c.id} company={c} showFollow />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader
            title="Browse companies"
            subtitle={`${directoryCompanies.length.toLocaleString()} real companies · US & Pakistan`}
            actionLabel="Search all"
            onActionPress={() => router.push('/search')}
          />
          <View style={styles.wrapRow}>
            {COUNTRY_FILTERS.map((c) => (
              <Chip key={c} label={c} tone="forest" selected={country === c} onPress={() => setCountry(c)} />
            ))}
          </View>
          <View style={styles.stack}>
            {browseCompanies.map((c) => (
              <CompanyCard key={c.id} company={c} showFollow />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Trending stories" />
          <View style={styles.stack}>
            {trendingStories.map((s) => (
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

      <BottomSheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Filters"
        footer={
          <View style={styles.sheetFooter}>
            <Button label="Reset" variant="secondary" fullWidth={false} onPress={resetFilters} style={styles.flex} />
            <Button label="Show results" fullWidth={false} onPress={() => setSheetOpen(false)} style={styles.flex} />
          </View>
        }>
        <FilterGroup title="Employment">
          {EMPLOYMENT_FILTERS.map((f) => (
            <Chip key={f} label={f} selected={employment === f} onPress={() => setEmployment(f)} />
          ))}
        </FilterGroup>
        <FilterGroup title="Industry">
          <Chip label="All" selected={industry === null} onPress={() => setIndustry(null)} />
          {INDUSTRIES.map((i) => (
            <Chip key={i} label={i} selected={industry === i} onPress={() => setIndustry(industry === i ? null : i)} />
          ))}
        </FilterGroup>
        <FilterGroup title="Location">
          {LOCATIONS.map((l) => (
            <Chip key={l} label={l} selected={location === l} onPress={() => setLocation(location === l ? null : l)} />
          ))}
        </FilterGroup>
        <FilterGroup title="Role">
          {ROLES.map((r) => (
            <Chip key={r} label={r} selected={role === r} onPress={() => setRole(role === r ? null : r)} />
          ))}
        </FilterGroup>
        <FilterGroup title="Company size">
          {SIZES.map((s) => (
            <Chip key={s} label={s} selected={size === s} onPress={() => setSize(size === s ? null : s)} />
          ))}
        </FilterGroup>
      </BottomSheet>
    </>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.filterGroup}>
      <Text variant="label" color="textSecondary">
        {title}
      </Text>
      <View style={styles.wrapRow}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.xxl },
  section: { gap: spacing.md },
  stack: { gap: spacing.md },
  wrapRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  filterGroup: { gap: spacing.md },
  sheetFooter: { flexDirection: 'row', gap: spacing.md },
  flex: { flex: 1 },
});
