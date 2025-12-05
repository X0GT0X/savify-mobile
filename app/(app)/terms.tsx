import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTranslation } from 'react-i18next';
import { Dimensions, Image } from 'react-native';

const TermsScreen = () => {
  const { t } = useTranslation();
  const calculatedWidth = Dimensions.get('window').width - 24 * 2;

  return (
    <ThemedView>
      <ThemedText type="title">{t('Terms of Service')}</ThemedText>

      <Image
        source={require('@/assets/images/privacy-policy.jpg')}
        style={{
          width: calculatedWidth,
          height: calculatedWidth,
          alignSelf: 'center',
          marginTop: 40,
        }}
      />
    </ThemedView>
  );
};

export default TermsScreen;
