import Response from '@/api/response';
import { HapticTab } from '@/components/haptic-tab';
import { DetachedLoader } from '@/components/loading/loadable-screen-view';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import ColorPicker from '@/components/ui/color-picker';
import { FormCurrencyInput } from '@/components/ui/form/form-currency-input';
import { FormSwitchInput } from '@/components/ui/form/form-switch-input';
import { FormTextInput } from '@/components/ui/form/form-text-input';
import { AVAILABLE_ICONS, buildIconName } from '@/constants/icons';
import { Colors } from '@/constants/theme';
import { useGetUserSettingsQuery } from '@/features/finance-tracking/settings/api';
import { useAddWalletMutation } from '@/features/finance-tracking/wallets/api';
import { showNotification } from '@/features/notifications/state';
import { convertToMinorUnits } from '@/tools/currency';
import { parseCurrencyInput } from '@/tools/input-formatters';
import { validateCurrencyAmount } from '@/tools/validation';
import IonIcons from '@expo/vector-icons/Ionicons';
import { useHeaderHeight } from '@react-navigation/elements';
import { router, useLocalSearchParams } from 'expo-router';
import { Formik, FormikProps } from 'formik';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ColorSchemeName, ScrollView, StyleSheet, useColorScheme, View } from 'react-native';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';

const PREDEFINED_COLORS = [
  '#F76E6E',
  '#FF8A3D',
  '#FFC84A',
  '#33C87A',
  '#51AEFF',
  '#A384FF',
  '#2ED4C2',
  '#445A78',
  '#AEB8C4',
  '#FF5FA5',
  '#FF744A',
  '#B4D937',
  '#49d7f1',
  '#7674FF',
  '#8B6C55',
  '#6E859E',
];

type AddWalletForm = {
  name: string;
  icon: string;
  amount: string;
  currency: string;
  color: string;
  includeInTotalBalance: boolean;
};

const AddWalletScreen = () => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const styles = createStyles(colorScheme);
  const headerHeight = useHeaderHeight();
  const dispatch = useDispatch();

  const [addWallet, { isLoading: isAddingWallet }] = useAddWalletMutation();
  const { data: userSettings } = useGetUserSettingsQuery();

  const formikRef = useRef<FormikProps<AddWalletForm>>(null);

  const { selectedIcon, selectedCurrency } = useLocalSearchParams<{
    selectedIcon: string;
    selectedCurrency: string;
  }>();

  useEffect(() => {
    if (selectedIcon && formikRef.current) {
      formikRef.current.setFieldValue('icon', selectedIcon);
    }
  }, [selectedIcon]);

  useEffect(() => {
    if (selectedCurrency && formikRef.current) {
      formikRef.current.setFieldValue('currency', selectedCurrency);
    }
  }, [selectedCurrency]);

  const handleSubmit = async (values: AddWalletForm) => {
    const { name, icon, amount, currency, color, includeInTotalBalance } = values;

    const numericAmount = parseCurrencyInput(amount);
    const amountInMinorUnits = convertToMinorUnits(numericAmount, currency);

    const response: Response<string> = await addWallet({
      name,
      icon: buildIconName(icon, 'ion'),
      initialBalanceAmount: amountInMinorUnits,
      currency,
      color,
      includeInTotalBalance,
    });

    if (response.error) {
      dispatch(
        showNotification({
          type: 'danger',
          message: t('Something went wrong. Please try again later'),
        }),
      );
    } else {
      router.dismissAll();
    }
  };

  const handleOpenIconPicker = useCallback((currentIcon: string) => {
    router.push({
      pathname: '/(app)/(tabs)/overview/icon-picker',
      params: { selectedIcon: currentIcon },
    });
  }, []);

  const handleOpenCurrencyPicker = useCallback((currentCurrency: string) => {
    router.push({
      pathname: '/(app)/(tabs)/overview/currency-picker',
      params: { selectedCurrency: currentCurrency },
    });
  }, []);

  const validationSchema = useMemo(() => {
    return Yup.object().shape({
      name: Yup.string().required(t('This field is required')),
      amount: Yup.string()
        .required(t('This field is required'))
        .test('is-valid-amount', t('Amount must be a valid number'), function (value) {
          if (!value) return false;

          // Get the currency from the form context
          const currency = this.parent.currency as string;

          // Use validation helper - negative values not allowed for initial wallet balance
          return validateCurrencyAmount(value, currency, true);
        }),
    });
  }, [t]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <DetachedLoader
        isLoading={isAddingWallet}
        backgroundOpacity={0.5}
        style={{ top: -headerHeight, bottom: 0, height: 'auto' }}
      />
      <Formik
        innerRef={formikRef}
        initialValues={{
          name: '',
          icon: AVAILABLE_ICONS[0],
          amount: '',
          currency: userSettings?.defaultCurrency ?? 'USD',
          color: PREDEFINED_COLORS[0],
          includeInTotalBalance: true,
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        validateOnChange
        validateOnBlur>
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentInsetAdjustmentBehavior="automatic"
            automaticallyAdjustContentInsets={true}
            bounces={false}>
            <ThemedView style={styles.form}>
              <HapticTab
                onPress={() => handleOpenIconPicker(values.icon)}
                style={styles.iconPicker}>
                <ThemedView style={[styles.iconContainer, { backgroundColor: values.color }]}>
                  <IonIcons
                    name={values.icon as keyof typeof IonIcons.glyphMap}
                    size={36}
                    color={colors.white}
                  />
                </ThemedView>
                <ThemedView style={[styles.editBadge]}>
                  <IonIcons name="pencil" size={12} color={colors.text} />
                </ThemedView>
              </HapticTab>

              <FormTextInput
                label={t('wallet.name')}
                name="name"
                hasError={!!(errors.name && touched.name)}
                placeholder={t('Enter wallet name')}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.name}
                containerStyle={{ marginBottom: 24 }}
              />

              <FormCurrencyInput
                label={t('Initial balance')}
                amountValue={values.amount}
                currencyValue={values.currency}
                onAmountChange={handleChange('amount')}
                onAmountBlur={() => handleBlur('amount')}
                onCurrencyPress={() => handleOpenCurrencyPicker(values.currency)}
                allowNegative
                hasError={!!(errors.amount && touched.amount)}
                name="amount"
                containerStyle={{ marginBottom: 24 }}
              />

              <ColorPicker
                selectedColor={values.color}
                onSelectColor={(color) => setFieldValue('color', color)}
                colors={PREDEFINED_COLORS}
              />

              <FormSwitchInput
                label={t('Include in total balance')}
                description={t(
                  'If you turn off the option, the account balance will be included only in analytics and will not be added to the overall balance',
                )}
                value={values.includeInTotalBalance}
                onValueChange={(value) => setFieldValue('includeInTotalBalance', value)}
                name="includeInTotalBalance"
                containerStyle={{ marginTop: 24, marginBottom: 24 }}
              />

              <Button label={t('Add')} onPress={() => handleSubmit()} />
            </ThemedView>
          </ScrollView>
        )}
      </Formik>
    </View>
  );
};

const createStyles = (colorScheme: ColorSchemeName) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
    },
    form: {
      paddingHorizontal: 24,
      paddingTop: 24,
      paddingBottom: 32,
      backgroundColor: 'transparent',
    },
    iconPicker: {
      alignItems: 'center',
      alignSelf: 'center',
      marginBottom: 8,
    },
    iconContainer: {
      width: 88,
      height: 88,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 24,
    },
    editBadge: {
      position: 'absolute',
      top: -2,
      right: -2,
      width: 28,
      height: 28,
      borderRadius: 14,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors[colorScheme ?? 'light'].containerBackground,
    },
  });

export default AddWalletScreen;
