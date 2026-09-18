import { useRouter } from 'expo-router';
import { BadgeCheck, Bell, Building2, MessageCircle, ThumbsUp, UserPlus } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { EmptyState } from '@/components/ui/EmptyState';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import type { IconType } from '@/components/ui/icon';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { getCompanyById, getUserById } from '@/data';
import { type MergedNotification, useNotifications } from '@/hooks/use-notifications';
import { useTheme } from '@/hooks/use-theme';
import { relativeTime } from '@/lib/format';
import { haptics } from '@/lib/haptics';
import { useStore } from '@/store';
import type { NotificationType } from '@/types';

const ICONS: Record<NotificationType, IconType> = {
  helpful: ThumbsUp,
  comment: MessageCircle,
  follow: UserPlus,
  company_stories: Building2,
  verification: BadgeCheck,
};

export default function ActivityScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { notifications, unreadCount } = useNotifications();
  const markRead = useStore((s) => s.markNotificationRead);
  const markAllRead = useStore((s) => s.markAllNotificationsRead);

  const open = (n: MergedNotification) => {
    haptics.light();
    markRead(n.id);
    if (n.storyId) router.push({ pathname: '/story/[id]', params: { id: n.storyId } });
    else if (n.type === 'follow' && n.actorId)
      router.push({ pathname: '/user/[id]', params: { id: n.actorId } });
    else if (n.companyId) router.push({ pathname: '/company/[id]', params: { id: n.companyId } });
    else if (n.type === 'verification') router.push('/work-history');
  };

  return (
    <Screen scroll edges={['top']} contentStyle={styles.content}>
      <View style={styles.header}>
        <Text variant="title">Activity</Text>
        {unreadCount > 0 ? (
          <Pressable onPress={() => markAllRead(notifications.map((n) => n.id))} hitSlop={8}>
            <Text variant="label" style={{ color: colors.accent }}>
              Mark all read
            </Text>
          </Pressable>
        ) : null}
      </View>

      {notifications.length === 0 ? (
        <EmptyState icon={Bell} title="Nothing yet" message="Your activity will show up here." />
      ) : (
        <View style={styles.list}>
          {notifications.map((n) => {
            const Icon = ICONS[n.type];
            const actor = getUserById(n.actorId);
            const company = getCompanyById(n.companyId);
            const subject = actor?.name ?? company?.name ?? '';
            return (
              <Pressable
                key={n.id}
                onPress={() => open(n)}
                style={({ pressed }) => [
                  styles.row,
                  { backgroundColor: n.isRead ? 'transparent' : colors.accentSubtle },
                  pressed && styles.pressed,
                ]}>
                {actor ? (
                  <Avatar name={actor.name} color={actor.avatarColor} size={40} />
                ) : (
                  <View style={[styles.iconWrap, { backgroundColor: colors.accentSoft }]}>
                    <Icon size={18} color={colors.accent} strokeWidth={2} />
                  </View>
                )}
                <View style={styles.flex}>
                  <Text variant="body" numberOfLines={2}>
                    {subject ? <Text variant="bodyMedium">{subject} </Text> : null}
                    {n.message}
                  </Text>
                  <Text variant="small" color="textMuted">
                    {relativeTime(n.createdAt)}
                  </Text>
                </View>
                {!n.isRead ? <View style={[styles.dot, { backgroundColor: colors.accent }]} /> : null}
              </Pressable>
            );
          })}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.lg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  list: { gap: spacing.xxs },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: { flex: 1, gap: 2 },
  dot: { width: 8, height: 8, borderRadius: radius.pill },
  pressed: { opacity: 0.7 },
});
