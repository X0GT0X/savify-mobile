import Response from '@/api/response';
import { DetachedLoader } from '@/components/loading/loadable-screen-view';
import { ThemedView } from '@/components/themed-view';
import {
  useGetUserSettingsQuery,
  useUpdateUserSettingsMutation,
} from '@/features/finance-tracking/settings/api';
import { BUDGETING_PERIODS, BudgetingPeriod } from '@/features/finance-tracking/settings/settings';
import { showNotification } from '@/features/notifications/state';
import { useLiquidGlass } from '@/hooks/use-liquid-glass';
import { Picker } from '@react-native-picker/picker';
import { useHeaderHeight } from '@react-navigation/elements';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

const BudgetingPeriodPickerScreen = () => {
  const { t } = useTranslation();
  const headerHeight = useHeaderHeight();
  const { isLiquidGlassAvailable } = useLiquidGlass();

  const dispatch = useDispatch();
  const { data: userSettings } = useGetUserSettingsQuery();
  const [updateUserSettings, { isLoading: isUpdatingUserSettings }] =
    useUpdateUserSettingsMutation();

  const handleChooseBudgetingPeriod = async (budgetingPeriod: BudgetingPeriod) => {
    if (userSettings?.budgetingPeriod === budgetingPeriod) {
      return;
    }

    const response: Response<void> = await updateUserSettings({
      budgetingPeriod,
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
        selectedValue={userSettings?.budgetingPeriod}
        onValueChange={handleChooseBudgetingPeriod}>
        {BUDGETING_PERIODS.map((budgetingPeriod) => (
          <Picker.Item
            key={budgetingPeriod}
            label={t(budgetingPeriod)}
            value={budgetingPeriod}></Picker.Item>
        ))}
      </Picker>
    </ThemedView>
  );
};

export default BudgetingPeriodPickerScreen;
