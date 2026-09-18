import type { ComponentType } from 'react';

/** Structural type compatible with lucide-react-native icon components. */
export type IconType = ComponentType<{
  size?: number;
  color?: string;
  strokeWidth?: number;
  fill?: string;
}>;
