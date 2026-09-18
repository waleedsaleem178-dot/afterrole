import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { spacing } from '@/constants/spacing';
import { haptics } from '@/lib/haptics';
import { useStore } from '@/store';
import type { User } from '@/types';

import { Avatar } from '../ui/Avatar';
import { VerifiedBadge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Text } from '../ui/Text';

export interface PersonCardProps {
  user: User;
  /** Optional employment context line (e.g. period at a specific company). */
  contextLine?: string;
  onPress?: () => void;
  showFollow?: boolean;
}

export function PersonCard({ user, contextLine, onPress, showFollow = true }: PersonCardProps) {
  const router = useRouter();
  const isSelf = useStore((s) => s.profile.id === user.id);
  const following = useStore((s) => s.followedUsers.includes(user.id));
  const toggleFollow = useStore((s) => s.toggleFollowUser);

  const go = () => router.push({ pathname: '/user/[id]', params: { id: user.id } });

  return (
    <Card padded onPress={onPress ?? go}>
      <View style={styles.row}>
        <Avatar name={user.name} color={user.avatarColor} size={48} verified={user.verified} showVerified />
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text variant="callout" numberOfLines={1}>
              {user.name}
            </Text>
            {user.verified ? <VerifiedBadge /> : null}
          </View>
          <Text variant="small" color="textSecondary" numberOfLines={1}>
            {user.headline}
          </Text>
          {contextLine ? (
            <Text variant="small" color="textMuted" numberOfLines={1}>
              {contextLine}
            </Text>
          ) : null}
        </View>
        {showFollow && !isSelf ? (
          <Button
            label={following ? 'Following' : 'Follow'}
            variant={following ? 'secondary' : 'primary'}
            size="sm"
            fullWidth={false}
            onPress={() => {
              haptics.light();
              toggleFollow(user.id);
            }}
          />
        ) : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  info: { flex: 1, gap: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
});
