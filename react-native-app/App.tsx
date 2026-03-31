import { useFonts } from 'expo-font';
import {
  Montserrat_300Light,
  Montserrat_600SemiBold
} from '@expo-google-fonts/montserrat';
import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_600SemiBold
} from '@expo-google-fonts/roboto';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, SafeAreaView, View } from 'react-native';
import { DesignSystemScreen } from './src/screens/DesignSystemScreen';
import { ThemeProvider, useTheme } from './src/theme';

function AppContent() {
  const { isDark } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <SafeAreaView style={{ flex: 1 }}>
        <DesignSystemScreen />
      </SafeAreaView>
    </>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Montserrat: Montserrat_300Light,
    'Montserrat-Light': Montserrat_300Light,
    'Montserrat-SemiBold': Montserrat_600SemiBold,
    Roboto: Roboto_400Regular,
    'Roboto-Regular': Roboto_400Regular,
    'Roboto-Medium': Roboto_500Medium,
    'Roboto-SemiBold': Roboto_600SemiBold
  });

  if (!fontsLoaded) {
    return (
      <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
