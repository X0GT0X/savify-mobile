import IonIcons from '@expo/vector-icons/Ionicons';

export const AVAILABLE_ICONS: (keyof typeof IonIcons.glyphMap)[] = [
  'cash',
  'card',
  'journal',
  'wallet',
  'logo-euro',
  'logo-usd',
  'logo-yen',
  'cart',
  'bag',
  'bag-handle',
  'basket',
  'gift',
  'home',
  'storefront',
  'car',
  'bus',
  'airplane',
  'train',
  'subway',
  'bicycle',
  'boat',
  'restaurant',
  'fast-food',
  'cafe',
  'beer',
  'pint',
  'wine',
  'pizza',
  'ice-cream',
  'dice',
  'fitness',
  'football',
  'basketball',
  'tennisball',
  'barbell',
  'heart',
  'medkit',
  'shirt',
  'receipt',
  'briefcase',
  'business',
  'construct',
  'color-palette',
  'game-controller',
  'musical-notes',
  'camera',
  'film',
  'ticket',
  'library',
  'newspaper',
  'school',
  'water',
  'flame',
  'flash',
  'bulb',
  'earth',
  'compass',
  'paw',
  'fish',
  'skull',
  'trash',
  'diamond',
  'key',
  'notifications',
  'wifi',
  'cellular',
  'at-circle',
  'cloud',
  'analytics',
  'trending-up',
  'trending-down',
  'stats-chart',
  'pie-chart',
  'bar-chart',
];

export type IconType = 'ion' | 'custom';

export const getIconType = (icon: string) => {
  return icon.includes('@') ? icon.split('@')[1] : 'ion';
};

export const getIconName = (icon: string) => {
  return icon.includes('@') ? icon.split('@')[0] : icon;
};

export const buildIconName = (name: string, type: string) => {
  return `${name}@${type}`;
};
