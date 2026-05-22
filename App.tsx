import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Platform, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from './src/navigation/RootNavigator';
import { loadFonts } from './src/theme/fonts';
import { AuthProvider } from './src/context/AuthContext';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = React.useState(false);

  React.useEffect(() => {
    loadFonts()
      .then(() => setFontsLoaded(true))
      .catch((error) => {
        console.error('Font loading failed:', error);
        setFontsLoaded(true);
      });
  }, []);

  if (!fontsLoaded && Platform.OS !== 'web') {
    return <View style={{ flex: 1 }} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#0B0F14' }}>
      <SafeAreaProvider>
        <AuthProvider>
          <NavigationContainer>
            <StatusBar style="light" />
            <RootNavigator />
          </NavigationContainer>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
