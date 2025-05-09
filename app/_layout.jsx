import React from "react";
import { Stack } from "expo-router"; // Use the Expo Router Stack component
import { useFonts } from "expo-font";
export default function RootLayout() {
useFonts({
  'outfit':require('./../assets/fonts/Outfit-Regular.ttf'),
  'outfitBold':require('./../assets/fonts/Outfit-Bold.ttf')
})

  return (
  <Stack screenOptions={{headerShown:false}}>
    {/* <Stack.Screen name="(tabs)/welcomeScreen" />
    <Stack.Screen name="nearbyGas" options={{ presentation: "modal" }} /> */}
  </Stack>
  )

}