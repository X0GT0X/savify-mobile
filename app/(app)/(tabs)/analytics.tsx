import LoadableScreenView from '@/components/loading/loadable-screen-view';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTranslation } from 'react-i18next';
import { ColorSchemeName, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AnalyticsScreen = () => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme);

  return (
    <LoadableScreenView isLoading={false}>
      <SafeAreaView edges={['top']} style={styles.container}>
        <ThemedText type="title">{t('Analytics')}</ThemedText>
      </SafeAreaView>
    </LoadableScreenView>
  );
};

const createStyles = (colorScheme: ColorSchemeName) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[colorScheme ?? 'light'].background,
      paddingHorizontal: 24,
    },
  });
export default AnalyticsScreen;
