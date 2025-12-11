import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import {
  ColorSchemeName,
  StyleSheet,
  TouchableOpacity,
  type TouchableOpacityProps,
  View,
} from 'react-native';
import { StyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import { TextStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

export type ButtonProps = TouchableOpacityProps & {
  label: string;
  icon?: React.ReactNode;
  type?: 'primary' | 'link' | 'neutral';
  textStyle?: StyleProp<TextStyle>;
};

export const Button = ({
  style,
  textStyle,
  type = 'primary',
  label,
  icon,
  ...rest
}: ButtonProps) => {
  const colorScheme = useColorScheme();

  const styles = createStyles(colorScheme);
  const textStyles = createTextStyles(colorScheme);

  return (
    <TouchableOpacity
      style={[
        styles.default,
        type === 'primary' ? styles.primary : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'neutral' ? styles.neutral : undefined,
        style,
      ]}
      {...rest}>
      <View style={styles.iconContainer}>{icon}</View>
      <ThemedText
        type="defaultSemiBold"
        style={[
          textStyles.default,
          type === 'primary' ? textStyles.primary : undefined,
          type === 'link' ? textStyles.link : undefined,
          type === 'neutral' ? textStyles.neutral : undefined,
          textStyle,
        ]}>
        {label}
      </ThemedText>
    </TouchableOpacity>
  );
};

const createStyles = (colorScheme: ColorSchemeName) =>
  StyleSheet.create({
    default: {
      paddingVertical: 18,
      borderRadius: 24,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 4,
    },
    primary: {
      backgroundColor: Colors[colorScheme ?? 'light'].primary,
    },
    link: {
      paddingVertical: 0,
      borderRadius: 0,
    },
    neutral: {
      backgroundColor: Colors[colorScheme ?? 'light'].neutral,
    },
    iconContainer: {},
  });

const createTextStyles = (colorScheme: ColorSchemeName) =>
  StyleSheet.create({
    default: {
      textAlign: 'center',
    },
    primary: {
      color: Colors[colorScheme ?? 'light'].textOnDarkBackground,
    },
    link: {
      color: Colors[colorScheme ?? 'light'].primary,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      textAlign: 'left',
    },
    neutral: {
      textAlign: 'left',
    },
  });
