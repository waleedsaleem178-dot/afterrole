import { useRouter } from 'expo-router';
import { Users } from 'lucide-react-native';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { CompanyCard } from '@/components/cards/CompanyCard';
import { PersonCard } from '@/components/cards/PersonCard';
import { AppHeader } from '@/components/ui/AppHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { spacing } from '@/constants/spacing';
import { getCompanyById, getUserById } from '@/data';
import { useStore } from '@/store';

export default function FollowingScreen() {
  const router = useRouter();
  const followedUsers = useStore((s) => s.followedUsers);
  const followedCompanies = useStore((s) => s.followedCompanies);

  const users = useMemo(
    () => followedUsers.map((id) => getUserById(id)).filter((u): u is NonNullable<typeof u> => Boolean(u)),
    [followedUsers],
  );
  const companies = useMemo(
    () => followedCompanies.map((id) => getCompanyById(id)).filter((c): c is NonNullable<typeof c> => Boolean(c)),
    [followedCompanies],
  );

  const isEmpty = users.length === 0 && companies.length === 0;

  return (
    <Screen scroll edges={['top', 'bottom']} contentStyle={styles.content}>
      <AppHeader showBack title="Following" />

      {isEmpty ? (
        <EmptyState
          icon={Users}
          title="Not following anyone yet"
          message="Follow people and companies to keep up with their stories."
          actionLabel="Find people & companies"
          onAction={() => router.push('/discover')}
        />
      ) : (
        <>
          {companies.length > 0 ? (
            <View style={styles.section}>
              <SectionHeader title="Companies" />
              {companies.map((c) => (
                <CompanyCard key={c.id} company={c} showFollow />
              ))}
            </View>
          ) : null}
          {users.length > 0 ? (
            <View style={styles.section}>
              <SectionHeader title="People" />
              {users.map((u) => (
                <PersonCard key={u.id} user={u} contextLine={u.headline} />
              ))}
            </View>
          ) : null}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.xxl },
  section: { gap: spacing.md },
});
