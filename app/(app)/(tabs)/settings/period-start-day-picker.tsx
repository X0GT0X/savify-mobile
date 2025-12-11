import Response from '@/api/response';
import { DetachedLoader } from '@/components/loading/loadable-screen-view';
import { ThemedView } from '@/components/themed-view';
import {
  useGetUserSettingsQuery,
  useUpdateUserSettingsMutation,
} from '@/features/finance-tracking/settings/api';
import { showNotification } from '@/features/notifications/state';
import { useLiquidGlass } from '@/hooks/use-liquid-glass';
import { Picker } from '@react-native-picker/picker';
import { useHeaderHeight } from '@react-navigation/elements';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

const PeriodStartDayPickerScreen = () => {
  const { t } = useTranslation();
  const headerHeight = useHeaderHeight();
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
        backgroundOpacity={0}
        animationStyle={{
          width: 75,
          height: 75,
          marginTop: -headerHeight,
        }}
      />

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

export default PeriodStartDayPickerScreen;
