import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomNavItem } from '../components/BottomNav';
import { BottomNav, BOTTOM_NAV_SCROLL_PADDING } from '../components/BottomNav';
import { Avatar } from '../components/Avatar';
import { Icon } from '../components/Icon';
import { List, ListItem } from '../components/List';
import { TextLink } from '../components/TextLink';
import { TileStats } from '../components/TileStats';
import { WalletHeader } from '../components/WalletHeader';
import { useTheme } from '../theme';
import { getTypographyStyle } from '../theme/typography';

const WALLET_NAV: BottomNavItem[] = [
  { type: 'tab', id: 'home', label: 'Home', icon: 'home', iconActive: 'home-filled' },
  { type: 'tab', id: 'wallet', label: 'wallet', icon: 'wallet', iconActive: 'wallet-filled' },
  { type: 'fab', id: 'transfer', icon: 'swap' },
  { type: 'tab', id: 'notifications', label: 'Notifications', icon: 'notification', iconActive: 'notification-filled' },
  { type: 'tab', id: 'settings', label: 'Settings', icon: 'settings', iconActive: 'settings-filled' }
];


export function WalletHomeScreen() {
  const { theme } = useTheme();
  const { colors, layout, size } = theme;
  const insets = useSafeAreaInsets();
  const typo = theme.typography.mobile;
  const headingS = getTypographyStyle(typo.headingS);

  const [navId, setNavId] = useState<string>('home');

  const gutter = layout.screenHorizontalGutter;

  return (
    <View style={[styles.screen, { backgroundColor: colors.colorBackgroundNeturalBase }]}>
      <StatusBar style="light" />
      <WalletHeader variant="home" onSearchPress={() => undefined} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: BOTTOM_NAV_SCROLL_PADDING + insets.bottom + size.sizeSpace400,
            paddingHorizontal: gutter,
            paddingTop: size.sizeSpace600
          }
        ]}
      >
        <View style={[styles.column, { gap: size.sizeSpace800 }]}>
          <View style={[styles.tilesRow, { gap: size.sizeSpace200 }]}>
            <TileStats
              label="Tokens"
              number="1000"
              showUnit={false}
              icon={
                <Icon
                  name="coins"
                  size={size.sizeIconSm}
                  color={colors.colorIconBaseSecondary}
                  accessible={false}
                />
              }
              style={styles.tile}
            />
            <TileStats
              label="Wallets"
              number="2"
              showUnit={false}
              icon={
                <Icon
                  name="wallet"
                  size={size.sizeIconSm}
                  color={colors.colorIconBaseSecondary}
                  accessible={false}
                />
              }
              style={styles.tile}
            />
          </View>

          <View style={{ gap: size.sizeSpace400, width: '100%' }}>
            <View style={styles.sectionHead}>
              <Text style={[headingS, { color: colors.colorTextBasePrimary }]}>Recent Activities</Text>
              <TextLink variant="primary" underline={false} onPress={() => undefined}>
                View all
              </TextLink>
            </View>
            <List>
              <ListItem
                title="Greenstand"
                subtitle="Pending"
                leading={
                  <View style={styles.avatarWrap}>
                    <Avatar initials="GS" variant="brand" />
                  </View>
                }
                trailingText="-200"
                trailingTone="secondary"
              />
              <ListItem
                title="Kilimanjaro Project"
                subtitle="Received"
                leading={
                  <View style={styles.avatarWrap}>
                    <Avatar initials="K" variant="neutral" />
                  </View>
                }
                trailingText="+300"
                trailingTone="secondary"
              />
              <ListItem
                title="Greenstand"
                subtitle="Sent"
                leading={
                  <View style={styles.avatarWrap}>
                    <Avatar initials="GS" variant="brand" />
                  </View>
                }
                trailingText="-200"
                trailingTone="secondary"
                showDivider={false}
              />
            </List>
          </View>
        </View>
      </ScrollView>

      <BottomNav
        items={WALLET_NAV}
        activeId={navId}
        onFabPress={() => undefined}
        onTabPress={(id) => setNavId(id)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    overflow: 'visible',
    width: '100%'
  },
  scroll: {
    flex: 1
  },
  scrollContent: {
    alignItems: 'stretch',
    flexGrow: 1,
    width: '100%'
  },
  column: {
    width: '100%'
  },
  tilesRow: {
    alignItems: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  tile: {
    alignSelf: 'stretch',
    flexBasis: 0,
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 0
  },
  sectionHead: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  avatarWrap: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    width: '100%'
  }
});
