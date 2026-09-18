import Svg, { Path, Rect } from 'react-native-svg';

import { useTheme } from '@/hooks/use-theme';

export interface AfterRoleMarkProps {
  size?: number;
  /** Stroke/fill color of the mark. Defaults to deep forest. */
  color?: string;
  /** Optional filled rounded-square background (used for app-icon style). */
  background?: string;
}

/**
 * AfterRole mark — an open doorway framing a quotation mark.
 * Concept: someone leaves through the door, then tells the story.
 *
 * Drawn on a 44×44 canvas, scaled to `size`. Purely vector so it stays crisp
 * from 20px chips to 1024px app icons.
 */
export function AfterRoleMark({ size = 32, color, background }: AfterRoleMarkProps) {
  const { colors } = useTheme();
  const stroke = color ?? colors.forest;
  const sw = 3.4;

  return (
    <Svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      {background ? <Rect x={0} y={0} width={44} height={44} rx={12} fill={background} /> : null}
      {/* Doorway arch — open at the bottom (you walk through it). */}
      <Path
        d="M11 39 L11 20 Q11 7 22 7 Q33 7 33 20 L33 39"
        stroke={stroke}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Threshold hint. */}
      <Path d="M15.5 39 L28.5 39" stroke={stroke} strokeWidth={sw} strokeLinecap="round" opacity={0.55} />
      {/* Quotation mark inside the opening — the story being told. */}
      <Rect x={17.6} y={17} width={3.6} height={8.4} rx={1.8} fill={stroke} />
      <Rect x={23.6} y={17} width={3.6} height={8.4} rx={1.8} fill={stroke} />
    </Svg>
  );
}
