import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme';
import { getTypographyStyle } from '../theme/typography';
import { Icon } from './Icon';

const ICON_HIT = 48;
/** Figma `Header` toolbar row (`h-[56px]`). */
const BAR_HEIGHT = 56;

export type HeaderProps = {
  /**
   * When false, renders nothing (OS status bar is separate).
   * Figma: `header` = `"none"` | `"show"`.
   */
  show?: boolean;
  label?: string;
  showGoBack?: boolean;
  showLabel?: boolean;
  showMenu?: boolean;
  onBackPress?: () => void;
  onMenuPress?: () => void;
};

type LayoutMode =
  | 'back-title-menu'
  | 'title-menu'
  | 'back-menu'
  | 'back-only'
  | 'back-title'
  | 'title-only'
  | 'menu-only'
  | 'empty';

function inferLayout(
  showGoBack: boolean,
  showLabel: boolean,
  showMenu: boolean
): LayoutMode {
  if (!showGoBack && !showLabel && !showMenu) return 'empty';
  if (showGoBack && showLabel && showMenu) return 'back-title-menu';
  if (!showGoBack && showLabel && showMenu) return 'title-menu';
  if (showGoBack && showMenu && !showLabel) return 'back-menu';
  if (!showGoBack && showMenu && !showLabel) return 'menu-only';
  if (showGoBack && !showMenu && !showLabel) return 'back-only';
  if (showGoBack && showLabel && !showMenu) return 'back-title';
  if (!showGoBack && showLabel && !showMenu) return 'title-only';
  return 'empty';
}

/**
 * Figma `Header` (12927:12883): 56px bar on `background/netural/surface`; `label-l` medium title;
 * `space/300` horizontal padding when back + title + menu; `space/400` for paired / end-aligned rows;
 * 24px icons (`icon/lg`).
 */
export function Header({
  show = true,
  label = 'Upload',
  showGoBack = true,
  showLabel = false,
  showMenu = false,
  onBackPress,
  onMenuPress
}: HeaderProps) {
  const { theme } = useTheme();
  const { colors, size } = theme;
  const labelStyle = getTypographyStyle(theme.typography.mobile.labelL);
  const iconPx = size.sizeIconLg;
  const iconColor = colors.colorIconBasePrimary;
  const titleColor = colors.colorTextBasePrimary;

  if (!show) {
    return null;
  }

  const mode = inferLayout(showGoBack, showLabel, showMenu);
  if (mode === 'empty') {
    return null;
  }

  const padH =
    mode === 'back-title-menu' ? size.sizeSpace300 : size.sizeSpace400;

  const back = (
    <Pressable
      accessibilityLabel="Go back"
      accessibilityRole="button"
      hitSlop={8}
      onPress={onBackPress}
      style={[styles.side, styles.sideZ]}
    >
      <Icon name="arrow-left" size={iconPx} color={iconColor} accessible={false} />
    </Pressable>
  );

  const menu = (
    <Pressable
      accessibilityLabel="Open menu"
      accessibilityRole="button"
      hitSlop={8}
      onPress={onMenuPress}
      style={[styles.side, styles.sideZ]}
    >
      <Icon name="menu" size={iconPx} color={iconColor} accessible={false} />
    </Pressable>
  );

  const titleNode = showLabel ? (
    <Text numberOfLines={1} style={[labelStyle, { color: titleColor, textAlign: 'center' }]}>
      {label}
    </Text>
  ) : null;

  return (
    <View style={[styles.root, { backgroundColor: colors.colorBackgroundNeturalSurface }]}>
      {mode === 'back-title-menu' ? (
        <View style={[styles.bar, { height: BAR_HEIGHT, paddingHorizontal: padH }]}>
          {back}
          <View
            style={[styles.titleAbs, { paddingHorizontal: ICON_HIT }]}
            pointerEvents="none"
          >
            {titleNode}
          </View>
          {menu}
        </View>
      ) : null}

      {mode === 'title-menu' ? (
        <View style={[styles.barEnd, { height: BAR_HEIGHT, paddingHorizontal: padH }]}>
          <View
            style={[styles.titleAbs, { paddingHorizontal: ICON_HIT }]}
            pointerEvents="none"
          >
            {titleNode}
          </View>
          {menu}
        </View>
      ) : null}

      {mode === 'back-menu' ? (
        <View style={[styles.barBetween, { height: BAR_HEIGHT, paddingHorizontal: padH }]}>
          {back}
          {menu}
        </View>
      ) : null}

      {mode === 'back-only' ? (
        <View style={[styles.barStart, { height: BAR_HEIGHT, paddingHorizontal: size.sizeSpace300 }]}>
          {back}
        </View>
      ) : null}

      {mode === 'back-title' ? (
        <View style={[styles.bar, { height: BAR_HEIGHT, paddingHorizontal: size.sizeSpace300 }]}>
          {back}
          <View style={styles.titleFlex} pointerEvents="none">
            {titleNode}
          </View>
          <View style={styles.side} />
        </View>
      ) : null}

      {mode === 'title-only' ? (
        <View style={[styles.bar, { height: BAR_HEIGHT, paddingHorizontal: size.sizeSpace400 }]}>
          <View style={styles.titleAbs} pointerEvents="none">
            {titleNode}
          </View>
        </View>
      ) : null}

      {mode === 'menu-only' ? (
        <View style={[styles.barEnd, { height: BAR_HEIGHT, paddingHorizontal: padH }]}>
          {menu}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignSelf: 'stretch',
    width: '100%'
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
  barEnd: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%'
  },
  barStart: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%'
  },
  side: {
    alignItems: 'center',
    height: ICON_HIT,
    justifyContent: 'center',
    minWidth: ICON_HIT
  },
  sideZ: {
    zIndex: 1
  },
  titleAbs: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleFlex: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 8
  }
});
