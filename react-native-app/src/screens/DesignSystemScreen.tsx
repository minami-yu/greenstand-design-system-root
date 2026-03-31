import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { TokenCard } from '../components/TokenCard';
import { resolveFontFamily, useTheme } from '../theme';

function getShadowStyle() {
  return {
    elevation: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 12
  } as const;
}

export function DesignSystemScreen() {
  const { isDark, theme, toggleMode } = useTheme();

  const colorSwatches = [
    theme.colors.colorBackgroundBrandDefault,
    theme.colors.colorBackgroundAccentDefault,
    theme.colors.colorBackgroundInfoEmphasis,
    theme.colors.colorBackgroundSuccessEmphasis,
    theme.colors.colorBackgroundErrorEmphasis
  ];

  const typographySamples = [
    { label: 'Display', token: theme.typography.mobile.displayM },
    { label: 'Heading', token: theme.typography.mobile.headingM },
    { label: 'Paragraph', token: theme.typography.mobile.pragraphM },
    { label: 'Label', token: theme.typography.mobile.labelMStrong }
  ];

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.colors.colorBackgroundBaseDefault }
      ]}
    >
      <View style={styles.hero}>
        <View style={styles.heroText}>
          <Text style={[styles.eyebrow, { color: theme.colors.colorTextBrandDefault }]}>
            Greenstand mobile prototype
          </Text>
          <Text style={[styles.title, { color: theme.colors.colorTextBasePrimary }]}>
            React Native app wired to your design tokens
          </Text>
          <Text style={[styles.description, { color: theme.colors.colorTextBaseSecondary }]}>
            This screen reads from the generated React Native token output and the shared theme files
            already in the repo.
          </Text>
        </View>
        <View style={styles.switchRow}>
          <Text style={[styles.switchLabel, { color: theme.colors.colorTextBasePrimary }]}>
            Dark mode
          </Text>
          <Switch
            value={isDark}
            onValueChange={toggleMode}
            trackColor={{
              false: theme.colors.colorBorderBaseStrong,
              true: theme.colors.colorBackgroundBrandDefault
            }}
            thumbColor={theme.colors.colorBaseWhite}
          />
        </View>
      </View>

      <TokenCard title="Brand actions" subtitle="Buttons styled from token values">
        <View style={styles.row}>
          <Pressable
            style={[
              styles.button,
              {
                backgroundColor: theme.colors.colorComponentButtonPrimaryFilledBackgroundDefault
              }
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                { color: theme.colors.colorComponentButtonPrimaryFilledTextDefault }
              ]}
            >
              Plant a tree
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.button,
              styles.outlinedButton,
              {
                borderColor: theme.colors.colorComponentButtonPrimaryOutlinedBorderDefault
              }
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                { color: theme.colors.colorComponentButtonPrimaryOutlinedTextDefault }
              ]}
            >
              View details
            </Text>
          </Pressable>
        </View>
      </TokenCard>

      <TokenCard title="Color tokens" subtitle="A few key semantic surfaces from the light and dark themes">
        <View style={styles.swatchRow}>
          {colorSwatches.map((color) => (
            <View key={color} style={styles.swatchBlock}>
              <View
                style={[
                  styles.swatch,
                  {
                    backgroundColor: color,
                    borderColor: theme.colors.colorBorderBaseDefault
                  }
                ]}
              />
              <Text style={[styles.swatchLabel, { color: theme.colors.colorTextBaseSecondary }]}>
                {color}
              </Text>
            </View>
          ))}
        </View>
      </TokenCard>

      <TokenCard title="Typography tokens" subtitle="Using the generated mobile typography scale">
        {typographySamples.map(({ label, token }) => (
          <View key={label} style={styles.typographyRow}>
            <Text style={[styles.typographyLabel, { color: theme.colors.colorTextBaseSecondary }]}>
              {label}
            </Text>
            <Text
              style={[
                {
                  color: theme.colors.colorTextBasePrimary,
                  fontFamily: resolveFontFamily(token.fontFamily, token.fontWeight),
                  fontSize: token.fontSize,
                  letterSpacing: token.letterSpacing,
                  lineHeight: token.lineHeight
                }
              ]}
            >
              {label} sample
            </Text>
          </View>
        ))}
      </TokenCard>

      <TokenCard title="Elevation token" subtitle="React Native approximation of your surface depth">
        <View
          style={[
            styles.elevatedSurface,
            getShadowStyle(),
            {
              backgroundColor: theme.colors.colorBackgroundBaseContainer
            }
          ]}
        >
          <Text style={[styles.elevatedTitle, { color: theme.colors.colorTextBasePrimary }]}>
            Elevated card
          </Text>
          <Text style={[styles.elevatedText, { color: theme.colors.colorTextBaseSecondary }]}>
            The token file contains multi-layer shadows. This sample uses a close React Native shadow
            style for the prototype screen.
          </Text>
        </View>
      </TokenCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 9999,
    minHeight: 48,
    paddingHorizontal: 18,
    paddingVertical: 12
  },
  buttonText: {
    fontFamily: resolveFontFamily('Roboto', '500'),
    fontSize: 14,
    lineHeight: 20
  },
  container: {
    gap: 20,
    padding: 20
  },
  description: {
    fontSize: 15,
    lineHeight: 22
  },
  elevatedSurface: {
    borderRadius: 16,
    padding: 16
  },
  elevatedText: {
    fontSize: 14,
    lineHeight: 20
  },
  elevatedTitle: {
    fontFamily: resolveFontFamily('Montserrat', '600'),
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 8
  },
  eyebrow: {
    fontFamily: resolveFontFamily('Roboto', '500'),
    fontSize: 13,
    letterSpacing: 0.8,
    lineHeight: 18,
    textTransform: 'uppercase'
  },
  hero: {
    gap: 16
  },
  heroText: {
    gap: 8
  },
  outlinedButton: {
    backgroundColor: 'transparent',
    borderWidth: 1
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  swatch: {
    borderRadius: 12,
    borderWidth: 1,
    height: 52,
    width: '100%'
  },
  swatchBlock: {
    gap: 8,
    width: '48%'
  },
  swatchLabel: {
    fontSize: 12,
    lineHeight: 18
  },
  swatchRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between'
  },
  switchLabel: {
    fontFamily: resolveFontFamily('Roboto', '500'),
    fontSize: 14,
    lineHeight: 20
  },
  switchRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  title: {
    fontFamily: resolveFontFamily('Montserrat', '600'),
    fontSize: 32,
    lineHeight: 38
  },
  typographyLabel: {
    fontSize: 12,
    lineHeight: 18,
    textTransform: 'uppercase'
  },
  typographyRow: {
    gap: 6
  }
});
