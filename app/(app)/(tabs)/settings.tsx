import { HapticTab } from '@/components/haptic-tab';
import LoadableScreenView from '@/components/loading/loadable-screen-view';
import SignOutDialog from '@/components/settings/sign-out-dialog';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useGetAuthenticatedUserQuery, useSignOutMutation } from '@/features/auth/api';
import { setSession } from '@/features/auth/session';
import { signOut } from '@/features/auth/state';
import { useColorScheme } from '@/hooks/use-color-scheme';
import IonIcons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ColorSchemeName, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

const SettingsScreen = () => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme);
  const dispatch = useDispatch();

  const { data: authenticatedUser, isFetching: isFetchingAuthenticatedUser } =
    useGetAuthenticatedUserQuery();

  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const [signOutAction, { isLoading: isSigningOut }] = useSignOutMutation();

  const handleSignOut = async () => {
    await signOutAction();
    setSession(null);
    dispatch(signOut());
  };

  return (
    <LoadableScreenView isLoading={isFetchingAuthenticatedUser || isSigningOut}>
      <SafeAreaView edges={['top']} style={styles.container}>
        <ThemedText type="title">{t('Settings')}</ThemedText>

        <ThemedView
          style={{
            backgroundColor: Colors[colorScheme ?? 'light'].white,
            borderRadius: 32,
            // padding: 24,
            marginTop: 24,
          }}>
          {/*<ThemedText>{authenticatedUser?.name}</ThemedText>*/}
          {/*<ThemedText>{authenticatedUser?.email}</ThemedText>*/}
          {/*<ThemedText>{authenticatedUser?.id}</ThemedText>*/}

          <ActionMenuItem
            label={t('Sign out')}
            icon="exit-outline"
            color={Colors[colorScheme ?? 'light'].danger}
            onPress={() => setShowSignOutDialog(true)}
          />
        </ThemedView>
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
  style?: StyleProp<ViewStyle>;
  color?: string;
};

const ActionMenuItem = ({ label, icon, color, onPress, style }: ActionMenuItemProps) => {
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
      <IonIcons
        name="chevron-forward"
        size={24}
        color={color ?? Colors[colorScheme ?? 'light'].text}
        style={{ marginLeft: 'auto', marginRight: -8 }}
      />
    </HapticTab>
  );
};

const createStyles = (colorScheme: ColorSchemeName) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[colorScheme ?? 'light'].background,
      paddingHorizontal: 24,
    },

    actionMenuItem: {
      padding: 24,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
  });

export default SettingsScreen;
