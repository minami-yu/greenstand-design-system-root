import { useEffect, useState } from 'react';
import { Keyboard, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { TextField } from '../components/TextField';
import { WalletHeader } from '../components/WalletHeader';
import { useTheme } from '../theme';
import { getTypographyStyle } from '../theme/typography';

export function WalletAppTransactionScreen() {
  const { theme } = useTheme();
  const { colors, layout, size } = theme;
  const typo = theme.typography.mobile;

  const labelL = getTypographyStyle(typo.labelL);
  const numericL = getTypographyStyle(typo.numericL);

  const [amount, setAmount] = useState('1200');
  const [purpose, setPurpose] = useState('');

  /** Measured column under status/safe area so we can size the band to visible height above the keyboard (iOS). */
  const [rootHeight, setRootHeight] = useState(0);
  const [headerHeight, setHeaderHeight] = useState<number>(layout.walletHeaderBarHeight);
  /** iOS: keyboard overlap height; Android: rely on window resize + flex (avoid double-subtract). */
  const [keyboardOverlap, setKeyboardOverlap] = useState(0);

  useEffect(() => {
    if (Platform.OS !== 'ios') {
      return;
    }
    const show = Keyboard.addListener('keyboardWillShow', (e) => {
      setKeyboardOverlap(e.endCoordinates.height);
    });
    const hide = Keyboard.addListener('keyboardWillHide', () => {
      setKeyboardOverlap(0);
    });
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const gutter = layout.screenHorizontalGutter;

  const iosBandHeight =
    Platform.OS === 'ios' && rootHeight > 0
      ? Math.max(0, rootHeight - headerHeight - keyboardOverlap)
      : null;

  return (
    <View
      onLayout={(e) => setRootHeight(e.nativeEvent.layout.height)}
      style={[styles.root, { backgroundColor: colors.colorBackgroundNeturalBase }]}
    >
      <StatusBar style="light" />

      <View
        onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
        style={styles.headerSlot}
      >
        <WalletHeader
          variant="accent"
          onBackPress={() => undefined}
          onSearchPress={() => undefined}
        />
      </View>

      <View
        style={[
          styles.contentBand,
          iosBandHeight != null
            ? { flexGrow: 0, flexShrink: 0, height: iosBandHeight }
            : { flex: 1, minHeight: 0 },
          { backgroundColor: colors.colorBackgroundNeturalBase }
        ]}
      >
        <View
          style={[
            styles.bodyPad,
            {
              paddingBottom: size.sizeSpace400,
              paddingHorizontal: gutter,
              paddingTop: size.sizeSpace600
            }
          ]}
        >
          <View style={styles.bodyStack}>
            <View style={[styles.hero, { gap: size.sizeSpace600 }]}>
              <View style={[styles.payee, { gap: size.sizeSpace200 }]}>
                <Avatar initials="GS" variant="brand" />
                <Text style={[labelL, { color: colors.colorTextBasePrimary, textAlign: 'center' }]}>
                  Greenstand
                </Text>
              </View>

              <View style={[styles.amountStack, { gap: size.sizeSpace0 }]}>
                <View style={[styles.amountRow, { gap: size.sizeSpace300 }]}>
                  <TextInput
                    accessibilityLabel="Amount in tokens"
                    autoFocus
                    keyboardType="decimal-pad"
                    onChangeText={setAmount}
                    placeholder="0"
                    placeholderTextColor={colors.colorTextBasePlaceholder}
                    style={[
                      numericL,
                      styles.amountInput,
                      { color: colors.colorTextBasePrimary, maxWidth: 280, minWidth: 72 }
                    ]}
                    value={amount}
                  />
                  <Pressable
                    accessibilityLabel="Clear amount"
                    accessibilityRole="button"
                    hitSlop={size.sizeSpace200}
                    onPress={() => setAmount('')}
                    style={styles.clearTarget}
                  >
                    <Icon
                      name="close-circle"
                      size={size.sizeIconMd}
                      color={colors.colorIconBaseTertiary}
                      accessible={false}
                    />
                  </Pressable>
                </View>
                <Text style={[labelL, { color: colors.colorTextBaseSecondary, textAlign: 'center', width: '100%' }]}>
                  Tokens
                </Text>
              </View>
            </View>

            <View style={[styles.lower, { gap: size.sizeSpace400 }]}>
              <TextField
                fieldStyle="outline"
                label="What's for?"
                onChangeText={setPurpose}
                placeholder="2026 January tree planting effort"
                showClearButton={false}
                value={purpose}
              />
              <View style={[styles.actions, { gap: size.sizeSpace200 }]}>
                <View style={styles.actionCell}>
                  <Button fullWidth variant="primary" onPress={() => undefined}>
                    Send
                  </Button>
                </View>
                <View style={styles.actionCell}>
                  <Button fullWidth variant="primary" onPress={() => undefined}>
                    Request
                  </Button>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    width: '100%'
  },
  headerSlot: {
    flexShrink: 0,
    width: '100%'
  },
  /**
   * iOS: height = root − header − keyboard (no overlap with keys). Android: `flex: 1` when the window resizes.
   */
  contentBand: {
    alignSelf: 'stretch',
    width: '100%'
  },
  bodyPad: {
    flex: 1,
    minHeight: 0,
    width: '100%'
  },
  bodyStack: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: 0,
    width: '100%'
  },
  hero: {
    alignItems: 'center',
    flexShrink: 0,
    width: '100%'
  },
  payee: {
    alignItems: 'center'
  },
  amountStack: {
    alignItems: 'center',
    maxWidth: '100%',
    width: '100%'
  },
  amountRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  amountInput: {
    paddingVertical: 0,
    textAlign: 'right',
    ...Platform.select({
      android: { textAlignVertical: 'center' as const }
    })
  },
  clearTarget: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 44
  },
  lower: {
    alignItems: 'stretch',
    flexShrink: 0,
    width: '100%'
  },
  actions: {
    alignItems: 'stretch',
    flexDirection: 'row',
    width: '100%'
  },
  actionCell: {
    flex: 1,
    minWidth: 0
  }
});
