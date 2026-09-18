import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Switch, View } from 'react-native';

import { AppHeader } from '@/components/ui/AppHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { spacing } from '@/constants/spacing';
import { useTheme } from '@/hooks/use-theme';
import { haptics } from '@/lib/haptics';
import { useStore } from '@/store';

export default function AddEmploymentScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const addEmployment = useStore((s) => s.addEmployment);

  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [startLabel, setStartLabel] = useState('');
  const [endLabel, setEndLabel] = useState('');
  const [current, setCurrent] = useState(false);

  const canSave = companyName.trim().length > 0 && role.trim().length > 0;

  const save = () => {
    haptics.success();
    addEmployment({
      companyName: companyName.trim(),
      role: role.trim(),
      location: location.trim() || undefined,
      startLabel: startLabel.trim() || '—',
      endLabel: current ? 'Present' : endLabel.trim() || '—',
      current,
      verified: false,
    });
    router.back();
  };

  return (
    <Screen
      scroll
      keyboardAware
      edges={['top', 'bottom']}
      contentStyle={styles.content}
      footer={<Button label="Save role" size="lg" disabled={!canSave} onPress={save} />}>
      <AppHeader showBack title="Add role" />

      <Input label="Company" value={companyName} onChangeText={setCompanyName} placeholder="e.g. AdVital" />
      <Input label="Role" value={role} onChangeText={setRole} placeholder="e.g. Technical Specialist" />
      <Input label="Location" value={location} onChangeText={setLocation} placeholder="e.g. Remote" />

      <View style={styles.dates}>
        <Input
          label="Start month/year"
          value={startLabel}
          onChangeText={setStartLabel}
          placeholder="e.g. Aug 2026"
          containerStyle={styles.flex}
        />
        <Input
          label="End month/year"
          value={current ? 'Present' : endLabel}
          onChangeText={setEndLabel}
          editable={!current}
          placeholder="e.g. Present"
          containerStyle={styles.flex}
        />
      </View>

      <View style={[styles.toggleRow, { borderColor: colors.border }]}>
        <Text variant="bodyMedium">I currently work here</Text>
        <Switch
          value={current}
          onValueChange={setCurrent}
          trackColor={{ true: colors.accent, false: colors.borderStrong }}
          thumbColor="#FFFFFF"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.lg },
  dates: { flexDirection: 'row', gap: spacing.md },
  flex: { flex: 1 },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
  },
});
