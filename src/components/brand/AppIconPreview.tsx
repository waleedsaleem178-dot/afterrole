import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

import { AfterRoleMark } from './AfterRoleMark';

export interface AppIconPreviewProps {
  size?: number;
}

/**
 * App icon preview: deep forest field, warm-ivory doorway mark, generous
 * breathing room, no text. (iOS applies its own squircle mask; we approximate
 * with a rounded square here.)
 */
export function AppIconPreview({ size = 96 }: AppIconPreviewProps) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.icon,
        { width: size, height: size, borderRadius: size * 0.225, backgroundColor: colors.forest },
      ]}>
      <AfterRoleMark size={size * 0.56} color={colors.textInverse} />
    </View>
  );
}

const styles = StyleSheet.create({
  icon: { alignItems: 'center', justifyContent: 'center' },
});
