/**
 * Spacing scale (in px). Use these instead of magic numbers so layout rhythm
 * stays consistent and tunable in one place.
 */
export const spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  x28: 28,
  xxxl: 32,
  x40: 40,
  huge: 48,
  giant: 64,
} as const;

export type SpacingKey = keyof typeof spacing;

/** Max content width for tablet / large screens. iPhone-first, but capped. */
export const layout = {
  maxContentWidth: 640,
  /** Primary horizontal phone padding (reference uses 20). */
  screenPaddingX: spacing.xl,
  tabBarHeight: 64,
} as const;
