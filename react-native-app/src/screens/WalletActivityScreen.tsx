import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomNavItem } from '../components/BottomNav';
import { BottomNav, BOTTOM_NAV_SCROLL_PADDING } from '../components/BottomNav';
import { Avatar } from '../components/Avatar';
import { List, ListItem } from '../components/List';
import { TabBar } from '../components/Tab';
import { WalletHeader } from '../components/WalletHeader';
import { useTheme } from '../theme';
import { getTypographyStyle } from '../theme/typography';

const TABS = [
  { key: 'activity', label: 'Activity' },
  { key: 'details', label: 'Details' }
] as const;

const WALLET_NAV: BottomNavItem[] = [
  { type: 'tab', id: 'home', label: 'Home', icon: 'home', iconActive: 'home-filled' },
  { type: 'tab', id: 'wallet', label: 'wallet', icon: 'wallet', iconActive: 'wallet-filled' },
  { type: 'fab', id: 'transfer', icon: 'swap' },
  { type: 'tab', id: 'notifications', label: 'Notifications', icon: 'notification', iconActive: 'notification-filled' },
  { type: 'tab', id: 'settings', label: 'Settings', icon: 'settings', iconActive: 'settings-filled' }
];


export function WalletActivityScreen() {
  const { theme } = useTheme();
  const { colors, layout, size } = theme;
  const insets = useSafeAreaInsets();
  const typo = theme.typography.mobile;
  const headingS = getTypographyStyle(typo.headingS);
  const labelM = getTypographyStyle(typo.labelM);

  const [tab, setTab] = useState<string>('activity');
  const [navId, setNavId] = useState<string>('wallet');

  const gutter = layout.screenHorizontalGutter;

  return (
    <View style={[styles.screen, { backgroundColor: colors.colorBackgroundNeturalBase }]}>
      <WalletHeader variant="goBack" label="Wallet 2" onBackPress={() => undefined} onMenuPress={() => undefined} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: BOTTOM_NAV_SCROLL_PADDING + insets.bottom + size.sizeSpace400,
            paddingHorizontal: gutter
          }
        ]}
      >
        <View style={{ marginBottom: size.sizeSpace600, marginHorizontal: -gutter }}>
          <TabBar
            tabs={[...TABS]}
            selectedKey={tab}
            onSelect={(key) => setTab(key)}
          />
        </View>

        {tab === 'activity' ? (
          <View style={{ gap: size.sizeSpace800, width: '100%' }}>
            <View style={{ gap: size.sizeSpace400, width: '100%' }}>
              <Text style={[headingS, { color: colors.colorTextBasePrimary }]}>Pending</Text>
              <List>
                <ListItem
                  title="Greenstand"
                  subtitle="February 3"
                  subtitleVariant="paragraphS"
                  leading={
                    <View style={styles.avatarWrap}>
                      <Avatar initials="GS" variant="brand" />
                    </View>
                  }
                  trailingText="-300"
                  trailingTone="error"
                  showDivider={false}
                />
              </List>
            </View>

            <View style={{ gap: size.sizeSpace400, width: '100%' }}>
              <View style={{ gap: size.sizeSpace100 }}>
                <Text style={[headingS, { color: colors.colorTextBasePrimary }]}>Completed</Text>
                <Text style={[labelM, { color: colors.colorTextBaseSecondary }]}>January 2026</Text>
              </View>
              <List>
                <ListItem
                  title="Kilimanjaro Project"
                  subtitle="January 23"
                  subtitleVariant="paragraphS"
                  leading={
                    <View style={styles.avatarWrap}>
                      <Avatar initials="K" variant="neutral" />
                    </View>
                  }
                  trailingText="+300"
                  trailingTone="success"
                />
                <ListItem
                  title="Greenstand"
                  subtitle="January 16"
                  subtitleVariant="paragraphS"
                  leading={
                    <View style={styles.avatarWrap}>
                      <Avatar initials="GS" variant="brand" />
                    </View>
                  }
                  trailingText="-200"
                  trailingTone="error"
                  showDivider={false}
                />
              </List>
            </View>
          </View>
        ) : (
          <View style={{ paddingVertical: size.sizeSpace400, width: '100%' }}>
            <Text style={[labelM, { color: colors.colorTextBaseSecondary }]}>Details content</Text>
          </View>
        )}
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
    alignItems: 'stretch'
  },
  avatarWrap: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    width: '100%'
  }
});
