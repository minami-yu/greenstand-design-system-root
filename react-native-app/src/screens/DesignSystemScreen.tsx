import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { IconButton } from '../components/IconButton';
import { RadioButton, RadioGroup } from '../components/RadioButton';
import { Tab, TabGroup } from '../components/Tab';
import { TokenCard } from '../components/TokenCard';
import { useTheme } from '../theme';
import { getFontFamily } from '../theme/fonts';
import { getTypographyStyle } from '../theme/typography';

function getShadowStyle() {
  return {
    elevation: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 12
  } as const;
}

type PlantingGoal = 'restore' | 'offset' | 'learn';

type DemoTab = 'overview' | 'activity' | 'settings';

export function DesignSystemScreen() {
  const { isDark, theme, toggleMode } = useTheme();
  const [plantingGoal, setPlantingGoal] = useState<PlantingGoal>('restore');
  const [demoTab, setDemoTab] = useState<DemoTab>('overview');

  const colorSwatches = [
    theme.colors.colorBackgroundBrandDefault,
    theme.colors.colorBackgroundAccentDefault,
    theme.colors.colorBackgroundInfoEmphasis,
    theme.colors.colorBackgroundSuccessEmphasis,
    theme.colors.colorBackgroundErrorEmphasisDefault
  ];

  const typographySamples = [
    { label: 'Display', token: theme.typography.mobile.displayM },
    { label: 'Heading', token: theme.typography.mobile.headingM },
    { label: 'Paragraph', token: theme.typography.mobile.paragraphM },
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

      <TokenCard title="Radio buttons" subtitle="Brand border and fill from semantic color tokens">
        <RadioGroup accessibilityLabel="Planting goal">
          <RadioButton
            label="Restore degraded land"
            onPress={() => setPlantingGoal('restore')}
            selected={plantingGoal === 'restore'}
          />
          <RadioButton
            label="Offset my footprint"
            onPress={() => setPlantingGoal('offset')}
            selected={plantingGoal === 'offset'}
          />
          <RadioButton
            disabled
            label="Unavailable option"
            onPress={() => setPlantingGoal('learn')}
            selected={plantingGoal === 'learn'}
          />
        </RadioGroup>
      </TokenCard>

      <TokenCard
        title="Tabs"
        subtitle="TabGroup + Tab: active uses brand text and indicator; full-width row on mobile (flex per tab)"
      >
        <TabGroup accessibilityLabel="Demo section">
          <Tab active={demoTab === 'overview'} onPress={() => setDemoTab('overview')}>
            Overview
          </Tab>
          <Tab active={demoTab === 'activity'} onPress={() => setDemoTab('activity')}>
            Activity
          </Tab>
          <Tab active={demoTab === 'settings'} onPress={() => setDemoTab('settings')}>
            Settings
          </Tab>
        </TabGroup>
      </TokenCard>

      <TokenCard
        title="Buttons"
        subtitle="Semantic colors, sizeRadiusXs + space tokens, optional leading icon via Icon map (matches Figma)"
      >
        <View style={styles.row}>
          <Button variant="primary" onPress={() => { }}>
            Primary
          </Button>
          <Button variant="secondary" onPress={() => { }}>
            Secondary
          </Button>
          <Button variant="tertiary" onPress={() => { }}>
            Tertiary
          </Button>
          <Button variant="error" onPress={() => { }}>
            Error
          </Button>
        </View>
        <View style={styles.row}>
          <Button disabled variant="primary" onPress={() => { }}>
            Disabled
          </Button>
          <Button icon="heart" variant="primary" onPress={() => { }}>
            With icon
          </Button>
        </View>
      </TokenCard>

      <TokenCard
        title="Icon buttons"
        subtitle="Variants match Button; sizes from size tokens; circular radius (sizeRadiusFull)"
      >
        <Text
          style={[
            getTypographyStyle(theme.typography.mobile.labelS),
            styles.sectionLabel,
            { color: theme.colors.colorTextBaseSecondary }
          ]}
        >
          Large / medium / small
        </Text>
        <View style={styles.row}>
          <IconButton
            accessibilityLabel="Search"
            icon="search"
            size="large"
            onPress={() => {}}
          />
          <IconButton
            accessibilityLabel="Search"
            icon="search"
            size="medium"
            onPress={() => {}}
          />
          <IconButton
            accessibilityLabel="Search"
            icon="search"
            size="small"
            onPress={() => {}}
          />
        </View>
        <Text
          style={[
            getTypographyStyle(theme.typography.mobile.labelS),
            styles.sectionLabel,
            { color: theme.colors.colorTextBaseSecondary }
          ]}
        >
          Variants
        </Text>
        <View style={styles.row}>
          <IconButton accessibilityLabel="Heart" icon="heart" variant="primary" onPress={() => {}} />
          <IconButton
            accessibilityLabel="Heart"
            icon="heart"
            variant="secondary"
            onPress={() => {}}
          />
          <IconButton
            accessibilityLabel="Heart"
            icon="heart"
            variant="tertiary"
            onPress={() => {}}
          />
          <IconButton accessibilityLabel="Close" icon="close" variant="error" onPress={() => {}} />
        </View>
        <View style={styles.row}>
          <IconButton
            accessibilityLabel="Disabled"
            disabled
            icon="settings"
            variant="primary"
            onPress={() => {}}
          />
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
                getTypographyStyle(token),
                {
                  color: theme.colors.colorTextBasePrimary
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
    fontFamily: getFontFamily('Montserrat', '600'),
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 8
  },
  eyebrow: {
    fontFamily: getFontFamily('Roboto', '500'),
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
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  sectionLabel: {
    marginBottom: 4,
    textTransform: 'uppercase'
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
    fontFamily: getFontFamily('Roboto', '500'),
    fontSize: 14,
    lineHeight: 20
  },
  switchRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  title: {
    fontFamily: getFontFamily('Montserrat', '600'),
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
