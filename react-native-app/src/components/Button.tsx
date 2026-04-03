import React, { type ReactElement, type ReactNode } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  type TextProps,
  View,
  type GestureResponderEvent,
  type ViewStyle
} from 'react-native';
import { useTheme } from '../theme';
import { getTypographyStyle } from '../theme/typography';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'error';

type ThemeColors = ReturnType<typeof useTheme>['theme']['colors'];

type Interaction = 'default' | 'hover' | 'pressed' | 'disabled';

function resolveButtonColors(
  colors: ThemeColors,
  variant: ButtonVariant,
  interaction: Interaction
): { background: string; foreground: string } {
  if (interaction === 'disabled') {
    if (variant === 'primary') {
      return {
        background: colors.colorBackgroundBrandDisabled,
        foreground: colors.colorTextBaseDisabled
      };
    }
    if (variant === 'secondary') {
      return {
        background: colors.colorBackgroundBaseSubtle,
        foreground: colors.colorTextBaseDisabled
      };
    }
    if (variant === 'tertiary') {
      return {
        background: 'transparent',
        foreground: colors.colorTextBaseDisabled
      };
    }
    return {
      background: colors.colorBackgroundBrandDisabled,
      foreground: colors.colorTextBaseDisabled
    };
  }

  if (variant === 'primary') {
    if (interaction === 'pressed') {
      return {
        background: colors.colorBackgroundBrandActive,
        foreground: colors.colorTextBrandOnBrand
      };
    }
    if (interaction === 'hover') {
      return {
        background: colors.colorBackgroundBrandHover,
        foreground: colors.colorTextBrandOnBrand
      };
    }
    return {
      background: colors.colorBackgroundBrandDefault,
      foreground: colors.colorTextBrandOnBrand
    };
  }

  if (variant === 'secondary') {
    if (interaction === 'pressed') {
      return {
        background: colors.colorBackgroundBaseSubtle,
        foreground: colors.colorTextBasePrimary
      };
    }
    if (interaction === 'hover') {
      return {
        background: colors.colorBackgroundBaseContainer,
        foreground: colors.colorTextBasePrimary
      };
    }
    return {
      background: colors.colorBackgroundBaseSubtle,
      foreground: colors.colorTextBasePrimary
    };
  }

  if (variant === 'tertiary') {
    if (interaction === 'pressed') {
      return {
        background: colors.colorBackgroundBaseSubtle,
        foreground: colors.colorTextBasePrimary
      };
    }
    if (interaction === 'hover') {
      return {
        background: colors.colorBackgroundBaseSubtle,
        foreground: colors.colorTextBasePrimary
      };
    }
    return {
      background: 'transparent',
      foreground: colors.colorTextBasePrimary
    };
  }

  if (interaction === 'pressed') {
    return {
      background: colors.colorBackgroundErrorEmphasisActive,
      foreground: colors.colorTextErrorOnEmphasis
    };
  }
  if (interaction === 'hover') {
    return {
      background: colors.colorBackgroundErrorEmphasisHover,
      foreground: colors.colorTextErrorOnEmphasis
    };
  }
  return {
    background: colors.colorBackgroundErrorEmphasisDefault,
    foreground: colors.colorTextErrorOnEmphasis
  };
}

/** Applies semantic foreground to `Text` (style.color) or icon components that accept `color` (e.g. MaterialIcons). */
function tintIconNode(icon: ReactNode, color: string): ReactNode {
  if (!React.isValidElement(icon)) {
    return icon;
  }
  const el = icon as ReactElement<TextProps & { color?: string }>;
  if (el.type === Text) {
    return React.cloneElement(el, {
      style: StyleSheet.flatten([el.props.style, { color }])
    });
  }
  return React.cloneElement(el, { color } as { color: string });
}

function readHovered(state: { pressed: boolean; hovered?: boolean }): boolean {
  return Boolean(state.hovered);
}

export type ButtonProps = {
  variant?: ButtonVariant;
  onPress: (e: GestureResponderEvent) => void;
  disabled?: boolean;
  children?: ReactNode;
  /** Leading icon (e.g. Material `favorite`). Omitted = text-only variant. */
  icon?: ReactNode;
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
        const interaction: Interaction = disabled
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
              <View style={styles.iconSlot}>{tintIconNode(icon, foreground)}</View>
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
