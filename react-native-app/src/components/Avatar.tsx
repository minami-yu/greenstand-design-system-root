import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme';
import { getTypographyStyle } from '../theme/typography';

const AVATAR_PX = 40;

export type AvatarProps = {
  /** Up to ~2 characters; displayed uppercase. */
  initials: string;
  /** `brand` = token fill/brand/default; `neutral` = neutral fill for secondary entities. */
  variant?: 'brand' | 'neutral';
};

/**
 * Figma list avatar (13149:4221): 40px circle; initials 20px regular, ~28 line height.
 */
export function Avatar({ initials, variant = 'brand' }: AvatarProps) {
  const { theme } = useTheme();
  const { colors } = theme;
  const typo = theme.typography.mobile;
  const letter = getTypographyStyle(typo.paragraphL);

  const bg =
    variant === 'brand' ? colors.colorFillBrandDefault : colors.colorFillNeutralDefault;
  const fg = variant === 'brand' ? colors.colorTextBrandOnBrand : colors.colorTextBasePrimary;
  const shown = initials.trim().slice(0, 2).toUpperCase();

  return (
    <View style={[styles.circle, { backgroundColor: bg, height: AVATAR_PX, width: AVATAR_PX }]}>
      <Text style={[letter, styles.initials, { color: fg }]}>{shown}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    borderRadius: 9999,
    justifyContent: 'center',
    overflow: 'hidden'
  },
  initials: {
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 28
  }
});
