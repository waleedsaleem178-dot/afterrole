import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';
import { type Edge, SafeAreaView } from 'react-native-safe-area-context';

import { layout, spacing } from '@/constants/spacing';
import { useTheme } from '@/hooks/use-theme';

export interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  edges?: Edge[];
  /** Sticky content pinned to the bottom (e.g. a primary action bar). */
  footer?: ReactNode;
  keyboardAware?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  background?: 'background' | 'surface';
}

export function Screen({
  children,
  scroll = false,
  padded = true,
  edges = ['top'],
  footer,
  keyboardAware = false,
  contentStyle,
  style,
  background = 'background',
}: ScreenProps) {
  const { colors } = useTheme();
  const padStyle = padded ? { paddingHorizontal: layout.screenPaddingX } : null;

  const inner = scroll ? (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[styles.scrollContent, styles.centered, padStyle, contentStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, styles.centered, padStyle, contentStyle]}>{children}</View>
  );

  const body = keyboardAware ? (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {inner}
    </KeyboardAvoidingView>
  ) : (
    inner
  );

  return (
    <SafeAreaView
      edges={edges}
      style={[styles.flex, { backgroundColor: colors[background] }, style]}>
      {body}
      {footer ? (
        <View
          style={[
            styles.footer,
            { backgroundColor: colors[background], borderTopColor: colors.border },
            padStyle,
          ]}>
          <View style={styles.footerInner}>{footer}</View>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  centered: { width: '100%', maxWidth: layout.maxContentWidth, alignSelf: 'center' },
  scrollContent: { paddingBottom: spacing.huge, flexGrow: 1 },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  footerInner: {
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
    gap: spacing.sm,
  },
});
