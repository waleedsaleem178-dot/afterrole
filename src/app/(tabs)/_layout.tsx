import { Tabs, useRouter } from 'expo-router';
import { Bell, Compass, House, Plus, User } from 'lucide-react-native';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { radius } from '@/constants/radius';
import { shadows } from '@/constants/shadows';
import { fontFamily } from '@/constants/typography';
import { useTheme } from '@/hooks/use-theme';
import { haptics } from '@/lib/haptics';

function ShareTabButton() {
  const { colors } = useTheme();
  const router = useRouter();
  return (
    <View style={styles.shareWrap} pointerEvents="box-none">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Share a story"
        onPress={() => {
          haptics.medium();
          router.push('/create/step-1');
        }}
        style={({ pressed }) => [
          styles.shareButton,
          { backgroundColor: colors.forest, borderColor: colors.tabBar },
          shadows.sm,
          pressed && styles.pressed,
        ]}>
        <Plus size={25} color={colors.accentForeground} strokeWidth={2.6} />
      </Pressable>
    </View>
  );
}

export default function TabsLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.forest,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
          height: Platform.OS === 'ios' ? 88 : 66,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontWeight: fontFamily.medium, fontSize: 11, letterSpacing: 0 },
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <House size={22} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color }) => <Compass size={22} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="share"
        options={{
          title: '',
          tabBarButton: () => <ShareTabButton />,
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: 'Activity',
          tabBarIcon: ({ color }) => <Bell size={22} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'You',
          tabBarIcon: ({ color }) => <User size={22} color={color} strokeWidth={2} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  shareWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButton: {
    width: 54,
    height: 54,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    marginTop: -12,
  },
  pressed: { transform: [{ scale: 0.94 }], opacity: 0.9 },
});
