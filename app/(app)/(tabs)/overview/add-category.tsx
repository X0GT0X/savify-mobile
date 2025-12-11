import Response from '@/api/response';
import { HapticTab } from '@/components/haptic-tab';
import { DetachedLoader } from '@/components/loading/loadable-screen-view';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { FormTextInput } from '@/components/ui/form/form-text-input';
import { AVAILABLE_ICONS, buildIconName } from '@/constants/icons';
import { Colors } from '@/constants/theme';
import { useAddCategoryMutation } from '@/features/finance-tracking/categories/api';
import { CategoryType } from '@/features/finance-tracking/categories/category';
import { showNotification } from '@/features/notifications/state';
import IonIcons from '@expo/vector-icons/Ionicons';
import { useHeaderHeight } from '@react-navigation/elements';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { Formik, FormikProps } from 'formik';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ColorSchemeName, StyleSheet, useColorScheme, View } from 'react-native';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';

type AddCategoryForm = {
  name: string;
  icon: string;
  type: CategoryType;
};

const AddCategoryScreen = () => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const styles = createStyles(colorScheme);
  const headerHeight = useHeaderHeight();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [addCategory, { isLoading: isAddingCategory }] = useAddCategoryMutation();

  const { categoryType } = useLocalSearchParams<{ categoryType: CategoryType }>();

  const formikRef = useRef<FormikProps<AddCategoryForm>>(null);

  useEffect(() => {
    navigation.setOptions({
      title: t(`Add ${categoryType.toLowerCase()} category`),
    });
  }, [navigation, t, categoryType]);

  const handleSubmit = async (values: AddCategoryForm) => {
    const { name, icon, type } = values;

    const response: Response<string> = await addCategory({
      name,
      icon: buildIconName(icon, 'ion'),
      type,
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

  const { selectedIcon } = useLocalSearchParams<{
    selectedIcon: string;
  }>();

  useEffect(() => {
    if (selectedIcon && formikRef.current) {
      formikRef.current.setFieldValue('icon', selectedIcon);
    }
  }, [selectedIcon]);

  const validationSchema = useMemo(() => {
    return Yup.object().shape({
      name: Yup.string().required(t('This field is required')),
    });
  }, [t]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <DetachedLoader
        isLoading={isAddingCategory}
        backgroundOpacity={0.5}
        style={{ top: -headerHeight, bottom: 0, height: 'auto' }}
      />
      <Formik
        innerRef={formikRef}
        initialValues={{
          name: '',
          icon: AVAILABLE_ICONS[0],
          type: categoryType,
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        validateOnChange
        validateOnBlur>
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <ThemedView style={styles.form}>
            <HapticTab onPress={() => handleOpenIconPicker(values.icon)} style={styles.iconPicker}>
              <ThemedView
                style={[styles.iconContainer, { backgroundColor: colors.containerBackground }]}>
                <IonIcons name={values.icon as any} size={36} color={colors.neutral} />
              </ThemedView>
              <ThemedView style={[styles.editBadge]}>
                <IonIcons name="pencil" size={12} color={colors.textOnDarkBackground} />
              </ThemedView>
            </HapticTab>

            <FormTextInput
              label={t('category.name')}
              name="name"
              hasError={!!(errors.name && touched.name)}
              placeholder={t('Enter category name')}
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
              containerStyle={{ marginBottom: 24 }}
            />

            <Button label={t('Add')} onPress={() => handleSubmit()} />
          </ThemedView>
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
    form: {
      paddingHorizontal: 24,
      paddingTop: 16,
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
      backgroundColor: Colors[colorScheme ?? 'light'].neutral,
    },
  });

export default AddCategoryScreen;
