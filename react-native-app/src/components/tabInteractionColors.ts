import type { themeDark } from '../theme/theme-dark';
import type { themeLight } from '../theme/theme-light';

/** Matches Figma-style naming: Default | Hovered | Pressed (derived from `Pressable` state). */
export type TabElementState = 'default' | 'hovered' | 'pressed';

export type TabInteraction = 'default' | 'hover' | 'pressed';

type ThemeColors = typeof themeLight.colors | typeof themeDark.colors;

/**
 * Maps public state names to internal resolver input (hover vs hovered naming).
 */
export function tabStateToInteraction(state: TabElementState): TabInteraction {
  if (state === 'hovered') return 'hover';
  if (state === 'pressed') return 'pressed';
  return 'default';
}

export function resolveTabInteraction(
  pressed: boolean,
  hovered: boolean
): TabInteraction {
  if (pressed) return 'pressed';
  if (hovered) return 'hover';
  return 'default';
}

/**
 * Semantic colors for tab label, bottom indicator, and optional press/hover surface.
 * **Active** uses brand text + `colorBorderBrandDefault` indicator; inactive uses neutral text.
 */
export function resolveTabColors(
  colors: ThemeColors,
  active: boolean,
  interaction: TabInteraction
): { text: string; indicator: string; background: string } {
  if (active) {
    if (interaction === 'pressed') {
      return {
        text: colors.colorTextBrandDefault,
        indicator: colors.colorBorderBrandDefault,
        background: colors.colorBackgroundBrandSubtle
      };
    }
    if (interaction === 'hover') {
      return {
        text: colors.colorTextBrandDefault,
        indicator: colors.colorBorderBrandDefault,
        background: colors.colorBackgroundBrandSubtle
      };
    }
    return {
      text: colors.colorTextBrandDefault,
      indicator: colors.colorBorderBrandDefault,
      background: 'transparent'
    };
  }

  if (interaction === 'pressed') {
    return {
      text: colors.colorTextBasePrimary,
      indicator: 'transparent',
      background: colors.colorBackgroundBaseSubtle
    };
  }
  if (interaction === 'hover') {
    return {
      text: colors.colorTextBasePrimary,
      indicator: 'transparent',
      background: colors.colorBackgroundBaseSubtle
    };
  }
  return {
    text: colors.colorTextBaseSecondary,
    indicator: 'transparent',
    background: 'transparent'
  };
}
