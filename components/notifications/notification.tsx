import { HapticTab } from '@/components/haptic-tab';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { NotificationType } from '@/features/notifications/state';
import { useColorScheme } from '@/hooks/use-color-scheme';
import IonIcons from '@expo/vector-icons/Ionicons';
import React, { useCallback, useEffect, useRef } from 'react';
import { Animated, ColorSchemeName, Platform, StyleSheet, View } from 'react-native';
import { Directions, Gesture, GestureDetector } from 'react-native-gesture-handler';

type Props = {
  type: NotificationType;
  message: string;
  onClose: () => void;
};

const Notification: React.FC<Props> = ({ type, message, onClose }) => {
  const colorScheme = useColorScheme();
  const styles = createStyles(type, colorScheme);
  const moveAnimation = useRef(new Animated.Value(-200)).current;
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClose = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    Animated.timing(moveAnimation, {
      toValue: -200,
      duration: 500,
      useNativeDriver: false,
    }).start(() => {
      onClose();
    });
  }, [moveAnimation, onClose]);

  const setCloseTimeout = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }

    closeTimeoutRef.current = setTimeout(handleClose, 10000);
  }, [handleClose]);

  useEffect(() => {
    Animated.timing(moveAnimation, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
    setCloseTimeout();

    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
    };
  }, [moveAnimation, setCloseTimeout]);

  const swipeUp = Gesture.Fling().direction(Directions.UP).onStart(handleClose);

  return (
    <Animated.View style={[styles.animatedContainer, { top: moveAnimation }]}>
      <GestureDetector gesture={swipeUp}>
        <View style={styles.container}>
          <ThemedText style={styles.text}>{message}</ThemedText>
          <HapticTab style={styles.closeContainer} onPress={handleClose}>
            <IonIcons
              name="close-outline"
              size={24}
              color={Colors[colorScheme ?? 'light'].textOnDarkBackground}
            />
          </HapticTab>
        </View>
      </GestureDetector>
    </Animated.View>
  );
};

const createStyles = (type: NotificationType, colorScheme: ColorSchemeName) =>
  StyleSheet.create({
    animatedContainer: {
      position: 'absolute',
      width: '100%',
      zIndex: 9999,
    },
    container: {
      // @ts-expect-error cannot use type as an array index
      backgroundColor: Colors[colorScheme ?? 'light'][type ?? 'error'],
      flexDirection: 'row',
      alignItems: 'center',
      padding: 20,
      paddingTop: Platform.OS === 'android' ? 24 : 64,
      shadowColor: '#000000',
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.4,
      shadowRadius: 3,
      elevation: 5,
    },
    text: {
      color: Colors[colorScheme ?? 'light'].textOnDarkBackground,
      maxWidth: '85%',
    },
    closeContainer: {
      marginLeft: 'auto',
      paddingLeft: 20,
    },
  });

export default Notification;
