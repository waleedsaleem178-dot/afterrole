import { Image } from 'expo-image';
import { Check } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { fontFamily } from '@/constants/typography';
import { useTheme } from '@/hooks/use-theme';
import { initials } from '@/lib/format';

import { Text } from './Text';

export interface AvatarProps {
  name: string;
  color?: string;
  size?: number;
  imageUri?: string;
  verified?: boolean;
  showVerified?: boolean;
}

export function Avatar({
  name,
  color = '#2B50E2',
  size = 44,
  imageUri,
  verified,
  showVerified,
}: AvatarProps) {
  const { colors } = useTheme();
  const badgeSize = Math.max(14, Math.round(size * 0.32));

  return (
    <View style={{ width: size, height: size }}>
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }]}
          contentFit="cover"
        />
      ) : (
        <View
          style={[
            styles.circle,
            { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
          ]}>
          <Text style={{ color: '#FFFFFF', fontFamily: fontFamily.semibold, fontSize: size * 0.38 }}>
            {initials(name)}
          </Text>
        </View>
      )}
      {showVerified && verified ? (
        <View
          style={[
            styles.badge,
            {
              width: badgeSize,
              height: badgeSize,
              borderRadius: badgeSize / 2,
              backgroundColor: colors.verified,
              borderColor: colors.background,
            },
          ]}>
          <Check size={badgeSize * 0.62} color="#FFFFFF" strokeWidth={3} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  circle: { alignItems: 'center', justifyContent: 'center' },
  badge: {
    position: 'absolute',
    right: -1,
    bottom: -1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
});
