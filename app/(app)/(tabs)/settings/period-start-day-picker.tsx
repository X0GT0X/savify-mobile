import Response from '@/api/response';
import { DetachedLoader } from '@/components/loading/loadable-screen-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  useGetUserSettingsQuery,
  useUpdateUserSettingsMutation,
} from '@/features/finance-tracking/settings/api';
import { showNotification } from '@/features/notifications/state';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLiquidGlass } from '@/hooks/use-liquid-glass';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ColorSchemeName, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';

const PeriodStartDayPickerScreen = () => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme);
  const { isLiquidGlassAvailable } = useLiquidGlass();

  const dispatch = useDispatch();
  const { data: userSettings } = useGetUserSettingsQuery();
  const [updateUserSettings, { isLoading: isUpdatingUserSettings }] =
    useUpdateUserSettingsMutation();

  const handlChoosePeriodStartDay = async (periodStartsOnDay: number) => {
    if (userSettings?.periodStartsOnDay === periodStartsOnDay) {
      return;
    }

    const response: Response<void> = await updateUserSettings({
      periodStartsOnDay,
    });

    if (response.error) {
      dispatch(
        showNotification({
          type: 'danger',
          message: t('Something went wrong. Please try again later'),
        }),
      );
    } else {
      router.back();
    }
  };

  return (
    <ThemedView style={[{ flex: 1 }, isLiquidGlassAvailable && { backgroundColor: 'transparent' }]}>
      <DetachedLoader
        isLoading={isUpdatingUserSettings}
        backgroundOpacity={0.5}
        animationStyle={{
          width: 75,
          height: 75,
        }}
      />

      <ThemedText
        type="defaultSemiBold"
        style={[styles.header, isLiquidGlassAvailable && { backgroundColor: 'transparent' }]}>
        {t('Period starts')}
      </ThemedText>

      <Picker
        selectedValue={userSettings?.periodStartsOnDay}
        onValueChange={handlChoosePeriodStartDay}>
        {Array.from({ length: 28 }, (_, i) => i + 1).map((periodStartDay) => (
          <Picker.Item
            key={periodStartDay}
            label={`${periodStartDay}`}
            value={periodStartDay}></Picker.Item>
        ))}
      </Picker>
    </ThemedView>
  );
};

const createStyles = (colorScheme: ColorSchemeName) =>
  StyleSheet.create({
    header: {
      paddingTop: 24,
      paddingHorizontal: 24,
      paddingBottom: 16,
      textAlign: 'center',
    },
  });

export default PeriodStartDayPickerScreen;
