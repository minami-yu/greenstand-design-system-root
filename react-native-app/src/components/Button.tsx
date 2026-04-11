import React, { type ReactNode } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  type GestureResponderEvent,
  type ViewStyle
} from 'react-native';
import { useTheme } from '../theme';
import { getTypographyStyle } from '../theme/typography';
import {
  readHovered,
  resolveButtonColors,
  type ButtonVariant
} from './buttonInteractionColors';
import { Icon, type IconName } from './Icon';

export type { ButtonVariant };

export type ButtonProps = {
  variant?: ButtonVariant;
  onPress: (e: GestureResponderEvent) => void;
  disabled?: boolean;
  children?: ReactNode;
  /** Leading icon from `Icon` / `ICON_MAP`. Omitted = text-only variant. */
  icon?: IconName;
  accessibilityLabel?: string;
  style?: ViewStyle;
};

/**
 * Mobile-first button: min 48×48pt touch target, **semantic color** tokens only
 * (`colorBackgroundBrand*`, `colorBackgroundBase*`, `colorBackgroundErrorEmphasis*`, `colorText*`),
 * typography **`labelLStrong`** (matches Figma text style `label-l-strong` / token `typography/label-l-strong`),
 * plus `size` tokens for radius/padding/gap. Press motion: 100ms in / 160ms out scale 0.98.
 */
export function Button({
  variant = 'primary',
  onPress,
  disabled,
  children,
  icon,
  accessibilityLabel,
  style
}: ButtonProps) {
  const { theme } = useTheme();
  const { colors, size } = theme;
  const scale = React.useRef(new Animated.Value(1)).current;

  const runScale = (to: number) => {
    Animated.timing(scale, {
      toValue: to,
      duration: to < 1 ? 100 : 160,
      useNativeDriver: true
    }).start();
  };

  const labelTypography = getTypographyStyle(theme.typography.mobile.labelLStrong);

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
                borderRadius: size.sizeRadiusXs,
                gap: size.sizeSpace200,
                minHeight: 48,
                paddingHorizontal: size.sizeSpace600,
                paddingVertical: size.sizeSpace300,
                transform: [{ scale }]
              },
              style
            ]}
          >
            {icon != null ? (
              <View style={styles.iconSlot}>
                <Icon
                  name={icon}
                  size={size.sizeIconMd}
                  color={foreground}
                  accessible={false}
                />
              </View>
            ) : null}
            {children != null ? (
              <Text style={[labelTypography, { color: foreground }]}>{children}</Text>
            ) : null}
          </Animated.View>
        );
      }}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iconSlot: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  surface: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  }
});
