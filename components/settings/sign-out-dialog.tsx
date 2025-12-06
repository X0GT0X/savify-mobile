import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

type SignOutDialogProps = {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  handleSignOut: () => void;
};

const SignOutDialog = ({ show, setShow, handleSignOut }: SignOutDialogProps) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (show) {
      const handleCancel = () => {
        setShow(false);
      };

      const handleConfirm = () => {
        handleSignOut();
        setShow(false);
      };

      Alert.alert(
        t('Sign out'),
        `${t('Are you sure you want to sign out')}?`,
        [
          {
            text: t('Cancel'),
            onPress: handleCancel,
            style: 'cancel',
          },
          {
            text: t('Yes'),
            onPress: handleConfirm,
            style: 'destructive',
          },
        ],
        { cancelable: true, onDismiss: handleCancel },
      );
    }
  }, [show, t, setShow, handleSignOut]);

  return null;
};

export default SignOutDialog;
