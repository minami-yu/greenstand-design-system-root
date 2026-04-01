import {
  Montserrat_300Light,
  Montserrat_600SemiBold
} from '@expo-google-fonts/montserrat';
import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_600SemiBold
} from '@expo-google-fonts/roboto';

const fontFamilyMap = {
  Montserrat: {
    '300': 'Montserrat-Light',
    '600': 'Montserrat-SemiBold',
    default: 'Montserrat-Light'
  },
  Roboto: {
    '400': 'Roboto-Regular',
    '500': 'Roboto-Medium',
    '600': 'Roboto-SemiBold',
    default: 'Roboto-Regular'
  }
} as const;

export const appFonts = {
  Montserrat: Montserrat_300Light,
  'Montserrat-Light': Montserrat_300Light,
  'Montserrat-SemiBold': Montserrat_600SemiBold,
  Roboto: Roboto_400Regular,
  'Roboto-Regular': Roboto_400Regular,
  'Roboto-Medium': Roboto_500Medium,
  'Roboto-SemiBold': Roboto_600SemiBold
} as const;

export function getFontFamily(fontFamily: string, fontWeight?: string) {
  const familyMap = fontFamilyMap[fontFamily as keyof typeof fontFamilyMap];

  if (!familyMap) {
    return fontFamily;
  }

  if (fontWeight && fontWeight in familyMap) {
    return familyMap[fontWeight as keyof typeof familyMap];
  }

  return familyMap.default;
}
