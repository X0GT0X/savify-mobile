import { IconPicker } from '@/components/ui/icon-picker';
import { Colors } from '@/constants/theme';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';

const IconPickerScreen = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const { selectedIcon } = useLocalSearchParams<{
    selectedIcon: string;
  }>();

  const handleSelectIcon = useCallback((icon: string) => {
    router.dismiss();
    requestAnimationFrame(() => {
      router.setParams({ selectedIcon: icon });
    });
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <IconPicker selectedIcon={selectedIcon ?? 'cash'} onSelectIcon={handleSelectIcon} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default IconPickerScreen;
