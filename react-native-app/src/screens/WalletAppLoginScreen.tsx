import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { GreenstandLoginMark } from '../components/GreenstandLoginMark';
import { useTheme } from '../theme';
import { getTypographyStyle } from '../theme/typography';

const HERO_PX = 160;
const DOT_ACTIVE_PX = 8;
const DOT_INACTIVE_PX = 8;
const DOT_GAP_PX = 6;


export function WalletAppLoginScreen() {
  const { theme } = useTheme();
  const { colors, layout, size } = theme;
  const insets = useSafeAreaInsets();
  const typo = theme.typography.mobile;

  const headingM = getTypographyStyle(typo.headingL);
  const paragraphL = getTypographyStyle(typo.paragraphL);

  const gutter = layout.screenHorizontalGutter;

  return (
    <View style={[styles.screen, { backgroundColor: colors.colorBackgroundNeturalWhite }]}>
      <StatusBar style="dark" />
      <ScrollView
        bounces={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: Math.max(insets.bottom, size.sizeSpace400) + size.sizeSpace400,
            paddingHorizontal: gutter,
            paddingTop: size.sizeSpace800
          }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.upper}>
          <View style={styles.heroWrap}>
            <GreenstandLoginMark size={HERO_PX} />
          </View>

          <View style={[styles.copyBlock, { gap: size.sizeSpace400, marginTop: size.sizeSpace800 }]}>
            <Text style={[headingM, { color: colors.colorTextBasePrimary, textAlign: 'center' }]}>
              Join the Greenstand movement!
            </Text>
            <Text style={[paragraphL, { color: colors.colorTextBaseSecondary, textAlign: 'center' }]}>
              Start making a positive impact on the environment today
            </Text>
          </View>

          <View
            style={[
              styles.dotsRow,
              {
                gap: DOT_GAP_PX,
                marginTop: size.sizeSpace800
              }
            ]}
            accessibilityLabel="Step 1 of 3"
          >
            <View
              style={[
                styles.dot,
                {
                  backgroundColor: colors.colorTextAccentDefault,
                  height: DOT_ACTIVE_PX,
                  width: DOT_ACTIVE_PX
                }
              ]}
            />
            <View
              style={[
                styles.dot,
                {
                  backgroundColor: colors.colorBorderBaseSubtle,
                  height: DOT_INACTIVE_PX,
                  width: DOT_INACTIVE_PX
                }
              ]}
            />
            <View
              style={[
                styles.dot,
                {
                  backgroundColor: colors.colorBorderBaseSubtle,
                  height: DOT_INACTIVE_PX,
                  width: DOT_INACTIVE_PX
                }
              ]}
            />
          </View>
        </View>

        <View style={{ flexGrow: 1, minHeight: size.sizeSpace800 }} />

        <View style={[styles.actions, { gap: size.sizeSpace400 }]}>
          <Button fullWidth variant="primary" onPress={() => undefined}>
            Sign Up
          </Button>
          <Button fullWidth variant="tertiary" onPress={() => undefined}>
            Log In
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: '100%'
  },
  scrollContent: {
    flexGrow: 1,
    width: '100%'
  },
  upper: {
    alignItems: 'center',
    width: '100%'
  },
  heroWrap: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  copyBlock: {
    alignSelf: 'stretch',
    maxWidth: '100%'
  },
  dotsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  dot: {
    borderRadius: 9999
  },
  actions: {
    alignSelf: 'stretch',
    width: '100%'
  }
});
