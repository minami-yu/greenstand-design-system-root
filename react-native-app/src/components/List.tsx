import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import { getTypographyStyle } from '../theme/typography';
import { Icon } from './Icon';

const LEAD_W = 64;
const TRAIL_W = 64;

export type ListProps = {
  children: ReactNode;
  style?: ViewStyle;
};

/**
 * Figma `List` container (13149:4221): surface background, `radius/sm`, vertical slot stack.
 */
export function List({ children, style }: ListProps) {
  const { theme } = useTheme();
  const { colors, size } = theme;

  return (
    <View
      style={[
        styles.list,
        {
          backgroundColor: colors.colorBackgroundNeturalSurface,
          borderRadius: size.sizeRadiusSm
        },
        style
      ]}
    >
      {children}
    </View>
  );
}

export function ListDivider() {
  const { theme } = useTheme();
  const { colors, size } = theme;

  return (
    <View style={[styles.divider, { backgroundColor: colors.colorBorderBaseSubtle, height: size.sizeStrokeSm }]} />
  );
}

export type ListItemTrailingTone = 'default' | 'success' | 'error' | 'secondary';

export type ListItemSubtitleVariant = 'paragraphM' | 'paragraphS';

export type ListItemProps = {
  title: string;
  subtitle?: string;
  /**
   * Figma `WalletApp-Home` list (13133:13113): `paragraph-m`; activity lists (13067:11184) often `paragraph-s`.
   * @default 'paragraphM'
   */
  subtitleVariant?: ListItemSubtitleVariant;
  leading?: ReactNode;
  /** Right-aligned value (e.g. +300). Figma: `label-l` medium, `text/base/primary` when `trailingTone` is default. */
  trailingText?: string;
  trailingTone?: ListItemTrailingTone;
  showChevron?: boolean;
  /** Figma `layout=checkInput`: 24px success check in the control column (not with `showChevron`). */
  showCheck?: boolean;
  showDivider?: boolean;
  onPress?: () => void;
};

/**
 * Figma `ListItem` (13149:4221): `Content Frame` `items-start` `justify-between`; `Artwork` 64×64;
 * `contentSlot`: `space/100` gap, `pt`/`pb`/`px` `space/300`/`400`/`100`; title `label-l-strong`; subtitle `paragraph-m` or `paragraph-s` via `subtitleVariant` (13133:13113 / 13067:11184);
 * value control: `label-l` medium, `text/base/primary` (default tone); chevron/check: `px` 20, `py` 21, 24px icon.
 */
export function ListItem({
  title,
  subtitle,
  subtitleVariant = 'paragraphM',
  leading,
  trailingText,
  trailingTone = 'default',
  showChevron = false,
  showCheck = false,
  showDivider = true,
  onPress
}: ListItemProps) {
  const { theme } = useTheme();
  const { colors, size } = theme;
  const typo = theme.typography.mobile;
  const titleStyle = getTypographyStyle(typo.labelLStrong);
  const subStyle = getTypographyStyle(subtitleVariant === 'paragraphS' ? typo.paragraphS : typo.paragraphM);
  const trailTypo = getTypographyStyle(typo.labelL);

  const trailColor =
    trailingTone === 'success'
      ? colors.colorTextSuccessDefault
      : trailingTone === 'error'
        ? colors.colorTextErrorDefault
        : trailingTone === 'secondary'
          ? colors.colorTextBaseSecondary
          : colors.colorTextBasePrimary;

  const hasValue = Boolean(trailingText);
  const iconTrailOnly = (showChevron || showCheck) && !hasValue;
  const valueAndChevron = hasValue && showChevron;
  const chevronPadH = size.sizeSpace400 + size.sizeSpace100;
  const showTrail = hasValue || showChevron || showCheck;

  const a11yLabel = [title, subtitle].filter(Boolean).join(', ');

  const trailColumnStyle: ViewStyle[] = [styles.trail];
  if (iconTrailOnly) {
    trailColumnStyle.push({
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: chevronPadH,
      paddingVertical: 21,
      width: TRAIL_W
    });
  } else if (valueAndChevron) {
    trailColumnStyle.push({
      alignItems: 'flex-end',
      flexDirection: 'column',
      gap: size.sizeSpace100,
      paddingRight: size.sizeSpace400,
      paddingTop: size.sizeSpace300,
      width: TRAIL_W
    });
  } else if (hasValue) {
    trailColumnStyle.push({
      alignItems: 'flex-start',
      paddingRight: size.sizeSpace400,
      paddingTop: size.sizeSpace300,
      width: TRAIL_W
    });
  }

  const body = (
    <View style={styles.row}>
      <View style={[styles.leadFrame, { width: LEAD_W }]}>
        <View style={styles.artworkCell}>{leading}</View>
      </View>
      <View
        style={[
          styles.content,
          {
            flex: 1,
            gap: size.sizeSpace100,
            minWidth: 0,
            paddingBottom: size.sizeSpace400,
            paddingHorizontal: size.sizeSpace100,
            paddingTop: size.sizeSpace300
          }
        ]}
      >
        <Text style={[titleStyle, { color: colors.colorTextBasePrimary }]}>{title}</Text>
        {subtitle ? (
          <Text style={[subStyle, { color: colors.colorTextBaseSecondary }]}>{subtitle}</Text>
        ) : null}
      </View>
      {showTrail ? (
        <View style={trailColumnStyle}>
          {trailingText ? (
            <Text style={[trailTypo, { color: trailColor, textAlign: 'right', width: '100%' }]}>
              {trailingText}
            </Text>
          ) : null}
          {showCheck ? (
            <Icon
              name="check-circle"
              size={size.sizeIconLg}
              color={colors.colorIconSuccessDefault}
              accessibilityLabel="Selected"
            />
          ) : showChevron ? (
            <Icon name="chevron-right" size={size.sizeIconLg} color={colors.colorIconBaseSecondary} accessible={false} />
          ) : null}
        </View>
      ) : null}
    </View>
  );

  const wrapped =
    onPress != null ? (
      <Pressable
        accessibilityLabel={a11yLabel}
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [{ opacity: pressed ? 0.92 : 1 }]}
      >
        {body}
      </Pressable>
    ) : (
      body
    );

  return (
    <View style={styles.itemWrap} accessibilityLabel={onPress == null ? a11yLabel : undefined}>
      {wrapped}
      {showDivider ? <ListDivider /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    alignSelf: 'stretch',
    overflow: 'hidden',
    width: '100%'
  },
  itemWrap: {
    alignSelf: 'stretch',
    width: '100%'
  },
  /** Figma `Content Frame`: `items-start` `justify-between`. */
  row: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  leadFrame: {
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  artworkCell: {
    alignItems: 'center',
    height: 64,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 64
  },
  content: {
    justifyContent: 'center'
  },
  trail: {
    alignSelf: 'stretch'
  },
  divider: {
    width: '100%'
  }
});
