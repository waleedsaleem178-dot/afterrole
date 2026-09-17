# AfterRole

**Know before you join.**

AfterRole is a real-name professional workplace-story app — **not** an anonymous
review site. People share first-hand, attributed accounts of what it was
actually like to do a job, so others can make informed decisions before they
join.

Built with **Expo**, **React Native**, **TypeScript** and **Expo Router**
(file-based routing). iOS-first, Android-compatible.

## Requirements

- Node.js 20+
- iOS: Xcode + iOS Simulator (macOS), or Expo Go / a development build on a device
- Android: Android Studio emulator or a device (added later)

## Get started

```bash
npm install
npx expo start
```

Then press `i` for the iOS Simulator, `a` for Android, or `w` for web.

## Project structure

```
src/
  app/            # Expo Router routes (file-based)
    _layout.tsx   # Root Stack + theme provider + font loading
    index.tsx     # Welcome screen
  components/      # Shared UI (themed-text, themed-view, …)
  constants/       # Design tokens (theme.ts: colors, fonts, spacing, brand)
  hooks/           # useColorScheme, useTheme
  global.css       # Web font variables
```

## Design system

Design tokens live in `src/constants/theme.ts`:

- **Colors** — light/dark palettes, referenced via `useTheme()`
- **Fonts** — Inter (loaded in `_layout.tsx` via `@expo-google-fonts/inter`)
- **Spacing / Radius** — layout scales
- **Brand** — name, wordmark, tagline, positioning

## Key dependencies

Navigation & UI: `expo-router`, `react-native-safe-area-context`,
`react-native-screens`, `react-native-svg`, `react-native-reanimated`,
`lucide-react-native`, `expo-image`, `expo-haptics`, `expo-font`.
State: `zustand`. Storage: `@react-native-async-storage/async-storage`.
