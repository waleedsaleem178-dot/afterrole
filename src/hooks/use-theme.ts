/**
 * useTheme — the single source of truth for the active color scheme.
 *
 * Every component/screen should read colors from here rather than hard-coding
 * values, so the visual redesign is a token change.
 */
import { colors, type ColorScheme, type ThemeColors } from '@/constants/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';

export interface Theme {
  colors: ThemeColors;
  scheme: ColorScheme;
  isDark: boolean;
}

export function useTheme(): Theme {
  const raw = useColorScheme();
  const scheme: ColorScheme = raw === 'dark' ? 'dark' : 'light';
  return {
    colors: colors[scheme],
    scheme,
    isDark: scheme === 'dark',
  };
}
