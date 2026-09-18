import { useLocalSearchParams, useRouter } from 'expo-router';
import { Briefcase, SearchX } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { CompanyCard } from '@/components/cards/CompanyCard';
import { PersonCard } from '@/components/cards/PersonCard';
import { StoryCard } from '@/components/cards/StoryCard';
import { AppHeader } from '@/components/ui/AppHeader';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Screen } from '@/components/ui/Screen';
import { SearchField } from '@/components/ui/SearchField';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SegmentTabs } from '@/components/ui/SegmentTabs';
import { Text } from '@/components/ui/Text';
import { spacing } from '@/constants/spacing';
import { radius } from '@/constants/radius';
import { useTheme } from '@/hooks/use-theme';
import { useCompanies } from '@/lib/company-directory';
import { searchAll } from '@/lib/search';

const SEGMENTS = ['All', 'Companies', 'People', 'Stories', 'Roles'] as const;

export default function SearchScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ q?: string }>();
  const [query, setQuery] = useState(params.q ?? '');
  const [segment, setSegment] = useState<string>('All');
  const { companies: pool } = useCompanies();

  const results = useMemo(() => searchAll(query, pool), [query, pool]);
  const companies = results.filter((r) => r.type === 'company');
  const people = results.filter((r) => r.type === 'person');
  const roles = results.filter((r) => r.type === 'role');
  const stories = results.filter((r) => r.type === 'story');

  const show = (s: string) => segment === 'All' || segment === s;

  const roleCard = (companyId: string, role: string, key: string) => (
    <Card key={key} padded onPress={() => router.push({ pathname: '/company/[id]', params: { id: companyId } })}>
      <View style={styles.roleRow}>
        <View style={[styles.roleIcon, { backgroundColor: colors.accentSubtle }]}>
          <Briefcase size={18} color={colors.accent} strokeWidth={2} />
        </View>
        <View style={styles.flex}>
          <Text variant="callout">{role}</Text>
          <Text variant="small" color="textMuted">
            Explore stories by role
          </Text>
        </View>
      </View>
    </Card>
  );

  return (
    <Screen scroll edges={['top']} contentStyle={styles.content}>
      <AppHeader showBack />
      <SearchField
        value={query}
        onChangeText={setQuery}
        onClear={() => setQuery('')}
        autoFocus={!params.q}
        size="lg"
        placeholder="Search a company, role or industry..."
      />

      {query.trim().length === 0 ? (
        <EmptyState title="Search AfterRole" message="Find companies, people, roles and workplace stories." />
      ) : results.length === 0 ? (
        <EmptyState icon={SearchX} title="No results" message={`Nothing matched “${query}”.`} />
      ) : (
        <>
          <SegmentTabs tabs={SEGMENTS} value={segment} onChange={setSegment} scrollable />
          <View style={styles.results}>
            {show('Companies') && companies.length > 0 ? (
              <View style={styles.group}>
                {segment === 'All' ? <SectionHeader title="Companies" /> : null}
                {companies.map((r) => r.type === 'company' && <CompanyCard key={r.key} company={r.company} />)}
              </View>
            ) : null}

            {show('People') && people.length > 0 ? (
              <View style={styles.group}>
                {segment === 'All' ? <SectionHeader title="People" /> : null}
                {people.map((r) => r.type === 'person' && <PersonCard key={r.key} user={r.user} />)}
              </View>
            ) : null}

            {show('Roles') && roles.length > 0 ? (
              <View style={styles.group}>
                {segment === 'All' ? <SectionHeader title="Roles" /> : null}
                {roles.map((r) => (r.type === 'role' ? roleCard(r.companyId, r.role, r.key) : null))}
              </View>
            ) : null}

            {show('Stories') && stories.length > 0 ? (
              <View style={styles.group}>
                {segment === 'All' ? <SectionHeader title="Stories" /> : null}
                {stories.map((r) => r.type === 'story' && <StoryCard key={r.key} story={r.story} />)}
              </View>
            ) : null}
          </View>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.lg },
  results: { gap: spacing.xxl },
  group: { gap: spacing.md },
  roleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  roleIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: { flex: 1 },
});
