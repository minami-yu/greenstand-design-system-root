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

export type RadioButtonProps = {
  selected: boolean;
  onPress: () => void;
  label?: string;
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: ViewStyle;
};

/**
 * Single radio control. Parent should own `selected` / `onPress` (one selected per group).
 * Wrap options in `RadioGroup` for screen reader grouping.
 *
 * **Figma** (`radio button new`, node `12541:58199`): `RadioButton` component set uses
 * **selected** (true|false) × **state** (Default | Hovered | Focused | Disabled).
 * In code, `disabled` matches state=Disabled; pointer hover → Hovered halo; keyboard focus → Focused halo
 * (stronger neutral halo when unselected); press on touch uses the same halo as hover.
 *
 * Layout: gap `size/space/200`, min height `size/space/600` (24), control `size/icon/md` (20),
 * stroke `size/stroke/md`. Label: typography **label-m** (`labelM`, medium 500).
 */
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

  const outer = size.sizeIconMd;
  const borderW = size.sizeStrokeMd;
  /** Figma selected variant uses a 10px dot inside the 20px ring (50% of outer). */
  const innerDot = outer / 2;
  /** Halo diameter aligned with Figma hover/focus artwork (20px dot + 4px). */
  const haloSize = outer + size.sizeSpace100;

  const borderColor = disabled
    ? colors.colorBorderBaseDisabled
    : selected
      ? colors.colorBorderBrandDefault
      : colors.colorBorderBaseStrong;

  const fillColor = disabled ? colors.colorIconBaseDisabled : colors.colorBackgroundBrandDefault;

  const labelToken = theme.typography.mobile.labelM;
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

        return (
          <View
            style={[
              styles.row,
              {
                gap: size.sizeSpace200,
                minHeight: size.sizeSpace600
              },
              style
            ]}
          >
            <View
              style={{
                alignItems: 'center',
                height: haloSize,
                justifyContent: 'center',
                width: haloSize
              }}
            >
              {haloColor != null ? (
                <View
                  style={{
                    backgroundColor: haloColor,
                    borderRadius: haloSize / 2,
                    height: haloSize,
                    position: 'absolute',
                    width: haloSize
                  }}
                />
              ) : null}
              <View
                style={[
                  styles.circle,
                  {
                    borderColor,
                    borderRadius: outer / 2,
                    borderWidth: borderW,
                    height: outer,
                    width: outer
                  }
                ]}
              >
                {selected ? (
                  <View
                    style={{
                      backgroundColor: fillColor,
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
  /** Announces the group purpose to assistive tech */
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
  circle: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row'
  }
});
