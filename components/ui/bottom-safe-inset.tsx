import { useEffect, useState } from 'react';
import { Keyboard, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const TAB_BAR_HEIGHT = 68;

export const useBottomSafeInset = (inset?: number) => {
  const { bottom } = useSafeAreaInsets();

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', handleKeyboardShow);
    Keyboard.addListener('keyboardDidHide', handleKeyboardHide);

    return () => {
      showSubscription.remove();
    };
  }, []);

  const handleKeyboardShow = () => {
    setIsKeyboardVisible(true);
  };

  const handleKeyboardHide = () => {
    setIsKeyboardVisible(false);
  };

  return isKeyboardVisible ? 0 : (inset ?? TAB_BAR_HEIGHT + bottom);
};

const BottomSafeInset = ({ inset }: { inset?: number }) => {
  const bottom = useBottomSafeInset(inset);

  return <View style={{ height: bottom }} />;
};

export default BottomSafeInset;
