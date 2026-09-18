import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { fontFamily } from '@/constants/typography';
import { formatCount } from '@/lib/format';
import { haptics } from '@/lib/haptics';
import { useStore } from '@/store';
import type { Company } from '@/types';

import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Text } from '../ui/Text';

export interface CompanyCardProps {
  company: Company;
  onPress?: () => void;
  showFollow?: boolean;
}

export function CompanyLogo({ company, size = 48 }: { company: Company; size?: number }) {
  return (
    <View
      style={[
        styles.logo,
        { width: size, height: size, borderRadius: radius.md, backgroundColor: company.logoColor },
      ]}>
      <Text style={{ color: '#FFFFFF', fontWeight: fontFamily.bold, fontSize: size * 0.42 }}>
        {company.name.charAt(0)}
      </Text>
    </View>
  );
}

export function CompanyCard({ company, onPress, showFollow = false }: CompanyCardProps) {
  const router = useRouter();
  const following = useStore((s) => s.followedCompanies.includes(company.id));
  const toggleFollow = useStore((s) => s.toggleFollowCompany);

  const go = () => router.push({ pathname: '/company/[id]', params: { id: company.id } });

  return (
    <Card padded onPress={onPress ?? go}>
      <View style={styles.row}>
        <CompanyLogo company={company} />
        <View style={styles.info}>
          <Text variant="callout" numberOfLines={1}>
            {company.name}
          </Text>
          <Text variant="small" color="textSecondary" numberOfLines={1}>
            {company.country ? `${company.industry} · ${company.country}` : company.industry}
          </Text>
          <Text variant="small" color="textMuted" numberOfLines={1}>
            {company.storyCount > 0 ? `${formatCount(company.storyCount)} stories` : 'No stories yet'}
          </Text>
        </View>
        {showFollow ? (
          <Button
            label={following ? 'Following' : 'Follow'}
            variant={following ? 'secondary' : 'primary'}
            size="sm"
            fullWidth={false}
            onPress={() => {
              haptics.light();
              toggleFollow(company.id);
            }}
          />
        ) : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  logo: { alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  info: { flex: 1, gap: 1 },
});
