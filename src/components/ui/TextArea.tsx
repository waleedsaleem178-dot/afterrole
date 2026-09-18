import { useState } from 'react';
import {
  type StyleProp,
  StyleSheet,
  TextInput,
  type TextInputProps,
  View,
  type ViewStyle,
} from 'react-native';

import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { fontFamily, typography } from '@/constants/typography';
import { useTheme } from '@/hooks/use-theme';

import { Text } from './Text';

export interface TextAreaProps extends TextInputProps {
  label?: string;
  hint?: string;
  minHeight?: number;
  containerStyle?: StyleProp<ViewStyle>;
}

export function TextArea({
  label,
  hint,
  minHeight = 120,
  containerStyle,
  style,
  ...rest
}: TextAreaProps) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <Text variant="label" color="textSecondary">
          {label}
        </Text>
      ) : null}
      <TextInput
        multiline
        textAlignVertical="top"
        placeholderTextColor={colors.textMuted}
        selectionColor={colors.accent}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[
          styles.input,
          typography.body,
          {
            minHeight,
            color: colors.textPrimary,
            backgroundColor: colors.surface,
            borderColor: focused ? colors.accent : colors.border,
            fontFamily: fontFamily.regular,
          },
          style,
        ]}
        {...rest}
      />
      {hint ? (
        <Text variant="small" color="textMuted">
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm },
  input: {
    borderRadius: radius.input,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
});
