import { useRouter } from 'expo-router';
import {
  BadgeCheck,
  Bell,
  Bookmark,
  Briefcase,
  FileText,
  Info,
  LogOut,
  Moon,
  ScrollText,
  Shield,
  ShieldBan,
  UserRound,
} from 'lucide-react-native';
import { useState } from 'react';
import { Alert, StyleSheet, Switch, View } from 'react-native';

import { AppHeader } from '@/components/ui/AppHeader';
import { Card } from '@/components/ui/Card';
import { ListRow } from '@/components/ui/ListRow';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { spacing } from '@/constants/spacing';
import { useTheme } from '@/hooks/use-theme';
import { haptics } from '@/lib/haptics';
import { useStore } from '@/store';

function info(title: string, message: string) {
  Alert.alert(title, message);
}

export default function SettingsScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const signOut = useStore((s) => s.signOut);

  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);

  const confirmSignOut = () => {
    Alert.alert('Sign out', 'You can sign back in anytime. Your local data stays on this device.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: () => {
          haptics.medium();
          signOut();
          router.replace('/');
        },
      },
    ]);
  };

  return (
    <Screen scroll edges={['top', 'bottom']} contentStyle={styles.content}>
      <AppHeader showBack title="Settings" />

      <View style={styles.group}>
        <SectionHeader title="Account" />
        <Card padded={false} style={styles.card}>
          <ListRow icon={UserRound} label="Edit profile" onPress={() => router.push('/edit-profile')} />
          <Divider />
          <ListRow icon={Briefcase} label="Work history" onPress={() => router.push('/work-history')} />
          <Divider />
          <ListRow icon={BadgeCheck} label="Verify employment" onPress={() => router.push('/verify-employment')} />
        </Card>
      </View>

      <View style={styles.group}>
        <SectionHeader title="Appearance" />
        <Card padded={false} style={styles.card}>
          <ListRow
            icon={Moon}
            label="Theme"
            value={isDark ? 'Dark (system)' : 'Light (system)'}
            showChevron={false}
            onPress={() => info('Appearance', 'AfterRole follows your system light/dark setting in this prototype.')}
          />
        </Card>
      </View>

      <View style={styles.group}>
        <SectionHeader title="Notifications" />
        <Card padded={false} style={styles.card}>
          <ListRow
            icon={Bell}
            label="Push notifications"
            showChevron={false}
            rightSlot={
              <Switch
                value={pushEnabled}
                onValueChange={setPushEnabled}
                trackColor={{ true: colors.accent, false: colors.borderStrong }}
                thumbColor="#FFFFFF"
              />
            }
          />
          <Divider />
          <ListRow
            icon={Bell}
            label="Email updates"
            showChevron={false}
            rightSlot={
              <Switch
                value={emailEnabled}
                onValueChange={setEmailEnabled}
                trackColor={{ true: colors.accent, false: colors.borderStrong }}
                thumbColor="#FFFFFF"
              />
            }
          />
        </Card>
      </View>

      <View style={styles.group}>
        <SectionHeader title="Privacy" />
        <Card padded={false} style={styles.card}>
          <ListRow icon={Bookmark} label="Saved stories" onPress={() => router.push('/saved')} />
          <Divider />
          <ListRow
            icon={ShieldBan}
            label="Blocked accounts"
            onPress={() => info('Blocked accounts', 'You haven’t blocked anyone yet.')}
          />
          <Divider />
          <ListRow
            icon={Shield}
            label="Privacy controls"
            onPress={() => info('Privacy', 'Verification evidence is never shown publicly. Full controls arrive later.')}
          />
        </Card>
      </View>

      <View style={styles.group}>
        <SectionHeader title="Help & legal" />
        <Card padded={false} style={styles.card}>
          <ListRow icon={Info} label="Help" onPress={() => info('Help', 'Help center is coming soon. Reach us at help@afterrole.app.')} />
          <Divider />
          <ListRow
            icon={ScrollText}
            label="Community Guidelines"
            onPress={() => info('Community Guidelines', 'Post under your real identity. Share first-hand experiences. Be honest and respectful.')}
          />
          <Divider />
          <ListRow icon={FileText} label="Terms" onPress={() => info('Terms', 'Terms of Service placeholder for this prototype.')} />
          <Divider />
          <ListRow icon={FileText} label="Privacy Policy" onPress={() => info('Privacy Policy', 'Privacy Policy placeholder for this prototype.')} />
        </Card>
      </View>

      <Card padded={false} style={styles.card}>
        <ListRow icon={LogOut} label="Sign out" danger showChevron={false} onPress={confirmSignOut} />
      </Card>
    </Screen>
  );
}

function Divider() {
  const { colors } = useTheme();
  return <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: colors.border, marginLeft: spacing.huge }} />;
}

const styles = StyleSheet.create({
  content: { gap: spacing.xl },
  group: { gap: spacing.sm },
  card: { paddingHorizontal: spacing.lg },
});
