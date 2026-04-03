import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { useTheme } from '../theme';

type MaterialCommunityIconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export const ICON_MAP = {
  heart: 'heart-outline',
  search: 'magnify',
  'arrow-up': 'arrow-up',
  'arrow-down': 'arrow-down',
  'arrow-left': 'arrow-left',
  'arrow-right': 'arrow-right',
  add: 'plus-outline',
  swap: 'swap-horizontal',
  close: 'close',
  calendar: 'calendar-outline',
  information: 'information-outline',
  clock: 'clock-outline',
  menu: 'menu',
  email: 'email-outline',
  github: 'github',
  facebook: 'facebook',
  whatsapp: 'whatsapp',
  eye: 'eye-outline',
  'eye-off': 'eye-off-outline',
  filter: 'filter-outline',
  checked: 'check-circle-outline',
  upload: 'cloud-upload-outline',
  offline: 'cloud-off-outline',
  download: 'cloud-download-outline',
  tree: 'pine-tree-variant-outline',
  'cloud-upload': 'cloud-upload-outline',
  map: 'map-outline',
  language: 'web',
  login: 'login',
  logout: 'logout',
  account: 'account-outline',
  home: 'home-outline',
  'home-filled': 'home',
  wallet: 'wallet-outline',
  'wallet-filled': 'wallet',
  notification: 'bell-outline',
  'notification-filled': 'bell',
  settings: 'cog-outline',
  'settings-filled': 'cog',
  camera: 'camera-outline',
  'camera-filled': 'camera'
} as const satisfies Record<string, MaterialCommunityIconName>;

export type IconName = keyof typeof ICON_MAP;

export type IconProps = {
  name: IconName;
  /** @default theme.size.sizeIconMd (icon.md in tokens; 20 in current dictionary) */
  size?: number;
  /** @default theme.colors.colorIconBaseDefault */
  color?: string;
  accessibilityLabel?: string;
  /** When false, hides this glyph from the accessibility tree (e.g. decorative icon in a labeled button). */
  accessible?: boolean;
};

export function Icon({ name, size, color, accessibilityLabel, accessible }: IconProps) {
  const { theme } = useTheme();

  return (
    <MaterialCommunityIcons
      name={ICON_MAP[name]}
      size={size ?? theme.size.sizeIconMd}
      color={color ?? theme.colors.colorIconBaseDefault}
      accessibilityLabel={accessibilityLabel}
      accessible={accessible}
    />
  );
}
