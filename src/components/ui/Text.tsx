import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import type { ThemeColorName } from '@/constants/colors';
import { typography, type TypographyVariant } from '@/constants/typography';
import { useTheme } from '@/hooks/use-theme';

export interface TextProps extends RNTextProps {
  variant?: TypographyVariant;
  color?: ThemeColorName;
  center?: boolean;
}

export function Text({
  variant = 'body',
  color = 'textPrimary',
  center,
  style,
  ...rest
}: TextProps) {
  const { colors } = useTheme();
  return (
    <RNText
      style={[typography[variant], { color: colors[color] }, center && { textAlign: 'center' }, style]}
      {...rest}
    />
  );
}
