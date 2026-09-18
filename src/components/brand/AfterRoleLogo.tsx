import { StyleSheet, Text, View } from 'react-native';

import { fontFamily } from '@/constants/typography';
import { useTheme } from '@/hooks/use-theme';

import { AfterRoleMark } from './AfterRoleMark';

export interface AfterRoleLogoProps {
  /** Wordmark font size. */
  size?: number;
  /** Show the doorway mark before the wordmark. */
  withMark?: boolean;
  /** Force a single color for both words (e.g. on colored surfaces). */
  monoColor?: string;
}

/**
 * The AfterRole wordmark: lowercase "after" in ink + "role" in brand green.
 */
export function AfterRoleLogo({ size = 22, withMark = false, monoColor }: AfterRoleLogoProps) {
  const { colors } = useTheme();
  const ink = monoColor ?? colors.textPrimary;
  const green = monoColor ?? colors.accent;

  return (
    <View style={styles.row}>
      {withMark ? <AfterRoleMark size={size * 1.15} color={monoColor ?? colors.forest} /> : null}
      <Text style={[styles.word, { fontSize: size, color: ink }]}>
        after<Text style={{ color: green }}>role</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  word: { fontFamily: fontFamily.bold, letterSpacing: -0.6, includeFontPadding: false },
});
