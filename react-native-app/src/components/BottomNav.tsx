import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { size as sizeTokens } from '../../../style-dictionary/react-native/size';
import { useTheme } from '../theme';
import { reactNativeShadowFromElevationLayer } from '../theme/elevationRN';
import { getTypographyStyle } from '../theme/typography';
import type { IconName } from './Icon';
import { Icon } from './Icon';

/** Figma wallet navbar slot: outline + filled pair for inactive / active. */
export type BottomNavTabItem = {
  type: 'tab';
  id: string;
  label: string;
  icon: IconName;
  iconActive: IconName;
};

export type BottomNavFabItem = {
  type: 'fab';
  id: string;
  icon: IconName;
};

export type BottomNavItem = BottomNavTabItem | BottomNavFabItem;

export type BottomNavProps = {
  items: BottomNavItem[];
  activeId: string;
  onTabPress: (id: string) => void;
  onFabPress?: () => void;
};

const ROW_MIN = 58;
const FAB_OUTER = 64;
const FAB_INNER = 56;
/** ~25% of diameter above the bar (Figma 12793:1348). */
const FAB_TOP_OVERLAP = 16;

/**
 * Bar body height for scroll inset (overlap + tab row + label padding). Add `insets.bottom` on the screen for home indicator.
 * Matches `sizeSpace400` bottom padding on the bar (updated Figma navbar).
 */
export const BOTTOM_NAV_SCROLL_PADDING = FAB_TOP_OVERLAP + ROW_MIN + sizeTokens.sizeSpace400;

/**
 * Figma Bottom Nav (12793:1348): full-bleed bottom bar, subtle top edge, `elevation/sm`;
 * bar `pb` = `space/400` (16); FAB in center column; ~¼ circle above the bar;
 * labels use safe-area inset on the inside only.
 */
export function BottomNav({ items, activeId, onTabPress, onFabPress }: BottomNavProps) {
  const { theme } = useTheme();
  const { colors, elevation, size } = theme;
  const typo = theme.typography.mobile;
  const labelXs = getTypographyStyle(typo.labelXs);
  const insets = useSafeAreaInsets();

  const shadowLayer = elevation.sm.layers[2] ?? elevation.sm.layers[0];
  const barShadow = reactNativeShadowFromElevationLayer(shadowLayer, 6);
  const fabShadow = reactNativeShadowFromElevationLayer(shadowLayer, 8);

  return (
    <View pointerEvents="box-none" style={[styles.fixed, styles.fixedDims]}>
      <View
        style={[
          styles.bar,
          {
            backgroundColor: colors.colorBackgroundNeturalSurface,
            borderTopColor: colors.colorBorderBaseSubtle,
            borderTopWidth: size.sizeStrokeSm,
            paddingBottom: insets.bottom,
            ...barShadow
          }
        ]}
      >
        <View style={[styles.row, { minHeight: ROW_MIN }]}>
          {items.map((item) => {
            if (item.type === 'fab') {
              return (
                <View key={item.id} style={[styles.slot, styles.fabColumn]}>
                  <Pressable
                    accessibilityLabel="Transfer"
                    accessibilityRole="button"
                    hitSlop={8}
                    onPress={onFabPress}
                    style={({ pressed }) => [
                      styles.fabAnchor,
                      {
                        elevation: Platform.OS === 'android' ? 14 : undefined,
                        height: FAB_OUTER,
                        opacity: pressed ? 0.92 : 1,
                        top: -FAB_TOP_OVERLAP,
                        zIndex: 10
                      }
                    ]}
                  >
                    <View
                      style={[
                        styles.fabOuter,
                        {
                          backgroundColor: colors.colorBackgroundNeturalSurface,
                          height: FAB_OUTER,
                          width: FAB_OUTER
                        }
                      ]}
                    >
                      <View
                        style={[
                          styles.fabInner,
                          {
                            backgroundColor: colors.colorFillBrandDefault,
                            height: FAB_INNER,
                            width: FAB_INNER,
                            ...fabShadow
                          }
                        ]}
                      >
                        <Icon
                          name={item.icon}
                          size={size.sizeIconLg}
                          color={colors.colorIconBrandOnBrand}
                          accessible={false}
                        />
                      </View>
                    </View>
                  </Pressable>

                  <View style={[styles.tabColumn, { minHeight: ROW_MIN, paddingBottom: size.sizeSpace200 }]}>
                    <View style={[styles.iconStack, { gap: size.sizeSpace200, paddingHorizontal: size.sizeSpace300 }]}>
                      <View style={{ height: size.sizeStrokeMd, width: '100%' }} />
                      <View style={{ height: size.sizeIconLg, width: size.sizeIconLg }} />
                    </View>
                    <Text style={[labelXs, { color: colors.colorTextBaseSecondary, textAlign: 'center' }]}> </Text>
                  </View>
                </View>
              );
            }

            const active = activeId === item.id;
            const iconName = active ? item.iconActive : item.icon;
            const labelColor = active ? colors.colorTextBasePrimary : colors.colorTextBaseSecondary;
            const iconColor = active ? colors.colorIconBasePrimary : colors.colorIconBaseSecondary;

            return (
              <Pressable
                key={item.id}
                accessibilityLabel={item.label}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                onPress={() => onTabPress(item.id)}
                style={({ pressed }) => [styles.slot, { opacity: pressed ? 0.85 : 1 }]}
              >
                <View style={[styles.tabColumn, { minHeight: ROW_MIN, paddingBottom: size.sizeSpace200 }]}>
                  <View style={[styles.iconStack, { gap: size.sizeSpace200, paddingHorizontal: size.sizeSpace300 }]}>
                    <View
                      style={{
                        backgroundColor: active ? colors.colorBorderBaseStrong : 'transparent',
                        height: size.sizeStrokeMd,
                        width: '100%'
                      }}
                    />
                    <Icon name={iconName} size={size.sizeIconLg} color={iconColor} accessible={false} />
                  </View>
                  <Text style={[labelXs, { color: labelColor, textAlign: 'center', width: '100%' }]}>
                    {item.label}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fixed: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    zIndex: 100
  },
  fixedDims: {
    // Let FAB draw above the bar without clipping from this wrapper
    overflow: 'visible'
  },
  bar: {
    overflow: 'visible',
    width: '100%'
  },
  row: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    width: '100%'
  },
  slot: {
    flex: 1,
    minWidth: 0
  },
  fabColumn: {
    alignItems: 'stretch',
    overflow: 'visible',
    position: 'relative',
    zIndex: 2
  },
  fabAnchor: {
    alignItems: 'center',
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0
  },
  tabColumn: {
    justifyContent: 'space-between',
    width: '100%'
  },
  iconStack: {
    alignItems: 'center',
    width: '100%'
  },
  fabOuter: {
    alignItems: 'center',
    borderRadius: 9999,
    justifyContent: 'center'
  },
  fabInner: {
    alignItems: 'center',
    borderRadius: 9999,
    justifyContent: 'center'
  }
});
