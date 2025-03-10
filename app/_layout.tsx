import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { persistor, store } from '@/components/Store/store';
import { PersistGate } from 'redux-persist/integration/react';
import Toast from 'react-native-toast-message';
import { PaperProvider } from 'react-native-paper';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GestureHandlerRootView>
          <ThemeProvider value={DefaultTheme}>
            <PaperProvider>
              <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="login" options={{ headerShown: false }} />
                <Stack.Screen name="userRegister" options={{ headerShown: false }} />
                <Stack.Screen name="providerRegister1" options={{ headerShown: false }} />
                <Stack.Screen name="providerRegister2" options={{ headerShown: false }} />
                <Stack.Screen name="providerRegister3" options={{ headerShown: false }} />
                <Stack.Screen name="providerRegister4" options={{ headerShown: false }} />
                <Stack.Screen name="forgotPassword" options={{ headerShown: false }} />
                <Stack.Screen name="resetPasswordOtp/[query]" options={{ headerShown: false }} />
                <Stack.Screen name="resetPassword/[query]" options={{ headerShown: false }} />
                <Stack.Screen name="(user)" options={{ headerShown: false }} />
                <Stack.Screen name="(provider)" options={{ headerShown: false }} />
                <Stack.Screen name="service-detail/[id]" options={{ headerShown: false }} />
                <Stack.Screen name="reviews/[id]" options={{ headerShown: false }} />
                <Stack.Screen name="history" options={{ headerShown: false }} />
                <Stack.Screen name="providerHistory" options={{ headerShown: false }} />
                <Stack.Screen name="leads" options={{ headerShown: false }} />
                <Stack.Screen name="createListing" options={{ headerShown: false }} />
                <Stack.Screen name="listing" options={{ headerShown: false }} />
                <Stack.Screen name="favorite" options={{ headerShown: false }} />
                <Stack.Screen name="updateListing/[id]" options={{ headerShown: false }} />
                <Stack.Screen name="chat/[recipientId]/[convoId]" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
              </Stack>
              <StatusBar style="auto" />
              <Toast />
            </PaperProvider>
          </ThemeProvider>
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
}
