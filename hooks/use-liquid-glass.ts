import { isLiquidGlassAvailable } from 'expo-glass-effect';

export const useLiquidGlass = () => {
  const IS_LIQUID_GLASS_AVAILABLE = process.env.EXPO_PUBLIC_LIQUID_GLASS_AVAILABLE;

  if (IS_LIQUID_GLASS_AVAILABLE !== undefined) {
    return {
      isLiquidGlassAvailable: IS_LIQUID_GLASS_AVAILABLE === 'true' && isLiquidGlassAvailable(),
    };
  }

  return { isLiquidGlassAvailable: isLiquidGlassAvailable() };
};
