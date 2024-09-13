import {
  useFonts,
  FrankRuhlLibre_800ExtraBold,
  FrankRuhlLibre_500Medium,
  FrankRuhlLibre_900Black,
} from "@expo-google-fonts/frank-ruhl-libre";
import * as SplashScreen from "expo-splash-screen";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import {
  Appearance,
  Platform,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";
import { tokenCache } from "@/utils/cache";
import Logo from "@/assets/images/nyt-logo.svg";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

import { LogBox } from "react-native";
import { useMMKVBoolean } from "react-native-mmkv";
import { storage } from "@/utils/storage";
LogBox.ignoreAllLogs();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env",
  );
}

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [dark] = useMMKVBoolean("dark-mode", storage);

  useEffect(() => {
    if (Platform.OS !== "web") {
      Appearance.setColorScheme(dark ? "dark" : "light");
    }
  }, [dark]);

  const [fontsLoaded, error] = useFonts({
    FrankRuhlLibre_500Medium,
    FrankRuhlLibre_800ExtraBold,
    FrankRuhlLibre_900Black,
  });

  useEffect(() => {
    if (fontsLoaded || error) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
              <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen
                  name="login"
                  options={{
                    presentation: "modal",
                    headerShadowVisible: false,
                    headerTitle: () => <Logo width={150} height={40} />,
                    headerLeft: () => (
                      <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons
                          name="close"
                          size={26}
                          color={Colors.light.gray}
                        />
                      </TouchableOpacity>
                    ),
                  }}
                />
                <Stack.Screen
                  name="game"
                  options={{
                    headerBackTitle: "Wordle",
                    headerTintColor: colorScheme === "dark" ? "#fff" : "#000",
                    title: "",
                    headerBackTitleStyle: {
                      fontSize: 26,
                      fontFamily: "FrankRuhlLibre_800ExtraBold",
                    },
                  }}
                />
                <Stack.Screen
                  name="end"
                  options={{
                    presentation: "fullScreenModal",
                    title: "",
                    headerShadowVisible: false,
                  }}
                />
              </Stack>
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </ThemeProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
