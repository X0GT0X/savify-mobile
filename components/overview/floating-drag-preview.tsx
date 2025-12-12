import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getIconName } from '@/constants/icons';
import { Colors } from '@/constants/theme';
import { useDragDropContext } from '@/contexts/drag-drop-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import IonIcons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { ColorSchemeName, StyleSheet, View } from 'react-native';

export const FloatingDragPreview: React.FC = React.memo(() => {
  const { isDragging, draggedItem, dragPosition, isOverInvalidTarget } = useDragDropContext();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const styles = createStyles(colorScheme);

  if (!isDragging || !draggedItem) {
    return null;
  }

  const iconName = draggedItem.icon ? getIconName(draggedItem.icon) : 'help-circle';

  return (
    <View
      style={[
        styles.container,
        {
          left: dragPosition.x - 32, // Center on finger (64/2)
          top: dragPosition.y - 32,
        },
      ]}
      pointerEvents="none">
      <ThemedView
        style={[
          styles.preview,
          {
            backgroundColor: draggedItem.color || colors.containerBackground,
          },
        ]}>
        <IonIcons
          name={iconName as keyof typeof IonIcons.glyphMap}
          size={28}
          color={draggedItem.color ? colors.white : colors.text}
        />
      </ThemedView>

      <ThemedText style={styles.label} numberOfLines={1}>
        {draggedItem.name}
      </ThemedText>

      {isOverInvalidTarget && (
        <View style={[styles.invalidBadge, { backgroundColor: colors.danger }]}>
          <IonIcons name="close" size={16} color={colors.white} />
        </View>
      )}
    </View>
  );
});

const createStyles = (colorScheme: ColorSchemeName) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      width: 64,
      alignItems: 'center',
      opacity: 0.7,
      // Shadow for depth
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
    },
    preview: {
      width: 64,
      height: 64,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    label: {
      fontSize: 11,
      marginTop: 4,
      textAlign: 'center',
      maxWidth: 80,
    },
    invalidBadge: {
      position: 'absolute',
      top: -4,
      right: -4,
      width: 24,
      height: 24,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: Colors[colorScheme ?? 'light'].white,
    },
  });
