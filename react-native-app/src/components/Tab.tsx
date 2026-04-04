import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle
} from 'react-native';
import { useTheme } from '../theme';
import { getTypographyStyle } from '../theme/typography';
import { resolveTabColors } from './tabInteractionColors';

export type TabProps = {
  /** When true, tab uses brand text and primary indicator (`colorBorderBrandDefault`). */
  active: boolean;
  onPress: () => void;
  children?: ReactNode;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

export type TabGroupProps = {
  children: ReactNode;
  /**
   * When true (default), each direct `Tab` child gets `flex: 1` so the row spans full width
   * (typical mobile segmented control).
   */
  fullWidth?: boolean;
  /** Baseline under the tab row from `colorBorderBaseDivider` + `sizeStrokeSm`. */
  showDivider?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Single tab trigger. **Active** selects brand text and primary indicator.
 *
 * Tokens: `colorTextBrandDefault` / `colorTextBaseSecondary`, `colorBorderBrandDefault`, `sizeSpace*` padding,
 * `sizeStrokeMd` indicator, typography **labelMStrong**.
 */
export function Tab({
  active,
  onPress,
  children,
  accessibilityLabel,
  style
}: TabProps) {
  const { theme } = useTheme();
  const { colors, size } = theme;
  const labelTypography = getTypographyStyle(theme.typography.mobile.labelMStrong);

  const a11yLabel =
    accessibilityLabel ?? (typeof children === 'string' ? children : undefined);

  const { text, indicator, background } = resolveTabColors(colors, active);

  return (
    <Pressable
      accessibilityLabel={a11yLabel}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={style}
    >
      <View
        style={[
          styles.tabInner,
          {
            backgroundColor: background,
            borderRadius: size.sizeRadiusXs,
            minHeight: size.sizeSpace1200,
            paddingBottom: size.sizeSpace300 + size.sizeStrokeMd,
            paddingHorizontal: size.sizeSpace300,
            paddingTop: size.sizeSpace300
          }
        ]}
      >
        {children != null ? (
          <Text numberOfLines={1} style={[labelTypography, { color: text }]}>
            {children}
          </Text>
        ) : null}
        <View
          style={[
            styles.indicator,
            {
              backgroundColor: indicator,
              borderRadius: size.sizeRadiusNone,
              bottom: -size.sizeStrokeSm,
              height: size.sizeStrokeMd
            }
          ]}
        />
      </View>
    </Pressable>
  );
}

/**
 * Groups `Tab` children with optional full-width layout and a shared bottom divider.
 */
export function TabGroup({
  children,
  fullWidth = true,
  showDivider = true,
  accessibilityLabel,
  style
}: TabGroupProps) {
  const { theme } = useTheme();
  const { colors, size } = theme;

  const mapped = Children.map(children, (child) => {
    if (!isValidElement(child)) return child;
    if (fullWidth) {
      return cloneElement(child as ReactElement<TabProps>, {
        style: [styles.tabFlex, (child as ReactElement<TabProps>).props.style]
      });
    }
    return child;
  });

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="tablist"
      style={style}
    >
      <View
        style={[
          styles.row,
          showDivider && {
            borderBottomColor: colors.colorBorderBaseDivider,
            borderBottomWidth: size.sizeStrokeSm
          }
        ]}
      >
        {mapped}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  indicator: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0
  },
  row: {
    flexDirection: 'row',
    width: '100%'
  },
  tabFlex: {
    flex: 1,
    minWidth: 0
  },
  tabInner: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  }
});
