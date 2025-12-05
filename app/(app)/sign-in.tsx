import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Link } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ColorSchemeName, Image, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SignIn = () => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme);

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <Image
        source={
          colorScheme === 'light'
            ? require('@/assets/images/logo/logo-small-dark.png')
            : require('@/assets/images/logo/logo-small-light.png')
        }
        style={styles.logo}
      />
      <ThemedText type="title" style={styles.slogan}>
        {t('Empower Your Finances with Savify: Track, Achieve, and Thrive!')}
      </ThemedText>

      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
        buttonStyle={
          colorScheme === 'light'
            ? AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
            : AppleAuthentication.AppleAuthenticationButtonStyle.WHITE
        }
        cornerRadius={16}
        style={styles.button}
        onPress={() => {}}
      />

      <ThemedText style={styles.terms}>
        {t('By continuing you confirm that you agree to ours')}{' '}
        <Link href="/terms" style={{ textDecorationLine: 'underline' }}>
          {t('with_Terms of Service')}
        </Link>{' '}
        {t('and')}{' '}
        <Link href="/privacy-policy" style={{ textDecorationLine: 'underline' }}>
          {t('with_Privacy Policy')}
        </Link>
        .
      </ThemedText>
    </SafeAreaView>
  );
};

const createStyles = (colorScheme: ColorSchemeName) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 24,
      flex: 1,
      backgroundColor: Colors[colorScheme ?? 'light'].background,
    },
    logo: {
      width: 24,
      height: 33,
      marginTop: 24,
    },
    slogan: {
      fontSize: 48,
      fontWeight: 'bold',
      lineHeight: 60,
      marginTop: 'auto',
    },
    button: {
      width: '100%',
      height: 54,
      marginTop: 40,
      marginBottom: 36,
      backgroundColor: Colors[colorScheme ?? 'light'].primary,
      borderRadius: 16,
    },
    terms: {
      textAlign: 'center',
      fontSize: 13,
      lineHeight: 20,
      color: Colors[colorScheme ?? 'light'].neutral,
      marginHorizontal: 48,
    },
  });

export default SignIn;
