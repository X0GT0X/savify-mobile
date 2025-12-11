import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Image } from 'expo-image';
import React from 'react';
import { ImageStyle, Modal, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

type LoadableScreenViewProps = {
  isLoading: boolean;
  children: React.ReactNode;
  backgroundOpacity?: number;
};

type LoaderProps = {
  isLoading: boolean;
  backgroundOpacity?: number;
  style?: StyleProp<ViewStyle>;
  animationStyle?: StyleProp<ImageStyle>;
};

export const DetachedLoader = ({
  isLoading,
  backgroundOpacity,
  style,
  animationStyle,
}: LoaderProps) => {
  const colorScheme = useColorScheme();

  if (!isLoading) {
    return null;
  }

  return (
    <View
      style={[
        {
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          zIndex: 9999,
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor:
            colorScheme === 'light'
              ? `rgba(255, 255, 255, ${backgroundOpacity ?? 1})`
              : `rgba(21, 23, 24, ${backgroundOpacity ?? 1})`,
        },
        style,
      ]}>
      <Image
        source={
          colorScheme === 'light'
            ? require('@/assets/animations/loader-dark.gif')
            : require('@/assets/animations/loader-light.gif')
        }
        style={[styles.animation, animationStyle]}
        contentFit="contain"
        autoplay
      />
    </View>
  );
};

export const Loader = ({ isLoading, backgroundOpacity }: LoaderProps) => {
  const colorScheme = useColorScheme();

  return (
    <Modal visible={isLoading} transparent>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor:
            colorScheme === 'light'
              ? `rgba(255, 255, 255, ${backgroundOpacity ?? 1})`
              : `rgba(21, 23, 24, ${backgroundOpacity ?? 1})`,
        }}>
        <Image
          source={
            colorScheme === 'light'
              ? require('@/assets/animations/loader-dark.gif')
              : require('@/assets/animations/loader-light.gif')
          }
          style={styles.animation}
          contentFit="contain"
        />
      </View>
    </Modal>
  );
};

/**
 * This component should be used ONLY for initial loading. For other cases use `DetachedLoader` or another mechanics.
 *
 * @param isLoading
 * @param children
 * @param backgroundOpacity
 * @constructor
 */
const LoadableScreenView = ({
  isLoading,
  children,
  backgroundOpacity,
}: LoadableScreenViewProps) => {
  return (
    <ThemedView style={{ flex: 1 }}>
      {isLoading && <Loader isLoading={isLoading} backgroundOpacity={backgroundOpacity} />}
      {children}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  animation: {
    width: 100,
    height: 100,
  },
});

export default LoadableScreenView;
