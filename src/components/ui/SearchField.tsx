import { Search, X } from 'lucide-react-native';
import { Pressable, type StyleProp, StyleSheet, TextInput, View, type ViewStyle } from 'react-native';

import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { fontFamily, typography } from '@/constants/typography';
import { useTheme } from '@/hooks/use-theme';

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
  style,
}: SearchFieldProps) {
  const { colors } = useTheme();

  const shell = (children: React.ReactNode) => (
    <View
      style={[
        styles.shell,
        { backgroundColor: colors.surface, borderColor: colors.border },
        style,
      ]}>
      <Search size={18} color={colors.textMuted} strokeWidth={2} />
      {children}
    </View>
  );

  if (!editable && onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
        {shell(
          <Text variant="body" color="textMuted" style={styles.flex} numberOfLines={1}>
            {placeholder}
          </Text>,
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
          <X size={16} color={colors.textMuted} strokeWidth={2} />
        </Pressable>
      ) : null}
    </>,
  );
}

const styles = StyleSheet.create({
  shell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: 46,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing.md,
  },
  flex: { flex: 1 },
  pressed: { opacity: 0.7 },
});
