import { Pressable, StyleSheet, View } from 'react-native';

import { spacing } from '@/constants/spacing';
import { useTheme } from '@/hooks/use-theme';
import { formatCount } from '@/lib/format';

import { Text } from './ui/Text';

export interface ProfileStatsProps {
  storyCount: number;
  followerCount: number;
  followingCount: number;
  onStories?: () => void;
  onFollowers?: () => void;
  onFollowing?: () => void;
}

export function ProfileStats({
  storyCount,
  followerCount,
  followingCount,
  onStories,
  onFollowers,
  onFollowing,
}: ProfileStatsProps) {
  const { colors } = useTheme();

  const items: { label: string; value: number; onPress?: () => void }[] = [
    { label: 'Stories', value: storyCount, onPress: onStories },
    { label: 'Followers', value: followerCount, onPress: onFollowers },
    { label: 'Following', value: followingCount, onPress: onFollowing },
  ];

  return (
    <View style={[styles.row, { borderColor: colors.border }]}>
      {items.map((it, i) => (
        <Pressable
          key={it.label}
          onPress={it.onPress}
          disabled={!it.onPress}
          style={({ pressed }) => [
            styles.item,
            i < items.length - 1 && { borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: colors.border },
            pressed && it.onPress ? styles.pressed : null,
          ]}>
          <Text variant="subtitle">{formatCount(it.value)}</Text>
          <Text variant="small" color="textMuted">
            {it.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    marginTop: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 16,
    overflow: 'hidden',
  },
  item: { flex: 1, alignItems: 'center', gap: 2, paddingVertical: spacing.md },
  pressed: { opacity: 0.6 },
});
