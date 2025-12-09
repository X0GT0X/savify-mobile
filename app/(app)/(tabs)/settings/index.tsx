import { HapticTab } from '@/components/haptic-tab';
import LoadableScreenView from '@/components/loading/loadable-screen-view';
import SignOutDialog from '@/components/settings/sign-out-dialog';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import FocusedRefreshControl from '@/components/ui/focused-refresh-control';
import { Colors, Fonts } from '@/constants/theme';
import { useGetAuthenticatedUserQuery, useSignOutMutation } from '@/features/auth/api';
import { setSession } from '@/features/auth/session';
import { signOut } from '@/features/auth/state';
import { useGetUserSettingsQuery } from '@/features/finance-tracking/settings/api';
import { useColorScheme } from '@/hooks/use-color-scheme';
import IonIcons from '@expo/vector-icons/Ionicons';
import getSymbolFromCurrency from 'currency-symbol-map';
import * as Application from 'expo-application';
import * as Clipboard from 'expo-clipboard';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ColorSchemeName, ScrollView, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

const SettingsScreen = () => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme);
  const dispatch = useDispatch();

  const {
    data: authenticatedUser,
    isLoading: isLoadingAuthenticatedUser,
    isFetching: isFetchingAuthenticatedUser,
    refetch: refetchAuthenticatedUser,
  } = useGetAuthenticatedUserQuery();
  const {
    data: userSettings,
    isLoading: isLoadingUserSettings,
    isFetching: isFetchingUserSettings,
    refetch: refetchUserSettings,
  } = useGetUserSettingsQuery();

  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const [signOutAction, { isLoading: isSigningOut }] = useSignOutMutation();

  const [idCopied, setIdCopied] = useState(false);

  const handleSignOut = async () => {
    await signOutAction();
    setSession(null);
    dispatch(signOut());
  };

  const handleCopyId = async () => {
    if (authenticatedUser?.id) {
      await Clipboard.setStringAsync(authenticatedUser.id);
      setIdCopied(true);
      setTimeout(() => setIdCopied(false), 2000);
    }
  };

  const handleRefresh = () => {
    refetchAuthenticatedUser();
    refetchUserSettings();
  };

  return (
    <LoadableScreenView
      isLoading={isLoadingAuthenticatedUser || isLoadingUserSettings || isSigningOut}>
      <SafeAreaView edges={['top']} style={styles.container}>
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          automaticallyAdjustKeyboardInsets
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <FocusedRefreshControl
              refreshing={isFetchingAuthenticatedUser || isFetchingUserSettings}
              onRefresh={handleRefresh}
            />
          }
          stickyHeaderIndices={[0]}>
          <ThemedView>
            <ThemedText type="title" style={styles.header}>
              {t('Settings')}
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.profile}>
            <ThemedView style={styles.profileHeader}>
              <ThemedView style={styles.avatar}>
                <ThemedText style={styles.avatarText}>
                  {authenticatedUser?.name?.charAt(0)?.toUpperCase() ?? '?'}
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.profileInfo}>
                <ThemedText type="subtitle" style={styles.profileName}>
                  {authenticatedUser?.name}
                </ThemedText>
                <ThemedText style={styles.profileEmail}>{authenticatedUser?.email}</ThemedText>
              </ThemedView>
            </ThemedView>

            <ThemedView style={styles.idContainer}>
              <ThemedView style={styles.idLabelRow}>
                <IonIcons
                  name="finger-print-outline"
                  size={16}
                  color={Colors[colorScheme ?? 'light'].neutral}
                />
                <ThemedText style={styles.idLabel}>{t('Your ID')}</ThemedText>
              </ThemedView>
              <HapticTab onPress={handleCopyId} style={styles.idValueRow}>
                <ThemedText style={styles.idValue} numberOfLines={1}>
                  {authenticatedUser?.id}
                </ThemedText>
                <IonIcons
                  style={styles.copyButton}
                  name={idCopied ? 'checkmark' : 'copy-outline'}
                  size={18}
                  color={Colors[colorScheme ?? 'light'].primary}
                />
              </HapticTab>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.settingsMenu}>
            <ActionMenuItem
              label={t('Main currency')}
              icon="cash-outline"
              onPress={() => router.navigate('../settings/main-currency-picker')}
              value={`${userSettings?.defaultCurrency} (${getSymbolFromCurrency(userSettings?.defaultCurrency ?? '')})`}
            />

            <ActionMenuItem
              label={t('Budgeting period')}
              icon="calendar-outline"
              onPress={() => {}}
              value={userSettings?.budgetingPeriod && t(userSettings?.budgetingPeriod)}
            />

            <ActionMenuItem
              label={t('Period starts')}
              icon="calendar-number-outline"
              onPress={() => {}}
              value={`${userSettings?.periodStartsOnDay}`}
            />

            <ActionMenuItem
              label={t('Sign out')}
              icon="exit-outline"
              color={Colors[colorScheme ?? 'light'].danger}
              onPress={() => setShowSignOutDialog(true)}
            />
          </ThemedView>

          <SettingsFooter />
        </ScrollView>
      </SafeAreaView>

      <SignOutDialog
        show={showSignOutDialog}
        setShow={setShowSignOutDialog}
        handleSignOut={handleSignOut}
      />
    </LoadableScreenView>
  );
};

type ActionMenuItemProps = {
  label: string;
  icon: string;
  onPress: () => void;
  value?: string;
  style?: StyleProp<ViewStyle>;
  color?: string;
};

const ActionMenuItem = ({ label, icon, color, onPress, style, value }: ActionMenuItemProps) => {
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme);

  return (
    <HapticTab style={[styles.actionMenuItem, style]} onPress={onPress}>
      <IonIcons
        // @ts-expect-error Hard to convert string to icon name
        name={icon}
        size={24}
        color={color ?? Colors[colorScheme ?? 'light'].text}
      />
      <ThemedText style={color ? { color } : {}}>{label}</ThemedText>

      {value && (
        <ThemedText style={{ marginLeft: 'auto', color: Colors[colorScheme ?? 'light'].neutral }}>
          {value}
        </ThemedText>
      )}
      <IonIcons
        name="chevron-forward"
        size={24}
        color={color ?? Colors[colorScheme ?? 'light'].text}
        style={[{ marginRight: -8 }, !value && { marginLeft: 'auto' }]}
      />
    </HapticTab>
  );
};

const SettingsFooter = () => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme);

  const Divider = () => (
    <ThemedText type="defaultSemiBold" style={styles.divider}>
      •
    </ThemedText>
  );

  return (
    <ThemedView style={styles.settingsFooter}>
      <ThemedText style={{ color: Colors[colorScheme ?? 'light'].neutral }}>
        {`${t('Version')} ${Application.nativeApplicationVersion} (${Application.nativeBuildVersion})`}
      </ThemedText>

      <Divider />

      <ThemedText style={styles.footerLink}>
        <Link href="../settings/privacy-policy">{t('Policy')}</Link>
      </ThemedText>

      <Divider />

      <ThemedText style={styles.footerLink}>
        <Link href="../settings/terms">{t('Terms')}</Link>
      </ThemedText>
    </ThemedView>
  );
};

const createStyles = (colorScheme: ColorSchemeName) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[colorScheme ?? 'light'].background,
      paddingHorizontal: 24,
    },

    header: {
      paddingBottom: 24,
    },

    profile: {
      backgroundColor: Colors[colorScheme ?? 'light'].containerBackground,
      borderRadius: 32,
      padding: 24,
    },

    profileHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      backgroundColor: 'transparent',
    },

    avatar: {
      width: 64,
      height: 64,
      borderRadius: 24,
      backgroundColor: Colors[colorScheme ?? 'light'].primary,
      alignItems: 'center',
      justifyContent: 'center',
    },

    avatarText: {
      fontSize: 24,
      fontWeight: '600',
      color: Colors[colorScheme ?? 'light'].textOnDarkBackground,
    },

    profileInfo: {
      flex: 1,
      backgroundColor: 'transparent',
    },

    profileName: {
      marginBottom: 2,
    },

    profileEmail: {
      color: Colors[colorScheme ?? 'light'].neutral,
      fontSize: 14,
    },

    idContainer: {
      marginTop: 20,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: Colors[colorScheme ?? 'light'].background,
      backgroundColor: 'transparent',
    },

    idLabelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 8,
      backgroundColor: 'transparent',
    },

    idLabel: {
      fontSize: 12,
      color: Colors[colorScheme ?? 'light'].neutral,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },

    idValueRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: Colors[colorScheme ?? 'light'].background,
      borderRadius: 12,
      paddingLeft: 14,
      paddingRight: 4,
      paddingVertical: 4,
    },

    idValue: {
      flex: 1,
      fontSize: 12,
      fontFamily: Fonts?.mono,
      color: Colors[colorScheme ?? 'light'].neutral,
    },

    copyButton: {
      padding: 10,
      borderRadius: 8,
    },

    settingsMenu: {
      backgroundColor: Colors[colorScheme ?? 'light'].containerBackground,
      borderRadius: 32,
      marginTop: 24,
    },

    actionMenuItem: {
      padding: 24,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },

    settingsFooter: {
      marginTop: 36,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    divider: {
      paddingHorizontal: 8,
    },
    footerLink: {
      fontWeight: 500,
    },
  });

export default SettingsScreen;
