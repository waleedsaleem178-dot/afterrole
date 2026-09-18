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
import { Text } from '@/components/ui/Text';
import { spacing } from '@/constants/spacing';
import { useTheme } from '@/hooks/use-theme';
import { searchAll } from '@/lib/search';

export default function SearchScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ q?: string }>();
  const [query, setQuery] = useState(params.q ?? '');

  const results = useMemo(() => searchAll(query), [query]);
  const companies = results.filter((r) => r.type === 'company');
  const people = results.filter((r) => r.type === 'person');
  const roles = results.filter((r) => r.type === 'role');
  const stories = results.filter((r) => r.type === 'story');

  return (
    <Screen scroll edges={['top']} contentStyle={styles.content}>
      <View style={styles.headerRow}>
        <AppHeader showBack />
        <View style={styles.searchWrap}>
          <SearchField
            value={query}
            onChangeText={setQuery}
            onClear={() => setQuery('')}
            autoFocus={!params.q}
            placeholder="Search a company, role or industry..."
          />
        </View>
      </View>

      {query.trim().length === 0 ? (
        <EmptyState
          title="Search AfterRole"
          message="Find companies, people, roles and workplace stories."
        />
      ) : results.length === 0 ? (
        <EmptyState icon={SearchX} title="No results" message={`Nothing matched “${query}”.`} />
      ) : (
        <View style={styles.results}>
          {companies.length > 0 ? (
            <View style={styles.group}>
              <SectionHeader title="Companies" />
              {companies.map((r) => r.type === 'company' && <CompanyCard key={r.key} company={r.company} />)}
            </View>
          ) : null}

          {people.length > 0 ? (
            <View style={styles.group}>
              <SectionHeader title="People" />
              {people.map((r) => r.type === 'person' && <PersonCard key={r.key} user={r.user} />)}
            </View>
          ) : null}

          {roles.length > 0 ? (
            <View style={styles.group}>
              <SectionHeader title="Roles" />
              {roles.map(
                (r) =>
                  r.type === 'role' && (
                    <Card
                      key={r.key}
                      padded
                      onPress={() =>
                        router.push({ pathname: '/company/[id]', params: { id: r.companyId } })
                      }>
                      <View style={styles.roleRow}>
                        <View style={[styles.roleIcon, { backgroundColor: colors.accentSoft }]}>
                          <Briefcase size={18} color={colors.accent} strokeWidth={2} />
                        </View>
                        <View style={styles.flex}>
                          <Text variant="callout">{r.role}</Text>
                          <Text variant="small" color="textMuted">
                            Explore stories by role
                          </Text>
                        </View>
                      </View>
                    </Card>
                  ),
              )}
            </View>
          ) : null}

          {stories.length > 0 ? (
            <View style={styles.group}>
              <SectionHeader title="Stories" />
              {stories.map((r) => r.type === 'story' && <StoryCard key={r.key} story={r.story} />)}
            </View>
          ) : null}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.lg },
  headerRow: { gap: spacing.md },
  searchWrap: { paddingHorizontal: spacing.xs },
  results: { gap: spacing.xxl },
  group: { gap: spacing.md },
  roleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  roleIcon: {
    width: 40,
    height: 40,
    borderRadius: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: { flex: 1 },
});
