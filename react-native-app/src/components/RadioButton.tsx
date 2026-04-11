import { type ReactNode, useState } from 'react';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import { getTypographyStyle } from '../theme/typography';

function readHovered(state: { pressed: boolean; hovered?: boolean }): boolean {
  return Boolean(state.hovered);
}

type VisualState = 'default' | 'hover' | 'focus';

function resolveVisualState(
  disabled: boolean,
  focused: boolean,
  pressed: boolean,
  hovered: boolean
): VisualState {
  if (disabled) return 'default';
  if (focused) return 'focus';
  if (hovered) return 'hover';
  if (pressed) return 'hover';
  return 'default';
}

function resolveHaloColor(
  colors: ReturnType<typeof useTheme>['theme']['colors'],
  selected: boolean,
  visual: VisualState
): string | null {
  if (visual === 'default') return null;
  if (selected) return colors.colorBackgroundBrandSubtle;
  return visual === 'focus' ? colors.colorBackgroundBaseContainer : colors.colorBackgroundBaseSubtle;
}

/**
 * Figma `radio button new` (12541:58199): 48×48 hit area, 24×24 artwork, label-l.
 * — Selected default: solid brand fill + small **white** center dot (not a ring).
 * — Unselected: thin neutral stroke, transparent fill.
 * — Hover/focus: brand or neutral halo fills the 48px circle behind the artwork.
 * — Disabled: muted fill/stroke per semantic tokens; selected keeps a visible inner dot.
 */
function radioMetrics(size: ReturnType<typeof useTheme>['theme']['size']) {
  const touchTarget = size.sizeSpace1200;
  const diameter = size.sizeIconLg;
  /** Inner dot ≈ Figma artwork (smaller than 50% of diameter). */
  const innerDot = 8;
  const unselectedStroke = size.sizeStrokeMd;
  return { touchTarget, diameter, innerDot, unselectedStroke };
}

export type RadioButtonProps = {
  selected: boolean;
  onPress: () => void;
  label?: string;
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: ViewStyle;
};

export function RadioButton({
  selected,
  onPress,
  label,
  disabled,
  accessibilityLabel,
  style
}: RadioButtonProps) {
  const { theme } = useTheme();
  const { size, colors } = theme;
  const [focused, setFocused] = useState(false);

  const { touchTarget, diameter, innerDot, unselectedStroke } = radioMetrics(size);
  const labelToken = theme.typography.mobile.labelL;
  const textColor = disabled ? colors.colorTextBaseDisabled : colors.colorTextBasePrimary;
  const a11yLabel = accessibilityLabel ?? label;

  return (
    <Pressable
      accessibilityLabel={a11yLabel}
      accessibilityRole="radio"
      accessibilityState={{ selected, disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{ alignSelf: 'flex-start' }}
    >
      {(state) => {
        const hovered = readHovered(state);
        const visual = resolveVisualState(!!disabled, focused, state.pressed, hovered);
        const haloColor = resolveHaloColor(colors, selected, visual);

        const selectedFill = disabled
          ? colors.colorBackgroundBrandDisabled
          : colors.colorBackgroundBrandDefault;

        const selectedInnerDot = disabled ? colors.colorIconBaseSubtle : colors.colorBaseWhite;

        const unselectedBorder = disabled
          ? colors.colorBorderBaseDisabled
          : colors.colorBorderBaseStrong;

        return (
          <View
            style={[
              styles.row,
              {
                gap: size.sizeSpace0,
                minHeight: touchTarget
              },
              style
            ]}
          >
            <View style={[styles.hit, { height: touchTarget, width: touchTarget }]}>
              {haloColor != null ? (
                <View
                  style={[
                    styles.halo,
                    {
                      backgroundColor: haloColor,
                      borderRadius: touchTarget / 2,
                      height: touchTarget,
                      width: touchTarget
                    }
                  ]}
                />
              ) : null}
              <View
                style={[
                  styles.disc,
                  selected
                    ? {
                        backgroundColor: selectedFill,
                        borderColor: selectedFill,
                        borderRadius: diameter / 2,
                        borderWidth: 0,
                        height: diameter,
                        width: diameter
                      }
                    : {
                        backgroundColor: 'transparent',
                        borderColor: unselectedBorder,
                        borderRadius: diameter / 2,
                        borderWidth: unselectedStroke,
                        height: diameter,
                        width: diameter
                      }
                ]}
              >
                {selected ? (
                  <View
                    style={{
                      backgroundColor: selectedInnerDot,
                      borderRadius: innerDot / 2,
                      height: innerDot,
                      width: innerDot
                    }}
                  />
                ) : null}
              </View>
            </View>
            {label ? (
              <Text style={[getTypographyStyle(labelToken), { color: textColor, flex: 1 }]}>{label}</Text>
            ) : null}
          </View>
        );
      }}
    </Pressable>
  );
}

export type RadioGroupProps = {
  children: ReactNode;
  accessibilityLabel?: string;
  style?: ViewStyle;
};

export function RadioGroup({ children, accessibilityLabel, style }: RadioGroupProps) {
  return (
    <View accessibilityLabel={accessibilityLabel} accessibilityRole="radiogroup" style={style}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  disc: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  halo: {
    position: 'absolute'
  },
  hit: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row'
  }
});
