import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useTheme } from '../theme';
import { themeDark } from '../theme/theme-dark';
import { themeLight } from '../theme/theme-light';
import { getTypographyStyle } from '../theme/typography';
import type { IconName } from './Icon';
import { Icon } from './Icon';

type TokenColors = typeof themeLight.colors | typeof themeDark.colors;

/** Figma `Textfield` component set (frame 13115:7910, page Input 13115:7873). */
export type TextFieldSize = 'medium' | 'large';

export type TextFieldFieldStyle = 'outline' | 'filled';

export type TextFieldStatus = 'default' | 'error' | 'success' | 'incomplete';

export type TextFieldProps = {
  label: string;
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
  showLabel?: boolean;
  /** Figma `size`. */
  size?: TextFieldSize;
  /** Figma `style` (outline | filled). Named `fieldStyle` to avoid clashing with RN `style`. */
  fieldStyle?: TextFieldFieldStyle;
  /** Figma validation-style `state` when not focused/disabled (error | success | incomplete). */
  status?: TextFieldStatus;
  disabled?: boolean;
  showHint?: boolean;
  hint?: string;
  /** Figma `showLeadingIcon`; default icon in Figma is search (`magnify`). */
  leadingIcon?: IconName | null;
  /** Clear (close) control: focused with text, or error/success states in Figma. */
  showClearButton?: boolean;
  onClearPress?: () => void;
};

function fieldHeight(size: TextFieldSize, tokens: { sm: number; lg: number }): number {
  return size === 'large' ? tokens.lg : tokens.sm;
}

type Appearance = {
  fieldBg: string;
  borderW: number;
  borderColor: string;
  labelColor: string;
  inputColor: string;
  placeholderColor: string;
  leadingIconColor: string;
  hintVariant: 'muted' | 'error' | 'success' | 'disabled';
  showClear: boolean;
  showIncompleteInfo: boolean;
};

function resolveAppearance(
  colors: TokenColors,
  opts: {
    disabled: boolean;
    focused: boolean;
    status: TextFieldStatus;
    fieldStyle: TextFieldFieldStyle;
    hasValue: boolean;
    showClearButton: boolean;
  }
): Appearance {
  const { disabled, focused, status, fieldStyle, hasValue, showClearButton } = opts;

  const outlineBg = 'transparent';
  const filledDefaultBg = colors.colorFillNeutralSubtle;
  const filledDisabledBg = colors.colorFillNeutralSubtleDisabled;

  if (disabled) {
    return {
      fieldBg: fieldStyle === 'filled' ? filledDisabledBg : outlineBg,
      borderW: fieldStyle === 'outline' ? 1 : 0,
      borderColor: colors.colorBorderBaseDisabled,
      labelColor: colors.colorTextBaseDisabled,
      inputColor: colors.colorTextBaseDisabled,
      placeholderColor: colors.colorTextBaseDisabled,
      leadingIconColor: colors.colorTextBaseDisabled,
      hintVariant: 'disabled',
      showClear: false,
      showIncompleteInfo: false
    };
  }

  if (status === 'error') {
    return {
      fieldBg: fieldStyle === 'filled' ? colors.colorFillErrorSubtle : outlineBg,
      borderW: 2,
      borderColor: colors.colorBorderErrorEmphasis,
      labelColor: colors.colorTextBasePrimary,
      inputColor: colors.colorTextBasePrimary,
      placeholderColor: colors.colorTextBasePlaceholder,
      leadingIconColor: colors.colorIconBasePrimary,
      hintVariant: 'error',
      showClear: showClearButton,
      showIncompleteInfo: false
    };
  }

  if (status === 'success') {
    return {
      fieldBg: fieldStyle === 'filled' ? colors.colorFillSuccessSubtle : outlineBg,
      borderW: 2,
      borderColor: colors.colorBorderSuccessEmphasis,
      labelColor: colors.colorTextBasePrimary,
      inputColor: colors.colorTextBasePrimary,
      placeholderColor: colors.colorTextBasePlaceholder,
      leadingIconColor: colors.colorIconBasePrimary,
      hintVariant: 'success',
      showClear: showClearButton,
      showIncompleteInfo: false
    };
  }

  if (status === 'incomplete') {
    return {
      fieldBg: fieldStyle === 'filled' ? filledDefaultBg : outlineBg,
      borderW: 1,
      borderColor: colors.colorBorderBaseDefault,
      labelColor: colors.colorTextBasePrimary,
      inputColor: colors.colorTextBasePrimary,
      placeholderColor: colors.colorTextBasePlaceholder,
      leadingIconColor: colors.colorIconBasePrimary,
      hintVariant: 'muted',
      showClear: false,
      showIncompleteInfo: true
    };
  }

  if (focused) {
    return {
      fieldBg: fieldStyle === 'filled' ? filledDefaultBg : outlineBg,
      borderW: 2,
      borderColor: colors.colorBorderBaseStrong,
      labelColor: colors.colorTextBasePrimary,
      inputColor: colors.colorTextBasePrimary,
      placeholderColor: colors.colorTextBasePlaceholder,
      leadingIconColor: colors.colorIconBasePrimary,
      hintVariant: 'muted',
      showClear: showClearButton && hasValue,
      showIncompleteInfo: false
    };
  }

  return {
    fieldBg: fieldStyle === 'filled' ? filledDefaultBg : outlineBg,
    borderW: fieldStyle === 'outline' ? 1 : 0,
    borderColor: colors.colorBorderBaseDefault,
    labelColor: colors.colorTextBasePrimary,
    inputColor: colors.colorTextBasePrimary,
    placeholderColor: colors.colorTextBasePlaceholder,
    leadingIconColor: colors.colorIconBasePrimary,
    hintVariant: 'muted',
    showClear: false,
    showIncompleteInfo: false
  };
}

export function TextField({
  label,
  placeholder,
  value = '',
  onChangeText,
  showLabel = true,
  size = 'medium',
  fieldStyle = 'outline',
  status = 'default',
  disabled = false,
  showHint = false,
  hint = '',
  leadingIcon = null,
  showClearButton = true,
  onClearPress
}: TextFieldProps) {
  const { theme } = useTheme();
  const { colors, size: sz } = theme;
  const typo = theme.typography.mobile;

  const [focused, setFocused] = useState(false);

  const labelTypo = size === 'large' ? typo.labelLStrong : typo.labelMStrong;
  const labelStyle = getTypographyStyle(labelTypo);
  const inputStyle = getTypographyStyle(typo.paragraphL);
  const hintStyle = getTypographyStyle(typo.paragraphM);

  const h = fieldHeight(size, { sm: sz.sizeSpace1200, lg: sz.sizeSpace1600 });
  const hasValue = value.length > 0;
  const appearance = resolveAppearance(colors, {
    disabled: Boolean(disabled),
    focused,
    status,
    fieldStyle,
    hasValue,
    showClearButton
  });

  const showLeading = leadingIcon != null;
  const stroke = appearance.borderW === 2 ? sz.sizeStrokeMd : appearance.borderW === 1 ? sz.sizeStrokeSm : 0;

  const hintTextColor =
    appearance.hintVariant === 'error'
      ? colors.colorTextErrorDefault
      : appearance.hintVariant === 'success'
        ? colors.colorTextSuccessDefault
        : appearance.hintVariant === 'disabled'
          ? colors.colorTextBaseDisabled
          : colors.colorTextBaseSecondary;

  const onClear = () => {
    onChangeText?.('');
    onClearPress?.();
  };

  return (
    <View style={[styles.column, { gap: sz.sizeSpace200, width: '100%' }]}>
      {showLabel ? (
        <Text
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={[labelStyle, { color: appearance.labelColor }]}
        >
          {label}
        </Text>
      ) : null}

      <View
        style={[
          styles.field,
          {
            backgroundColor: appearance.fieldBg,
            borderColor: appearance.borderColor,
            borderRadius: sz.sizeRadiusSm,
            borderWidth: stroke,
            height: h,
            paddingHorizontal: sz.sizeSpace400
          }
        ]}
      >
        {showLeading ? (
          <View style={[styles.iconSlot, { marginRight: sz.sizeSpace200 }]}>
            <Icon
              name={leadingIcon}
              size={sz.sizeIconLg}
              color={appearance.leadingIconColor}
              accessible={false}
            />
          </View>
        ) : null}

        <TextInput
          accessibilityLabel={label}
          editable={!disabled}
          onBlur={() => setFocused(false)}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          placeholder={placeholder}
          placeholderTextColor={appearance.placeholderColor}
          value={value}
          style={[
            inputStyle,
            {
              color: appearance.inputColor,
              flex: 1,
              paddingVertical: 0,
              ...Platform.select({
                android: { textAlignVertical: 'center' as const }
              })
            }
          ]}
        />

        {appearance.showIncompleteInfo ? (
          <View
            style={[styles.trailingSlot, { marginLeft: sz.sizeSpace200 }]}
            accessibilityElementsHidden
          >
            <Icon
              name="information"
              size={sz.sizeIconLg}
              color={colors.colorIconBaseSecondary}
              accessible={false}
            />
          </View>
        ) : null}

        {appearance.showClear ? (
          <Pressable
            accessibilityLabel="Clear text"
            accessibilityRole="button"
            hitSlop={sz.sizeSpace200}
            onPress={onClear}
            style={[styles.trailingSlot, { marginLeft: sz.sizeSpace200 }]}
          >
            <Icon name="close" size={sz.sizeIconLg} color={appearance.leadingIconColor} accessible={false} />
          </Pressable>
        ) : null}
      </View>

      {showHint && hint.length > 0 ? (
        <View style={[styles.hintRow, { gap: sz.sizeSpace100 }]}>
          {appearance.hintVariant === 'error' ? (
            <Icon name="information" size={sz.sizeIconMd} color={colors.colorTextErrorDefault} accessible={false} />
          ) : null}
          {appearance.hintVariant === 'success' ? (
            <Icon name="checked" size={sz.sizeIconMd} color={colors.colorTextSuccessDefault} accessible={false} />
          ) : null}
          <Text style={[hintStyle, { color: hintTextColor, flex: 1 }]}>{hint}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    alignItems: 'flex-start'
  },
  field: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%'
  },
  iconSlot: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center'
  },
  trailingSlot: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
    minWidth: 40
  },
  hintRow: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%'
  }
});
