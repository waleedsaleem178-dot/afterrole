import { Search, X } from 'lucide-react-native';
import { Pressable, type StyleProp, StyleSheet, TextInput, View, type ViewStyle } from 'react-native';

import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { fontFamily, typography } from '@/constants/typography';
import { useTheme } from '@/hooks/use-theme';

import type { IconType } from './icon';
import { Text } from './Text';

export interface SearchFieldProps {
  value?: string;
  onChangeText?: (v: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
  onClear?: () => void;
  /** Non-editable pill that navigates on tap (e.g. Home search entry). */
  onPress?: () => void;
  editable?: boolean;
  autoFocus?: boolean;
  /** Optional trailing control (e.g. a filter button) inside the pill. */
  trailingIcon?: IconType;
  onTrailingPress?: () => void;
  size?: 'md' | 'lg';
  style?: StyleProp<ViewStyle>;
}

export function SearchField({
  value,
  onChangeText,
  placeholder = 'Search…',
  onSubmit,
  onClear,
  onPress,
  editable = true,
  autoFocus,
  trailingIcon: Trailing,
  onTrailingPress,
  size = 'md',
  style,
}: SearchFieldProps) {
  const { colors } = useTheme();

  const trailing = Trailing ? (
    <Pressable
      onPress={onTrailingPress}
      hitSlop={8}
      accessibilityLabel="Filter"
      accessibilityRole="button"
      style={[styles.trailing, { backgroundColor: colors.surfaceSunken }]}>
      <Trailing size={16} color={colors.textSecondary} strokeWidth={2} />
    </Pressable>
  ) : null;

  const shell = (children: React.ReactNode) => (
    <View
      style={[
        styles.shell,
        size === 'lg' && styles.shellLg,
        { backgroundColor: colors.surface, borderColor: colors.border },
        style,
      ]}>
      <Search size={19} color={colors.textMuted} strokeWidth={2} />
      {children}
    </View>
  );

  if (!editable && onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
        {shell(
          <>
            <Text variant="body" color="textMuted" style={styles.flex} numberOfLines={1}>
              {placeholder}
            </Text>
            {trailing}
          </>,
        )}
      </Pressable>
    );
  }

  return shell(
    <>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        selectionColor={colors.accent}
        autoFocus={autoFocus}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
        style={[
          styles.flex,
          typography.body,
          { color: colors.textPrimary, fontFamily: fontFamily.regular, paddingVertical: 0 },
        ]}
      />
      {value && value.length > 0 ? (
        <Pressable onPress={onClear} hitSlop={8}>
          <X size={17} color={colors.textMuted} strokeWidth={2} />
        </Pressable>
      ) : (
        trailing
      )}
    </>,
  );
}

const styles = StyleSheet.create({
  shell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: 48,
    borderRadius: radius.input,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing.lg,
  },
  shellLg: { height: 54 },
  trailing: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: { flex: 1 },
  pressed: { opacity: 0.7 },
});
