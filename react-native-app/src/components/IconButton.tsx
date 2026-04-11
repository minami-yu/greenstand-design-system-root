import React from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  View,
  type GestureResponderEvent,
  type ViewStyle
} from 'react-native';
import { useTheme } from '../theme';
import type { themeLight } from '../theme/theme-light';
import {
  readHovered,
  resolveButtonColors,
  type ButtonVariant
} from './buttonInteractionColors';
import { Icon, type IconName } from './Icon';

export type IconButtonSize = 'large' | 'medium' | 'small';

export type IconButtonProps = {
  /** Icon from `Icon` / `ICON_MAP`. */
  icon: IconName;
  variant?: ButtonVariant;
  size?: IconButtonSize;
  onPress: (e: GestureResponderEvent) => void;
  disabled?: boolean;
  accessibilityLabel: string;
  style?: ViewStyle;
};

function iconButtonMetrics(
  sizeTokens: typeof themeLight.size,
  size: IconButtonSize
): { hit: number; icon: number } {
  switch (size) {
    case 'small':
      return { hit: sizeTokens.sizeSpace800, icon: sizeTokens.sizeIconSm };
    case 'medium':
      return { hit: sizeTokens.sizeIcon2xl, icon: sizeTokens.sizeIconLg };
    default:
      return { hit: sizeTokens.sizeSpace1200, icon: sizeTokens.sizeIconXl };
  }
}

/**
 * Icon-only control: semantic **color** tokens (same as `Button`), **size** tokens for
 * hit area (`sizeSpace800` / `sizeIcon2xl` / `sizeSpace1200`) and glyph (`sizeIconSm` / `sizeIconLg` / `sizeIconXl`),
 * circular surface via `sizeRadiusFull`. States: default, hover (web), pressed, disabled.
 */
export function IconButton({
  icon,
  variant = 'primary',
  size: sizeProp = 'medium',
  onPress,
  disabled,
  accessibilityLabel,
  style
}: IconButtonProps) {
  const { theme } = useTheme();
  const { colors, size: sizeTokens } = theme;
  const scale = React.useRef(new Animated.Value(1)).current;
  const { hit, icon: iconSize } = iconButtonMetrics(sizeTokens, sizeProp);

  const runScale = (to: number) => {
    Animated.timing(scale, {
      toValue: to,
      duration: to < 1 ? 100 : 160,
      useNativeDriver: true
    }).start();
  };

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => {
        if (!disabled) runScale(0.98);
      }}
      onPressOut={() => {
        if (!disabled) runScale(1);
      }}
      style={{ alignSelf: 'flex-start' }}
    >
      {(state) => {
        const hovered = readHovered(state);
        const interaction = disabled
          ? 'disabled'
          : state.pressed
            ? 'pressed'
            : hovered
              ? 'hover'
              : 'default';
        const { background, foreground } = resolveButtonColors(colors, variant, interaction);

        return (
          <Animated.View
            style={[
              styles.surface,
              {
                backgroundColor: background,
                borderRadius: sizeTokens.sizeRadiusFull,
                height: hit,
                transform: [{ scale }],
                width: hit
              },
              style
            ]}
          >
            <View style={styles.iconCenter}>
              <Icon name={icon} size={iconSize} color={foreground} accessible={false} />
            </View>
          </Animated.View>
        );
      }}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iconCenter: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  surface: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  }
});
