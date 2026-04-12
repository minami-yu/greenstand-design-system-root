import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren
} from 'react';
import { useColorScheme } from 'react-native';
import { layout } from './layout';
import { themeDark } from './theme-dark';
import { themeLight } from './theme-light';

type BaseTheme = typeof themeLight | typeof themeDark;

type AppTheme =
  | (typeof themeLight & { layout: typeof layout })
  | (typeof themeDark & { layout: typeof layout });

function withLayout<T extends BaseTheme>(base: T): T & { layout: typeof layout } {
  return { ...base, layout };
}
type ThemeMode = 'light' | 'dark';

type ThemeContextValue = {
  isDark: boolean;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  theme: AppTheme;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: PropsWithChildren) {
  const systemColorScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>(systemColorScheme === 'dark' ? 'dark' : 'light');

  useEffect(() => {
    setMode(systemColorScheme === 'dark' ? 'dark' : 'light');
  }, [systemColorScheme]);

  const isDark = mode === 'dark';
  const value: ThemeContextValue = {
    isDark,
    mode,
    setMode,
    toggleMode: () => setMode(isDark ? 'light' : 'dark'),
    theme: withLayout(isDark ? themeDark : themeLight)
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);

  if (!value) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return value;
}

export { layout } from './layout';
export type { ThemeLayout } from './layout';
