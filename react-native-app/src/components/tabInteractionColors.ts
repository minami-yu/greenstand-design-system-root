import type { themeDark } from '../theme/theme-dark';
import type { themeLight } from '../theme/theme-light';

type ThemeColors = typeof themeLight.colors | typeof themeDark.colors;

/**
 * Semantic colors for tab label and bottom indicator (no hover/press surface).
 * **Active** uses brand text + `colorBorderBrandDefault` indicator; inactive uses neutral text.
 */
export function resolveTabColors(
  colors: ThemeColors,
  active: boolean
): { text: string; indicator: string; background: string } {
  if (active) {
    return {
      text: colors.colorTextBrandDefault,
      indicator: colors.colorBorderBrandDefault,
      background: 'transparent'
    };
  }
  return {
    text: colors.colorTextBaseSecondary,
    indicator: 'transparent',
    background: 'transparent'
  };
}
