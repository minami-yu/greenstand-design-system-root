import { type ReactNode, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { reactNativeShadowFromElevationLayer } from '../theme/elevationRN';

export type BottomSheetProps = {
  visible: boolean;
  /** Invoked for Android hardware back, backdrop tap, and any other dismiss paths you wire. */
  onRequestClose: () => void;
  children?: ReactNode;
  /** Accessibility name for the sheet surface (screen readers). */
  accessibilityLabel?: string;
};

/**
 * Cross-platform bottom sheet: transparent `Modal` (correct stacking on iOS/Android),
 * aligned with Figma “Bottom Sheet” (node 12766:112902): scrim `colorBackgroundBaseOverlay`,
 * surface `colorBackgroundBaseContainer`, handle `colorBorderBaseDefault` (4×32),
 * header padding `sizeSpace400`, content `sizeSpace400` top / `sizeSpace800` horizontal,
 * bottom inset at least `sizeSpace800`, top radii `sizeRadiusLg`, shadow `elevation.sm`
 * (Android via `sizeDepth100`). Slide uses `Animated` + native driver.
 */
export function BottomSheet({
  visible,
  onRequestClose,
  children,
  accessibilityLabel = 'Bottom sheet'
}: BottomSheetProps) {
  const { theme } = useTheme();
  const { colors, elevation, size } = theme;
  const sheetShadowLayer = elevation.sm.layers[1];
  const sheetShadow = reactNativeShadowFromElevationLayer(sheetShadowLayer, size.sizeDepth100);
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const progress = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(false);
  const modalVisible = visible || mounted;

  useEffect(() => {
    if (visible) {
      setMounted(true);
      progress.setValue(0);
      requestAnimationFrame(() => {
        Animated.timing(progress, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true
        }).start();
      });
      return;
    }

    Animated.timing(progress, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true
    }).start(({ finished }) => {
      if (finished) {
        setMounted(false);
      }
    });
  }, [visible, progress]);

  const backdropOpacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
  });

  const sheetTranslateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [windowHeight, 0]
  });

  if (!modalVisible) {
    return null;
  }

  return (
    <Modal
      accessibilityViewIsModal
      animationType="none"
      onRequestClose={onRequestClose}
      presentationStyle={Platform.OS === 'ios' ? 'overFullScreen' : undefined}
      statusBarTranslucent={Platform.OS === 'android'}
      transparent
      visible={modalVisible}
    >
      <View style={styles.root}>
        <Animated.View
          pointerEvents={visible ? 'auto' : 'none'}
          style={[StyleSheet.absoluteFill, { opacity: backdropOpacity }]}
        >
          <Pressable
            accessibilityLabel="Dismiss sheet"
            accessibilityRole="button"
            onPress={onRequestClose}
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: colors.colorBackgroundBaseOverlay }
            ]}
          />
        </Animated.View>

        <Animated.View
          accessibilityLabel={accessibilityLabel}
          accessibilityRole="none"
          importantForAccessibility="yes"
          style={[styles.sheetMotion, { transform: [{ translateY: sheetTranslateY }] }]}
        >
          <View
            style={[
              styles.sheet,
              {
                backgroundColor: colors.colorBackgroundBaseContainer,
                borderTopLeftRadius: size.sizeRadiusLg,
                borderTopRightRadius: size.sizeRadiusLg,
                ...sheetShadow
              }
            ]}
          >
            <View
              style={[
                styles.header,
                {
                  padding: size.sizeSpace400
                }
              ]}
            >
              <View
                style={[
                  styles.handle,
                  {
                    backgroundColor: colors.colorBorderBaseDefault,
                    borderRadius: size.sizeRadiusFull,
                    height: size.sizeSpace100,
                    width: size.sizeSpace800
                  }
                ]}
              />
            </View>
            <View
              style={{
                paddingBottom: Math.max(insets.bottom, size.sizeSpace800),
                paddingHorizontal: size.sizeSpace800,
                paddingTop: size.sizeSpace400,
                width: '100%'
              }}
            >
              {children}
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  handle: {
    alignSelf: 'center'
  },
  header: {
    alignItems: 'center',
    width: '100%'
  },
  root: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  sheet: {
    maxHeight: '90%',
    width: '100%'
  },
  sheetMotion: {
    maxHeight: '90%',
    width: '100%'
  }
});
