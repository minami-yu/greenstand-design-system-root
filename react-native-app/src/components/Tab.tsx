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
import { readHovered } from './buttonInteractionColors';
import {
  resolveTabColors,
  resolveTabInteraction,
  type TabElementState,
  tabStateToInteraction
} from './tabInteractionColors';

export type { TabElementState };
export { tabStateToInteraction };

export type TabProps = {
  /** When true, tab uses brand text and primary indicator (`colorBorderBrandDefault`). */
  active: boolean;
  onPress: () => void;
  children?: ReactNode;
  disabled?: boolean;
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
 * Single tab trigger. **Active** (true|false) × **state** (Default | Hovered | Pressed) matches Figma:
 * hover/press come from `Pressable`; use `tabStateToInteraction` if you need the resolver from a fixed state.
 *
 * Tokens: `colorTextBrandDefault` / `colorTextBaseSecondary`, `colorBorderBrandDefault`, `colorBackgroundBrandSubtle`,
 * `colorBackgroundBaseSubtle`, `sizeSpace*` padding, `sizeStrokeMd` indicator, typography **labelMStrong**.
 */
export function Tab({
  active,
  onPress,
  children,
  disabled,
  accessibilityLabel,
  style
}: TabProps) {
  const { theme } = useTheme();
  const { colors, size } = theme;
  const labelTypography = getTypographyStyle(theme.typography.mobile.labelMStrong);

  const a11yLabel =
    accessibilityLabel ?? (typeof children === 'string' ? children : undefined);

  return (
    <Pressable
      accessibilityLabel={a11yLabel}
      accessibilityRole="tab"
      accessibilityState={{ selected: active, disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={style}
    >
      {(state) => {
        const hovered = readHovered(state);
        const interaction = disabled
          ? 'default'
          : resolveTabInteraction(state.pressed, hovered);
        const { text, indicator, background } = disabled
          ? {
              text: colors.colorTextBaseDisabled,
              indicator: 'transparent',
              background: 'transparent'
            }
          : resolveTabColors(colors, active, interaction);

        return (
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
        );
      }}
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
