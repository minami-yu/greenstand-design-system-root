import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { getTypographyStyle } from '../theme/typography';
import { Button } from '../components/Button';
import { PasswordField } from '../components/PasswordField';
import { TextField } from '../components/TextField';
import { TextLink } from '../components/TextLink';
import { WalletHeader } from '../components/WalletHeader';


export function WalletAppSignUpScreen() {
  const { theme } = useTheme();
  const { colors, layout, size } = theme;
  const insets = useSafeAreaInsets();
  const typo = theme.typography.mobile;

  const headingStyle = getTypographyStyle(typo.headingL);
  /** Figma `or` copy: label-m / text/base/secondary. */
  const orStyle = getTypographyStyle(typo.labelM);
  const footerStyle = getTypographyStyle(typo.labelL);

  const gutter = layout.screenHorizontalGutter;

  return (
    <View style={[styles.screen, { backgroundColor: colors.colorBackgroundNeturalWhite }]}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: size.sizeSpace600 + insets.bottom,
            paddingHorizontal: gutter,
            paddingTop: 0
          }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <WalletHeader />

          <View style={{ paddingTop: size.sizeSpace800 + size.sizeSpace200 }}>
            <Text style={[headingStyle, { color: colors.colorTextBasePrimary, width: '100%' }]}>
              Sign Up
            </Text>

            <View style={[styles.mainColumn, { gap: size.sizeSpace800, marginTop: size.sizeSpace800 }]}>
              <View style={[styles.formSection, { gap: size.sizeSpace300 }]}>
                <View style={[styles.formBlock, { gap: size.sizeSpace300 }]}>
                  <TextField label="Name" placeholder="Your Name" />
                  <TextField label="Email" placeholder="Email" />
                  <PasswordField label="Password" placeholder="Password" showHint={false} />
                </View>

                <Text
                  style={[
                    orStyle,
                    {
                      alignSelf: 'center',
                      color: colors.colorTextBaseSecondary
                    }
                  ]}
                >
                  or
                </Text>

                <View style={[styles.stack, { gap: size.sizeSpace400 }]}>
                  <Button fullWidth icon="email" iconPlacement="leading" variant="secondary" onPress={() => undefined}>
                    Sign up with Email
                  </Button>
                  <Button fullWidth icon="facebook" iconPlacement="leading" variant="secondary" onPress={() => undefined}>
                    Sign up with Facebook
                  </Button>
                </View>
              </View>

              <View style={[styles.footerRow, { gap: size.sizeSpace100 }]}>
                <Text style={[footerStyle, { color: colors.colorTextBasePrimary }]}>Have an account?</Text>
                <TextLink variant="secondary" size="medium" onPress={() => undefined}>
                  Login
                </TextLink>
              </View>
            </View>

            <View style={{ flexGrow: 1, minHeight: size.sizeSpace600 }} />

            <View style={[styles.stack, { marginBottom: size.sizeSpace1200, marginTop: size.sizeSpace400 }]}>
              <Button fullWidth variant="primary" onPress={() => undefined}>
                Sign up
              </Button>
            </View>
          </View>
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
    flexGrow: 1
  },
  content: {
    alignSelf: 'stretch',
    width: '100%'
  },
  mainColumn: {
    alignItems: 'stretch',
    width: '100%'
  },
  formSection: {
    alignItems: 'stretch',
    width: '100%'
  },
  formBlock: {
    alignItems: 'stretch',
    width: '100%'
  },
  stack: {
    width: '100%'
  },
  footerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%'
  }
});
