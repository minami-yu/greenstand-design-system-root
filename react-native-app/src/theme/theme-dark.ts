/**
 * theme-dark.ts
 * Do not edit directly, this file was auto-generated.
 */

import { colorDark } from '../../../style-dictionary/react-native/color-dark';
import { size } from '../../../style-dictionary/react-native/size';
import { typographyMobile } from '../../../style-dictionary/react-native/typography-mobile';
import { typographyDesktop } from '../../../style-dictionary/react-native/typography-desktop';
import { elevationDark } from '../../../style-dictionary/react-native/elevation-dark';

export const themeDark = {
  colors: colorDark,
  size,
  typography: {
    mobile: typographyMobile,
    desktop: typographyDesktop
  },
  elevation: elevationDark
} as const;

export default themeDark;
