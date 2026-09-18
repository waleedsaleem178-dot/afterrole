import { Bookmark, MessageCircle, MoreHorizontal, ThumbsUp, Users } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { spacing } from '@/constants/spacing';
import { fontFamily } from '@/constants/typography';
import { useTheme } from '@/hooks/use-theme';
import { formatCount } from '@/lib/format';
import { haptics } from '@/lib/haptics';
import { displayBeenThere, displayHelpful, useStore } from '@/store';
import type { Story } from '@/types';

import type { IconType } from './ui/icon';
import { Text } from './ui/Text';

export interface ReactionBarProps {
  story: Story;
  onComment?: () => void;
  onMenu?: () => void;
  showSave?: boolean;
}

export function ReactionBar({ story, onComment, onMenu, showSave = true }: ReactionBarProps) {
  const { colors } = useTheme();

  const helpful = useStore((s) => s.helpful);
  const beenThere = useStore((s) => s.beenThere);
  const saved = useStore((s) => s.savedStories.includes(story.id));
  const toggleHelpful = useStore((s) => s.toggleHelpful);
  const toggleBeenThere = useStore((s) => s.toggleBeenThere);
  const toggleSaveStory = useStore((s) => s.toggleSaveStory);

  const helpfulActive = Boolean(helpful[story.id]);
  const beenThereActive = Boolean(beenThere[story.id]);

  return (
    <View style={styles.row}>
      <Action
        icon={ThumbsUp}
        label={formatCount(displayHelpful(story, helpful))}
        active={helpfulActive}
        activeColor={colors.accent}
        onPress={() => {
          haptics.light();
          toggleHelpful(story.id);
        }}
        accessibilityLabel="Helpful"
      />
      <Action
        icon={Users}
        label={`Been there · ${formatCount(displayBeenThere(story, beenThere))}`}
        active={beenThereActive}
        activeColor={colors.success}
        onPress={() => {
          haptics.light();
          toggleBeenThere(story.id);
        }}
        accessibilityLabel="Been there"
      />
      <Action
        icon={MessageCircle}
        label={formatCount(story.commentCount)}
        onPress={onComment}
        accessibilityLabel="Comments"
      />
      <View style={styles.spacer} />
      {showSave ? (
        <Action
          icon={Bookmark}
          active={saved}
          activeColor={colors.accent}
          filled={saved}
          onPress={() => {
            haptics.light();
            toggleSaveStory(story.id);
          }}
          accessibilityLabel={saved ? 'Unsave' : 'Save'}
        />
      ) : null}
      {onMenu ? (
        <Action icon={MoreHorizontal} onPress={onMenu} accessibilityLabel="More options" />
      ) : null}
    </View>
  );
}

interface ActionProps {
  icon: IconType;
  label?: string;
  active?: boolean;
  activeColor?: string;
  filled?: boolean;
  onPress?: () => void;
  accessibilityLabel: string;
}

function Action({ icon: Icon, label, active, activeColor, filled, onPress, accessibilityLabel }: ActionProps) {
  const { colors } = useTheme();
  const color = active && activeColor ? activeColor : colors.textSecondary;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      disabled={!onPress}
      hitSlop={6}
      style={({ pressed }) => [styles.action, pressed && styles.pressed]}>
      <Icon size={19} color={color} strokeWidth={2} fill={filled ? color : 'transparent'} />
      {label ? (
        <Text style={{ color, fontWeight: fontFamily.medium, fontSize: 13 }}>{label}</Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  action: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  pressed: { opacity: 0.6 },
  spacer: { flex: 1 },
});
