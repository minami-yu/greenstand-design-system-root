import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme';
import { getTypographyStyle } from '../theme/typography';

export type TabItemConfig = {
  key: string;
  label: string;
  disabled?: boolean;
};

export type TabBarProps = {
  tabs: TabItemConfig[];
  selectedKey: string;
  onSelect: (key: string) => void;
};

const TAB_HEIGHT = 48;

/**
 * Figma `Tab` (12736:8196) + wallet `Capture-Select User` tab row (13067:11184): equal-width items,
 * `label-l-strong`, selected = text/brand + 2px brand underline; unselected = text/base/secondary + reserved 2px;
 * full-width `border/base/subtle` rule under the bar (`size/stroke/sm`).
 */
export function TabBar({ tabs, selectedKey, onSelect }: TabBarProps) {
  const { theme } = useTheme();
  const { colors, size } = theme;
  const typo = theme.typography.mobile;
  const labelStyle = getTypographyStyle(typo.labelLStrong);

  return (
    <View
      style={[
        styles.row,
        {
          borderBottomColor: colors.colorBorderBaseSubtle,
          borderBottomWidth: size.sizeStrokeSm
        }
      ]}
    >
      {tabs.map((tab) => {
        const selected = tab.key === selectedKey;
        const disabled = Boolean(tab.disabled);
        const textColor = disabled
          ? colors.colorTextBaseDisabled
          : selected
            ? colors.colorTextBrandDefault
            : colors.colorTextBaseSecondary;
        const barColor = disabled
          ? selected
            ? colors.colorBorderBaseDisabled
            : 'transparent'
          : selected
            ? colors.colorBorderBrandDefault
            : 'transparent';

        return (
          <Pressable
            key={tab.key}
            accessibilityRole="tab"
            accessibilityState={{ selected, disabled }}
            disabled={disabled}
            onPress={() => onSelect(tab.key)}
            style={({ pressed }) => [styles.tab, { flex: 1, opacity: pressed && !disabled ? 0.85 : 1 }]}
          >
            <View style={[styles.tabInner, { height: TAB_HEIGHT }]}>
              <View style={styles.labelWrap}>
                <Text style={[labelStyle, { color: textColor, textAlign: 'center' }]}>{tab.label}</Text>
              </View>
              <View
                style={{
                  backgroundColor: barColor,
                  height: size.sizeStrokeMd,
                  width: '100%'
                }}
              />
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'stretch',
    flexDirection: 'row',
    width: '100%'
  },
  tab: {
    minWidth: 0
  },
  tabInner: {
    justifyContent: 'space-between',
    width: '100%'
  },
  labelWrap: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    width: '100%'
  }
});
