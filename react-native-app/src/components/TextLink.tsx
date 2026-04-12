import { Platform, Pressable, StyleSheet, Text } from 'react-native';
import { useTheme } from '../theme';
import { getTypographyStyle } from '../theme/typography';

export type TextLinkVariant = 'primary' | 'secondary';

export type TextLinkSize = 'medium' | 'large';

export type TextLinkProps = {
  children: string;
  onPress?: () => void;
  /**
   * Figma `style`: primary = text/brand/default; secondary = text/base/primary.
   * @see https://www.figma.com/design/hyfPWEHHgiH3YE3WWc6Cvn/Yuri-New-Roots-Design-System-1.0?node-id=13149-4121
   */
  variant?: TextLinkVariant;
  /** Figma `size`: medium → label-l; large → label-xl (both weight/medium). */
  size?: TextLinkSize;
  /**
   * Figma `inline`: when true, text is underlined (default matches component set default).
   * When false, no underline (standalone link treatment in Figma).
   */
  underline?: boolean;
};

/**
 * Figma component set **Text Link** (frame 13149:4121): `variant` × `size` × `underline`,
 * horizontal hit padding `space/100`, typography from mobile tokens.
 */
export function TextLink({
  children,
  onPress,
  variant = 'secondary',
  size = 'medium',
  underline = true
}: TextLinkProps) {
  const { theme } = useTheme();
  const { colors, size: sz } = theme;
  const typo = theme.typography.mobile;

  const token = size === 'large' ? typo.labelXl : typo.labelL;
  const textStyle = getTypographyStyle(token);

  const color = variant === 'primary' ? colors.colorTextBrandDefault : colors.colorTextBasePrimary;

  return (
    <Pressable
      accessibilityLabel={children}
      accessibilityRole="link"
      onPress={onPress}
      style={({ pressed }) => [
        styles.hit,
        {
          opacity: pressed ? 0.7 : 1,
          paddingHorizontal: sz.sizeSpace100
        }
      ]}
    >
      <Text
        style={[
          textStyle,
          {
            color,
            textAlign: 'center',
            textDecorationLine: underline ? 'underline' : 'none',
            ...Platform.select({
              web: { textDecorationStyle: 'solid' as const }
            })
          }
        ]}
      >
        {children}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});
