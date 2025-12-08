import Response from '@/api/response';
import LoadableScreenView from '@/components/loading/loadable-screen-view';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useLazyGetAuthenticatedUserQuery, useSignInWithAppleMutation } from '@/features/auth/api';
import { getSession, setSession } from '@/features/auth/session';
import { authenticate } from '@/features/auth/state';
import Tokens from '@/features/auth/Tokens/tokens';
import { showNotification } from '@/features/notifications/state';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ColorSchemeName, Image, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

const SignIn = () => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme);

  const [signInWithApple] = useSignInWithAppleMutation();
  const [getAuthenticatedUser, authenticatedUser] = useLazyGetAuthenticatedUserQuery();
  const dispatch = useDispatch();

  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    const { data: user } = authenticatedUser;

    if (user) {
      const session = getSession();

      if (session) {
        setSession({
          ...session,
          userId: user.id,
        });
      }

      dispatch(authenticate(user.id));
    }
  }, [dispatch, authenticatedUser]);

  const handleSignInWithApple = async (identityToken: string, email?: string, name?: string) => {
    const response: Response<Tokens> = await signInWithApple({
      identityToken,
      email,
      name,
    });

    if (response.data) {
      const { accessToken, refreshToken } = response.data;

      const session = getSession();

      if (session) {
        setSession({
          ...session,
          accessToken,
          refreshToken,
        });
      } else {
        setSession({ accessToken, refreshToken });
      }

      getAuthenticatedUser();
    } else {
      if (response.error.status === 401) {
        dispatch(
          showNotification({
            type: 'danger',
            message: response.error.data.detail,
          }),
        );
      }
    }
  };

  const handleAppleAuthentication = async () => {
    try {
      setIsAuthenticating(true);

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credential.identityToken) {
        await handleSignInWithApple(
          credential.identityToken,
          credential.email ?? undefined,
          credential.fullName?.givenName ?? undefined,
        );
      } else {
        dispatch(
          showNotification({
            type: 'danger',
            message: t('Something went wrong. Please try again later'),
          }),
        );
      }
    } catch (e) {
      if (e.code !== 'ERR_REQUEST_CANCELED') {
        dispatch(
          showNotification({
            type: 'danger',
            message: t('Something went wrong. Please try again later'),
          }),
        );
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <LoadableScreenView isLoading={isAuthenticating} backgroundOpacity={isAuthenticating ? 0.8 : 1}>
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
          onPress={handleAppleAuthentication}
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
    </LoadableScreenView>
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
