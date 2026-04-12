import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme';
import { getTypographyStyle } from '../theme/typography';
import { Icon } from './Icon';

/**
 * Figma `WalletHeader` (13134:13720) under [Header](https://www.figma.com/design/hyfPWEHHgiH3YE3WWc6Cvn/Yuri-New-Roots-Design-System-1.0?node-id=12927-12883):
 * `go back`: 56px row, `px` `space/400`, back + `label-l` medium title (screen-centered) + menu on `fill/brand/accent` or `background/netural/surface`.
 * `accent` / `home`: brand bar with back+search or search-only. Status bar is OS / `SafeAreaView`.
 */
export type WalletHeaderVariant = 'none' | 'goBack' | 'accent' | 'home';

export type WalletHeaderProps = {
  /** Maps to Figma property `header`. */
  variant?: WalletHeaderVariant;
  /** Center title when `variant="goBack"`. */
  label?: string;
  onBackPress?: () => void;
  onMenuPress?: () => void;
  onSearchPress?: () => void;
};

const ICON_HIT = 48;

export function WalletHeader({
  variant = 'none',
  label = 'Upload',
  onBackPress,
  onMenuPress,
  onSearchPress
}: WalletHeaderProps) {
  const { theme } = useTheme();
  const { colors, layout, size } = theme;
  const labelStyle = getTypographyStyle(theme.typography.mobile.labelL);

  if (variant === 'none') {
    return null;
  }

  const isBrandBar = variant === 'accent' || variant === 'home';
  const barHeight = layout.walletHeaderBarHeight;
  const iconPx = size.sizeIconLg;
  const gutter = layout.screenHorizontalGutter;

  const onBrand = isBrandBar;
  const bg = onBrand ? colors.colorFillBrandAccent : colors.colorBackgroundNeturalSurface;
  const iconColor = onBrand ? colors.colorIconBrandOnBrand : colors.colorIconBasePrimary;
  const titleColor = colors.colorTextBasePrimary;

  return (
    <View style={[styles.root, { backgroundColor: bg, width: '100%' }]}>
      {variant === 'goBack' ? (
        <View style={[styles.bar, { height: barHeight, paddingHorizontal: gutter }]}>
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            hitSlop={8}
            onPress={onBackPress}
            style={[styles.iconHit, styles.iconHitZ]}
          >
            <Icon name="arrow-left" size={iconPx} color={iconColor} accessible={false} />
          </Pressable>
          <View
            style={[styles.titleAbs, { paddingHorizontal: ICON_HIT }]}
            pointerEvents="none"
          >
            <Text numberOfLines={1} style={[labelStyle, { color: titleColor, textAlign: 'center' }]}>
              {label}
            </Text>
          </View>
          <Pressable
            accessibilityLabel="Open menu"
            accessibilityRole="button"
            hitSlop={8}
            onPress={onMenuPress}
            style={[styles.iconHit, styles.iconHitZ]}
          >
            <Icon name="menu" size={iconPx} color={iconColor} accessible={false} />
          </Pressable>
        </View>
      ) : null}

      {variant === 'accent' ? (
        <View style={[styles.barBetween, { height: barHeight, paddingHorizontal: gutter }]}>
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            hitSlop={8}
            onPress={onBackPress}
            style={[styles.iconHit, styles.iconHitZ]}
          >
            <Icon name="arrow-left" size={iconPx} color={iconColor} accessible={false} />
          </Pressable>
          <Pressable
            accessibilityLabel="Search"
            accessibilityRole="button"
            hitSlop={8}
            onPress={onSearchPress}
            style={[styles.iconHit, styles.iconHitZ]}
          >
            <Icon name="search" size={iconPx} color={iconColor} accessible={false} />
          </Pressable>
        </View>
      ) : null}

      {variant === 'home' ? (
        <View style={[styles.barHome, { height: barHeight, paddingHorizontal: gutter }]}>
          <Pressable
            accessibilityLabel="Search"
            accessibilityRole="button"
            hitSlop={8}
            onPress={onSearchPress}
            style={[styles.iconHitEnd, styles.iconHitZ]}
          >
            <Icon name="search" size={iconPx} color={iconColor} accessible={false} />
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'stretch'
  },
  bar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  barBetween: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  barHome: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%'
  },
  iconHit: {
    alignItems: 'center',
    height: ICON_HIT,
    justifyContent: 'center',
    minWidth: ICON_HIT
  },
  iconHitEnd: {
    alignItems: 'center',
    height: ICON_HIT,
    justifyContent: 'center',
    minWidth: ICON_HIT
  },
  iconHitZ: {
    zIndex: 1
  },
  titleAbs: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
