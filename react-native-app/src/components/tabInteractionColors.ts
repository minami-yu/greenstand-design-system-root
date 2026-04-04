import type { themeDark } from '../theme/theme-dark';
import type { themeLight } from '../theme/theme-light';

type ThemeColors = typeof themeLight.colors | typeof themeDark.colors;

/**
 * Semantic colors for tab label and bottom border (Figma: inactive `text/base/tertiary`, active brand + `stroke/md` underline).
 */
export function resolveTabColors(
  colors: ThemeColors,
  active: boolean
): { text: string; borderBottom: string; background: string } {
  if (active) {
    return {
      text: colors.colorTextBrandDefault,
      borderBottom: colors.colorBorderBrandDefault,
      background: 'transparent'
    };
  }
  return {
    text: colors.colorTextBaseTertiary,
    borderBottom: 'transparent',
    background: 'transparent'
  };
}
