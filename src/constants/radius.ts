/**
 * Corner radius scale (px). Soft, rounded geometry — never extreme bubble UI.
 * Semantic keys keep component radii aligned with the reference:
 *   inputs 16 · buttons 18 · cards 20 · large feature 24.
 */
export const radius = {
  none: 0,
  sm: 10,
  md: 14,
  input: 16,
  lg: 18,
  card: 20,
  xl: 22,
  xxl: 24,
  pill: 999,
} as const;

export type RadiusKey = keyof typeof radius;
