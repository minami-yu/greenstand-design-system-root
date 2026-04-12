import { size } from '../../../style-dictionary/react-native/size';

/**
 * Semantic layout values for app screens. Map to Style Dictionary `size` tokens so
 * spacing stays token-first (change the token in `design-tokens/` + `npm run build:tokens`).
 */
export const layout = {
  /**
   * Horizontal inset for standard full-width screens (e.g. Figma 360px frame with 16px side padding).
   * Token: `size/space/400`.
   */
  screenHorizontalGutter: size.sizeSpace400,
  /**
   * Figma `WalletHeader` toolbar row height (symbols 13134:13730, 13134:14224, 13134:14331).
   * Not yet in Style Dictionary `size`; add a token if this should be shared globally.
   */
  walletHeaderBarHeight: 56
} as const;

export type ThemeLayout = typeof layout;
