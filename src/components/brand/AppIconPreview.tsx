import { Image } from 'expo-image';

const ICON = require('@/assets/brand/afterrole-icon.png');

export interface AppIconPreviewProps {
  size?: number;
}

/** Preview of the real AfterRole app icon (forest field + ivory door mark). */
export function AppIconPreview({ size = 96 }: AppIconPreviewProps) {
  return (
    <Image
      source={ICON}
      style={{ width: size, height: size, borderRadius: size * 0.225 }}
      contentFit="cover"
      accessibilityLabel="AfterRole app icon"
    />
  );
}
