/**
 * theme-light.ts
 * Do not edit directly, this file was auto-generated.
 */

import { colorLight } from '../../../style-dictionary/react-native/color-light';
import { size } from '../../../style-dictionary/react-native/size';
import { typographyMobile } from '../../../style-dictionary/react-native/typography-mobile';
import { typographyDesktop } from '../../../style-dictionary/react-native/typography-desktop';
import { elevationLight } from '../../../style-dictionary/react-native/elevation-light';

export const themeLight = {
  colors: colorLight,
  size,
  typography: {
    mobile: typographyMobile,
    desktop: typographyDesktop
  },
  elevation: elevationLight
} as const;

export default themeLight;
