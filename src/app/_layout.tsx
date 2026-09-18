import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import '@/global.css';
import { darkColors, lightColors } from '@/constants/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';

SplashScreen.preventAutoHideAsync();

const LightNavTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: lightColors.accent,
    background: lightColors.background,
    card: lightColors.background,
    text: lightColors.textPrimary,
    border: lightColors.border,
    notification: lightColors.accent,
  },
};

const DarkNavTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: darkColors.accent,
    background: darkColors.background,
    card: darkColors.background,
    text: darkColors.textPrimary,
    border: darkColors.border,
    notification: darkColors.accent,
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  const isDark = colorScheme === 'dark';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider value={isDark ? DarkNavTheme : LightNavTheme}>
          <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="create" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
            <Stack.Screen
              name="report/[storyId]"
              options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
            />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
