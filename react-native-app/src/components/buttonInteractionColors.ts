import type { themeDark } from '../theme/theme-dark';
import type { themeLight } from '../theme/theme-light';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'error';

export type ButtonInteraction = 'default' | 'hover' | 'pressed' | 'disabled';

type ThemeColors = typeof themeLight.colors | typeof themeDark.colors;

export function resolveButtonColors(
  colors: ThemeColors,
  variant: ButtonVariant,
  interaction: ButtonInteraction
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

export function readHovered(state: { pressed: boolean; hovered?: boolean }): boolean {
  return Boolean(state.hovered);
}
