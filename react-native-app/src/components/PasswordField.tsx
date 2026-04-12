import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useTheme } from '../theme';
import { getTypographyStyle } from '../theme/typography';
import { Icon } from './Icon';

export type PasswordFieldProps = {
  label?: string;
  placeholder?: string;
  hint?: string;
  showHint?: boolean;
  showLabel?: boolean;
  value?: string;
  onChangeText?: (text: string) => void;
};

/**
 * Figma `PasswordField` (13132:12730): outline medium, trailing visibility icon, optional hint (paragraph-m secondary).
 */
export function PasswordField({
  label = 'Label',
  placeholder = 'Placeholder',
  hint = 'Hint',
  showHint = true,
  showLabel = true,
  value,
  onChangeText
}: PasswordFieldProps) {
  const { theme } = useTheme();
  const { colors, size } = theme;
  const typo = theme.typography.mobile;
  const [hidden, setHidden] = useState(true);

  const labelStyle = getTypographyStyle(typo.labelMStrong);
  const inputStyle = getTypographyStyle(typo.paragraphL);
  const hintStyle = getTypographyStyle(typo.paragraphM);

  return (
    <View style={[styles.column, { gap: size.sizeSpace200, width: '100%' }]}>
      {showLabel ? (
        <Text
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={[labelStyle, { color: colors.colorTextBasePrimary }]}
        >
          {label}
        </Text>
      ) : null}
      <View
        style={[
          styles.field,
          {
            borderColor: colors.colorBorderBaseDefault,
            borderRadius: size.sizeRadiusSm,
            borderWidth: size.sizeStrokeSm,
            height: size.sizeSpace1200,
            paddingLeft: size.sizeSpace400,
            paddingRight: size.sizeSpace400
          }
        ]}
      >
        <TextInput
          accessibilityLabel={label}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.colorTextBasePlaceholder}
          secureTextEntry={hidden}
          style={[
            inputStyle,
            {
              color: colors.colorTextBasePrimary,
              flex: 1,
              paddingRight: size.sizeSpace400,
              paddingVertical: 0,
              ...Platform.select({
                android: { textAlignVertical: 'center' as const }
              })
            }
          ]}
        />
        <Pressable
          onPress={() => setHidden((v) => !v)}
          accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
          hitSlop={8}
        >
          <Icon
            name={hidden ? 'eye-off' : 'eye'}
            size={size.sizeIconLg}
            color={colors.colorIconBaseSecondary}
            accessible={false}
          />
        </Pressable>
      </View>
      {showHint ? (
        <Text style={[hintStyle, { color: colors.colorTextBaseSecondary }]}>{hint}</Text>
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
  }
});
