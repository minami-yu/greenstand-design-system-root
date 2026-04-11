import { Platform, type ViewStyle } from 'react-native';
import type { ReactNativeElevationLayer } from '../../../style-dictionary/react-native/elevation-light';

/**
 * Maps one design-system elevation layer to a React Native shadow/elevation.
 * Multi-layer tokens are approximated to a single RN shadow (iOS) + `elevation` (Android).
 */
export function reactNativeShadowFromElevationLayer(
  layer: ReactNativeElevationLayer,
  androidElevation: number
): ViewStyle {
  return (
    Platform.select<ViewStyle>({
      ios: {
        shadowColor: layer.color,
        shadowOffset: { width: layer.offsetX, height: layer.offsetY },
        shadowOpacity: 1,
        shadowRadius: Math.max(layer.blur / 2, 0)
      },
      android: { elevation: androidElevation },
      default: {}
    }) ?? {}
  );
}
