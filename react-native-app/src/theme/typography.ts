import type { TextStyle } from 'react-native';
import type { ReactNativeTypographyStyle } from '../../../style-dictionary/react-native/typography-mobile';
import { getFontFamily } from './fonts';

export function getTypographyStyle(token: ReactNativeTypographyStyle): TextStyle {
  return {
    fontFamily: getFontFamily(token.fontFamily, token.fontWeight),
    fontSize: token.fontSize,
    letterSpacing: token.letterSpacing,
    lineHeight: token.lineHeight
  };
}
