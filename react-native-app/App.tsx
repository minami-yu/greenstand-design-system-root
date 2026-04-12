import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { DesignSystemScreen } from './src/screens/DesignSystemScreen';
import { appFonts } from './src/theme/fonts';
import { ThemeProvider, useTheme } from './src/theme';

function AppContent() {
  const { isDark } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1 }}>
        <DesignSystemScreen />
      </SafeAreaView>
    </>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts(appFonts);

  if (!fontsLoaded) {
    return (
      <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
