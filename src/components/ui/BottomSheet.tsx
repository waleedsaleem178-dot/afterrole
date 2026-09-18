import { X } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { useTheme } from '@/hooks/use-theme';

import { Text } from './Text';

export interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
}

/** A clean slide-up sheet with a backdrop, drag handle and optional footer. */
export function BottomSheet({ visible, onClose, title, children, footer }: BottomSheetProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.root}>
        <Pressable style={[styles.backdrop, { backgroundColor: colors.overlay }]} onPress={onClose} />
        <View style={[styles.panel, { backgroundColor: colors.background, paddingBottom: insets.bottom + spacing.lg }]}>
          <View style={[styles.handle, { backgroundColor: colors.borderStrong }]} />
          {title ? (
            <View style={styles.header}>
              <Text variant="subtitle">{title}</Text>
              <Pressable onPress={onClose} hitSlop={8} accessibilityLabel="Close">
                <X size={22} color={colors.textSecondary} strokeWidth={2} />
              </Pressable>
            </View>
          ) : null}
          <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  panel: {
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    maxHeight: '82%',
  },
  handle: { width: 40, height: 4, borderRadius: radius.pill, alignSelf: 'center', marginBottom: spacing.md },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  scroll: { flexGrow: 0 },
  scrollContent: { gap: spacing.xl, paddingBottom: spacing.sm },
  footer: { paddingTop: spacing.md },
});
