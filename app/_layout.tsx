import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { UserDetailProvider } from "./../context/UserDetailContext";

SplashScreen.preventAutoHideAsync(); // Keep splash visible while loading

export default function RootLayout() {
  const [userDetail, setUserDetail] = useState(null);

  const [fontsLoaded] = useFonts({
    manrope: require("./../assets/fonts/Manrope-Regular.ttf"),
    manropemed: require("./../assets/fonts/Manrope-Medium.ttf"),
    manropebold: require("./../assets/fonts/Manrope-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync(); // Hide splash when fonts are ready
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Wait until fonts are loaded
  }

  return (
    <UserDetailProvider> 
      <Stack screenOptions={{ headerShown: false }} />
    </UserDetailProvider>
  );
}
