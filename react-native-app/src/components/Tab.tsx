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
  /** When true, tab uses brand text and `sizeStrokeMd` bottom border (`colorBorderBrandDefault`). */
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
   * (Figma tab bar).
   */
  fullWidth?: boolean;
  /** Full-width 1px line below the tab row (`colorBorderBaseDivider`). */
  showDivider?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Single tab trigger. Matches Figma Tab: **labelL** (16 / medium), inactive `colorTextBaseTertiary`,
 * active `colorTextBrandDefault` + `sizeStrokeMd` bottom border; row height `sizeSpace1200` (48).
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
  const labelTypography = getTypographyStyle(theme.typography.mobile.labelL);

  const a11yLabel =
    accessibilityLabel ?? (typeof children === 'string' ? children : undefined);

  const { text, borderBottom, background } = resolveTabColors(colors, active);

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
            borderBottomColor: borderBottom,
            borderBottomWidth: size.sizeStrokeMd,
            minHeight: size.sizeSpace1200,
            paddingHorizontal: size.sizeSpace300,
            paddingVertical: size.sizeSpace300
          }
        ]}
      >
        {children != null ? (
          <Text numberOfLines={1} style={[labelTypography, { color: text }]}>
            {children}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

/**
 * Groups `Tab` children. Figma: 48px tab row + optional 1px `colorBorderBaseDivider` line below the row.
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
      <View style={styles.column}>
        <View style={[styles.row, { minHeight: size.sizeSpace1200 }]}>{mapped}</View>
        {showDivider ? (
          <View
            style={[
              styles.divider,
              {
                backgroundColor: colors.colorBorderBaseDivider,
                height: size.sizeStrokeSm
              }
            ]}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    width: '100%'
  },
  divider: {
    width: '100%'
  },
  row: {
    alignItems: 'stretch',
    flexDirection: 'row',
    width: '100%'
  },
  tabFlex: {
    flex: 1,
    minWidth: 0
  },
  tabInner: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
    width: '100%'
  }
});
