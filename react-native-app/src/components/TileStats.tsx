import type { ReactNode } from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { Icon } from './Icon';
import { useTheme } from '../theme';
import { getTypographyStyle } from '../theme/typography';

export type TileStatsProps = {
  style?: ViewStyle;
  /**
   * Leading glyph. Omit for Figma default (`mdi:pine-tree-variant-outline` → `Icon` `tree`).
   * Pass `null` to hide the icon.
   */
  icon?: ReactNode | null;
  label?: string;
  number?: string;
  showUnit?: boolean;
  unit?: string;
};

/**
 * Figma `Tile` / `TileStats` (12942:27465 / 12942:28028): neutral surface, `radius/sm`, `space/400` padding;
 * label row `label-m` + `text/base/secondary`; value `numeric-m` + `text/base/primary`; unit `label-s` + `text/base/tertiary`.
 */
export function TileStats({
  style,
  icon,
  label = 'Label',
  number = '10',
  showUnit = true,
  unit = 'unit'
}: TileStatsProps) {
  const { theme } = useTheme();
  const { colors, size } = theme;
  const typo = theme.typography.mobile;

  const labelStyle = getTypographyStyle(typo.labelM);
  const numericStyle = getTypographyStyle(typo.numericM);
  const unitStyle = getTypographyStyle(typo.labelS);

  const leading =
    icon === null
      ? null
      : icon !== undefined
        ? icon
        : (
            <Icon
              name="tree"
              size={size.sizeIconSm}
              color={colors.colorIconBaseSecondary}
              accessible={false}
            />
          );

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: colors.colorBackgroundNeturalSurface,
          borderRadius: size.sizeRadiusSm,
          gap: size.sizeSpace200,
          minWidth: 160,
          padding: size.sizeSpace400
        },
        style
      ]}
    >
      <View style={[styles.labelRow, { gap: size.sizeSpace100 }]}>
        {leading}
        <Text style={[labelStyle, styles.labelText, { color: colors.colorTextBaseSecondary }]} numberOfLines={1}>
          {label}
        </Text>
      </View>
      <View style={[styles.dataRow, { gap: size.sizeSpace100 }]}>
        <Text style={[numericStyle, { color: colors.colorTextBasePrimary }]} numberOfLines={1}>
          {number}
        </Text>
        {showUnit ? (
          <View style={{ paddingVertical: size.sizeSpace100 }}>
            <Text style={[unitStyle, { color: colors.colorTextBaseTertiary }]} numberOfLines={1}>
              {unit}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignSelf: 'flex-start'
  },
  labelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%'
  },
  labelText: {
    flex: 1,
    minWidth: 0
  },
  dataRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    width: '100%'
  }
});
