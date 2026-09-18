import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/** Subtle haptics that safely no-op on web. */
export const haptics = {
  light() {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  },
  medium() {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  },
  selection() {
    if (Platform.OS !== 'web') Haptics.selectionAsync();
  },
  success() {
    if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  },
};
