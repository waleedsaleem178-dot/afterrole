import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { spacing } from '@/constants/spacing';
import { useTheme } from '@/hooks/use-theme';

import { AfterRoleMark } from './AfterRoleMark';

// Real brand wordmark ("afterrole") from the brand kit. *-light-bg is dark
// artwork for light surfaces; *-dark-bg is light artwork for dark surfaces.
const WORDMARKS = {
  light: require('@/assets/brand/afterrole-wordmark-light-bg.png'),
  dark: require('@/assets/brand/afterrole-wordmark-dark-bg.png'),
};
const WORDMARK_RATIO = 2172 / 724; // ≈ 3.0

export interface AfterRoleLogoProps {
  /** Wordmark height in px. */
  size?: number;
  /** Show the door mark before the wordmark. */
  withMark?: boolean;
}

/** The AfterRole wordmark (brand asset), optionally preceded by the door mark. */
export function AfterRoleLogo({ size = 22, withMark = false }: AfterRoleLogoProps) {
  const { isDark } = useTheme();
  const source = isDark ? WORDMARKS.dark : WORDMARKS.light;

  return (
    <View style={styles.row}>
      {withMark ? <AfterRoleMark size={size * 1.2} /> : null}
      <Image
        source={source}
        style={{ height: size, width: size * WORDMARK_RATIO }}
        contentFit="contain"
        accessibilityLabel="afterrole"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
