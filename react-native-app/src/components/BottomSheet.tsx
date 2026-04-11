import { type ReactNode, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
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

type BottomSheetModalBodyProps = {
  visible: boolean;
  onRequestClose: () => void;
  children?: ReactNode;
  accessibilityLabel: string;
  setMounted: (next: boolean) => void;
};

/**
 * Renders sheet UI inside Modal + SafeAreaProvider so `useSafeAreaInsets` matches the modal window.
 */
function BottomSheetModalBody({
  visible,
  onRequestClose,
  children,
  accessibilityLabel,
  setMounted
}: BottomSheetModalBodyProps) {
  const { theme } = useTheme();
  const { colors, elevation, size } = theme;
  const sheetShadowLayer = elevation.sm.layers[1];
  const sheetShadow = reactNativeShadowFromElevationLayer(sheetShadowLayer, size.sizeDepth100);
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const screen = Dimensions.get('screen');
  const progress = useRef(new Animated.Value(0)).current;

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
  }, [visible, progress, setMounted]);

  const backdropOpacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
  });

  const sheetTravel =
    Platform.OS === 'ios' ? Math.max(windowHeight, screen.height) : windowHeight;

  const sheetTranslateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [sheetTravel, 0]
  });

  return (
    <View style={styles.root}>
      <Animated.View
        pointerEvents={visible ? 'auto' : 'none'}
        style={[StyleSheet.absoluteFill, { opacity: backdropOpacity }]}
      >
        <Pressable
          accessibilityLabel="Dismiss sheet"
          accessibilityRole="button"
          onPress={onRequestClose}
          style={[StyleSheet.absoluteFill, { backgroundColor: colors.colorBackgroundBaseOverlay }]}
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
  );
}

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
  const [mounted, setMounted] = useState(false);
  const modalVisible = visible || mounted;
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const screen = Dimensions.get('screen');
  // iOS Modal often lays out its root above the home-indicator strip; pin a full-screen layer.
  const iosModalLayerStyle =
    Platform.OS === 'ios'
      ? {
          position: 'absolute' as const,
          top: 0,
          left: 0,
          width: Math.max(screen.width, windowWidth),
          height: Math.max(screen.height, windowHeight)
        }
      : null;

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
      <View style={iosModalLayerStyle ?? styles.modalFill}>
        <SafeAreaProvider style={styles.modalFill}>
          <BottomSheetModalBody
            accessibilityLabel={accessibilityLabel}
            setMounted={setMounted}
            visible={visible}
            onRequestClose={onRequestClose}
          >
            {children}
          </BottomSheetModalBody>
        </SafeAreaProvider>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalFill: {
    flex: 1
  },
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
