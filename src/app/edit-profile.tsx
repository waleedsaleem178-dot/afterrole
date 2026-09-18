import { useRouter } from 'expo-router';
import { Camera } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { AppHeader } from '@/components/ui/AppHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { TextArea } from '@/components/ui/TextArea';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { useTheme } from '@/hooks/use-theme';
import { haptics } from '@/lib/haptics';
import { useStore } from '@/store';

export default function EditProfileScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const profile = useStore((s) => s.profile);
  const updateProfile = useStore((s) => s.updateProfile);

  const [name, setName] = useState(profile.name);
  const [username, setUsername] = useState(profile.username);
  const [headline, setHeadline] = useState(profile.headline);
  const [location, setLocation] = useState(profile.location);
  const [bio, setBio] = useState(profile.bio);

  const save = () => {
    haptics.success();
    updateProfile({ name, username, headline, location, bio });
    router.back();
  };

  return (
    <Screen
      scroll
      keyboardAware
      edges={['top', 'bottom']}
      footer={<Button label="Save changes" size="lg" onPress={save} />}>
      <AppHeader showBack title="Edit profile" />

      <Pressable style={styles.photo} onPress={() => haptics.selection()}>
        <Avatar name={name || 'You'} color={profile.avatarColor} size={92} />
        <View style={[styles.camera, { backgroundColor: colors.accent, borderColor: colors.background }]}>
          <Camera size={16} color={colors.accentForeground} strokeWidth={2} />
        </View>
      </Pressable>
      <Text variant="small" color="textMuted" center style={styles.photoHint}>
        Photo upload comes later
      </Text>

      <View style={styles.form}>
        <Input label="Full name" value={name} onChangeText={setName} />
        <Input label="Username" value={username} onChangeText={setUsername} autoCapitalize="none" />
        <Input label="Professional headline" value={headline} onChangeText={setHeadline} />
        <Input label="Location" value={location} onChangeText={setLocation} />
        <TextArea label="Short bio" value={bio} onChangeText={setBio} minHeight={90} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  photo: { alignSelf: 'center', marginTop: spacing.lg },
  camera: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 30,
    height: 30,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  photoHint: { marginTop: spacing.sm },
  form: { marginTop: spacing.xl, gap: spacing.lg },
});
