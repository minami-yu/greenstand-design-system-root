import { Pressable, StyleSheet, Text, View, type PressableStateCallbackType } from 'react-native';
import { useTheme } from '../theme';
import { themeDark } from '../theme/theme-dark';
import { themeLight } from '../theme/theme-light';
import { getTypographyStyle } from '../theme/typography';
import type { IconName } from './Icon';
import { Icon } from './Icon';

type TokenColors = typeof themeLight.colors | typeof themeDark.colors;

/** RN Web / newer RN pass `hovered`; types may lag behind. */
type PressableStateWithHover = PressableStateCallbackType & { hovered?: boolean };

function isHovered(state: PressableStateCallbackType): boolean {
  return Boolean((state as PressableStateWithHover).hovered);
}

/** Matches Figma component property `Style`. */
export type ButtonStyle = 'primary' | 'secondary' | 'tertiary' | 'error';

/** Figma `Size=medium` only in this set. */
export type ButtonSize = 'medium';

export type ButtonProps = {
  children: string;
  /** Maps to Figma `Style` (default: primary). Named `variant` to avoid clashing with RN `style`. */
  variant?: ButtonStyle;
  size?: ButtonSize;
  disabled?: boolean;
  onPress?: () => void;
  /** When set, show icon on the leading or trailing side (Figma `Leading Icon` / `Trailing Icon`). */
  icon?: IconName;
  iconPlacement?: 'leading' | 'trailing';
  /** Stretch to parent width (e.g. full-width form actions). Figma symbols are fixed width; screens often stretch instances. */
  fullWidth?: boolean;
};

type InteractionState = 'default' | 'hovered' | 'pressed' | 'disabled';

function resolveInteractionState(
  disabled: boolean,
  pressed: boolean,
  hovered: boolean
): InteractionState {
  if (disabled) {
    return 'disabled';
  }
  if (pressed) {
    return 'pressed';
  }
  if (hovered) {
    return 'hovered';
  }
  return 'default';
}

function getButtonAppearance(
  colors: TokenColors,
  buttonStyle: ButtonStyle,
  state: InteractionState
): {
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  labelColor: string;
  iconColor: string;
} {
  if (state === 'disabled') {
    switch (buttonStyle) {
      case 'primary':
        return {
          backgroundColor: colors.colorFillBrandDisabled,
          borderColor: 'transparent',
          borderWidth: 0,
          labelColor: colors.colorTextBaseDisabled,
          iconColor: colors.colorTextBaseDisabled
        };
      case 'secondary':
        return {
          backgroundColor: 'transparent',
          borderColor: colors.colorBorderBaseDisabled,
          borderWidth: 1,
          labelColor: colors.colorTextBaseDisabled,
          iconColor: colors.colorTextBaseDisabled
        };
      case 'tertiary':
        return {
          backgroundColor: colors.colorFillNeutralDefaultDisabled,
          borderColor: 'transparent',
          borderWidth: 0,
          labelColor: colors.colorTextBaseDisabled,
          iconColor: colors.colorTextBaseDisabled
        };
      case 'error':
        return {
          backgroundColor: colors.colorFillErrorEmphasisDisabled,
          borderColor: 'transparent',
          borderWidth: 0,
          labelColor: colors.colorTextBaseDisabled,
          iconColor: colors.colorTextBaseDisabled
        };
      default:
        return {
          backgroundColor: colors.colorFillBrandDisabled,
          borderColor: 'transparent',
          borderWidth: 0,
          labelColor: colors.colorTextBaseDisabled,
          iconColor: colors.colorTextBaseDisabled
        };
    }
  }

  if (state === 'pressed') {
    switch (buttonStyle) {
      case 'primary':
        return {
          backgroundColor: colors.colorFillBrandSelected,
          borderColor: 'transparent',
          borderWidth: 0,
          labelColor: colors.colorTextBrandOnBrand,
          iconColor: colors.colorIconBrandOnBrand
        };
      case 'secondary':
        return {
          backgroundColor: colors.colorFillBrandSubtleHover,
          borderColor: colors.colorBorderBrandDefault,
          borderWidth: 1,
          labelColor: colors.colorTextBrandDefault,
          iconColor: colors.colorIconBrandDefault
        };
      case 'tertiary':
        return {
          backgroundColor: colors.colorFillNeutralDefaultActive,
          borderColor: 'transparent',
          borderWidth: 0,
          labelColor: colors.colorTextBasePrimary,
          iconColor: colors.colorTextBasePrimary
        };
      case 'error':
        return {
          backgroundColor: colors.colorFillErrorEmphasisActive,
          borderColor: 'transparent',
          borderWidth: 0,
          labelColor: colors.colorTextErrorOnEmphasis,
          iconColor: colors.colorIconErrorOnEmphasis
        };
      default:
        return {
          backgroundColor: colors.colorFillBrandSelected,
          borderColor: 'transparent',
          borderWidth: 0,
          labelColor: colors.colorTextBrandOnBrand,
          iconColor: colors.colorIconBrandOnBrand
        };
    }
  }

  if (state === 'hovered') {
    switch (buttonStyle) {
      case 'primary':
        return {
          backgroundColor: colors.colorFillBrandHover,
          borderColor: 'transparent',
          borderWidth: 0,
          labelColor: colors.colorTextBrandOnBrand,
          iconColor: colors.colorIconBrandOnBrand
        };
      case 'secondary':
        return {
          backgroundColor: colors.colorFillBrandSubtle,
          borderColor: colors.colorBorderBrandDefault,
          borderWidth: 1,
          labelColor: colors.colorTextBrandDefault,
          iconColor: colors.colorIconBrandDefault
        };
      case 'tertiary':
        return {
          backgroundColor: colors.colorFillNeutralDefaultHover,
          borderColor: 'transparent',
          borderWidth: 0,
          labelColor: colors.colorTextBasePrimary,
          iconColor: colors.colorTextBasePrimary
        };
      case 'error':
        return {
          backgroundColor: colors.colorFillErrorEmphasisHover,
          borderColor: 'transparent',
          borderWidth: 0,
          labelColor: colors.colorTextErrorOnEmphasis,
          iconColor: colors.colorIconErrorOnEmphasis
        };
      default:
        return {
          backgroundColor: colors.colorFillBrandHover,
          borderColor: 'transparent',
          borderWidth: 0,
          labelColor: colors.colorTextBrandOnBrand,
          iconColor: colors.colorIconBrandOnBrand
        };
    }
  }

  // default (resting)
  switch (buttonStyle) {
    case 'primary':
      return {
        backgroundColor: colors.colorFillBrandDefault,
        borderColor: 'transparent',
        borderWidth: 0,
        labelColor: colors.colorTextBrandOnBrand,
        iconColor: colors.colorIconBrandOnBrand
      };
    case 'secondary':
      return {
        backgroundColor: 'transparent',
        borderColor: colors.colorBorderBrandDefault,
        borderWidth: 1,
        labelColor: colors.colorTextBrandDefault,
        iconColor: colors.colorIconBrandDefault
      };
    case 'tertiary':
      return {
        backgroundColor: colors.colorFillNeutralDefault,
        borderColor: 'transparent',
        borderWidth: 0,
        labelColor: colors.colorTextBasePrimary,
        iconColor: colors.colorTextBasePrimary
      };
    case 'error':
      return {
        backgroundColor: colors.colorFillErrorEmphasisDefault,
        borderColor: 'transparent',
        borderWidth: 0,
        labelColor: colors.colorTextErrorOnEmphasis,
        iconColor: colors.colorIconErrorOnEmphasis
      };
    default:
      return {
        backgroundColor: colors.colorFillBrandDefault,
        borderColor: 'transparent',
        borderWidth: 0,
        labelColor: colors.colorTextBrandOnBrand,
        iconColor: colors.colorIconBrandOnBrand
      };
  }
}

/**
 * Figma `Button` component set (node 12618:892): Style × State × leading/trailing icon × Size=medium.
 * Tokens: fill/brand/*, fill/neutral/*, fill/error/emphasis-*, border/brand|base, text/*, label-l (body medium).
 */
export function Button({
  children,
  variant: buttonStyle = 'primary',
  size: _size = 'medium',
  disabled = false,
  onPress,
  icon,
  iconPlacement = 'leading',
  fullWidth = false
}: ButtonProps) {
  const { theme } = useTheme();
  const { colors, size } = theme;
  const typo = theme.typography.mobile;
  const labelTypography = getTypographyStyle(typo.labelL);

  const showIcon = Boolean(icon);
  const leading = showIcon && iconPlacement === 'leading';
  const trailing = showIcon && iconPlacement === 'trailing';

  return (
    <Pressable
      accessibilityLabel={children}
      accessibilityRole="button"
      accessibilityState={{ disabled: Boolean(disabled) }}
      disabled={disabled}
      onPress={onPress}
      style={(state) => {
        const interaction = resolveInteractionState(
          Boolean(disabled),
          state.pressed,
          isHovered(state)
        );
        const appearance = getButtonAppearance(colors, buttonStyle, interaction);

        return [
          styles.pressable,
          fullWidth && styles.pressableFullWidth,
          {
            backgroundColor: appearance.backgroundColor,
            borderColor: appearance.borderColor,
            borderRadius: size.sizeRadiusSm,
            borderWidth: appearance.borderWidth ? size.sizeStrokeSm : 0,
            gap: showIcon ? size.sizeSpace200 : size.sizeSpace0,
            minHeight: size.sizeSpace1200,
            minWidth: size.sizeSpace1200,
            paddingHorizontal: size.sizeSpace400,
            paddingVertical: size.sizeSpace300
          }
        ];
      }}
    >
      {(state) => {
        const interaction = resolveInteractionState(
          Boolean(disabled),
          state.pressed,
          isHovered(state)
        );
        const appearance = getButtonAppearance(colors, buttonStyle, interaction);

        const iconEl =
          icon != null ? (
            <Icon
              name={icon}
              size={size.sizeIconMd}
              color={appearance.iconColor}
              accessible={false}
            />
          ) : null;

        const labelEl = (
          <View style={styles.labelWrap}>
            <Text style={[labelTypography, { color: appearance.labelColor, textAlign: 'center' }]}>
              {children}
            </Text>
          </View>
        );

        return (
          <>
            {leading ? iconEl : null}
            {labelEl}
            {trailing ? iconEl : null}
          </>
        );
      }}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  pressableFullWidth: {
    alignSelf: 'stretch',
    width: '100%'
  },
  labelWrap: {
    justifyContent: 'center'
  }
});
