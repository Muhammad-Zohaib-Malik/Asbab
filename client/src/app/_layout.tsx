import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import '../../global.css'
import { WSProvider } from '@/service/WebProvider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({

    "Jakarta-Bold": require("@/assets/fonts/PlusJakartaSans-Bold.ttf"),
    "Jakarta-ExtraBold": require("@/assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
    "Jakarta-Light": require("@/assets/fonts/PlusJakartaSans-Light.ttf"),
    "Jakarta-Medium": require("@/assets/fonts/PlusJakartaSans-Medium.ttf"),
    "Jakarta-Regular": require("@/assets/fonts/PlusJakartaSans-Regular.ttf"),
    "Jakarta-SemiBold": require("@/assets/fonts/PlusJakartaSans-SemiBold.ttf"),



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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <WSProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="role" options={{ headerShown: false }} />
          <Stack.Screen name="customer/auth" options={{ headerShown: false }} />
          <Stack.Screen name="captain/auth" options={{ headerShown: false }} />
          <Stack.Screen name="captain/home" options={{ headerShown: false }} />
          <Stack.Screen name="captain/liveride" options={{ headerShown: false }} />
          <Stack.Screen name="customer/home" options={{ headerShown: false }} />
          <Stack.Screen name="customer/selectlocations" options={{ headerShown: false }} />
          <Stack.Screen name="customer/ridebooking" options={{ headerShown: false }} />
          <Stack.Screen name="customer/profile" options={{ headerShown: false }} />
          <Stack.Screen name="customer/setting" options={{ headerShown: false }} />
          <Stack.Screen name="customer/liveride" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </WSProvider>
    </GestureHandlerRootView>
  );
}
