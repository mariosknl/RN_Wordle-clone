import {
	useFonts,
	FrankRuhlLibre_800ExtraBold,
	FrankRuhlLibre_500Medium,
	FrankRuhlLibre_900Black,
} from "@expo-google-fonts/frank-ruhl-libre";
import * as SplashScreen from "expo-splash-screen";
import { Stack } from "expo-router";
import { useEffect } from "react";
import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from "@react-navigation/native";
import { useColorScheme } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const colorScheme = useColorScheme();
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
		<ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
			<Stack>
				<Stack.Screen name="index" options={{ headerShown: false }} />
			</Stack>
		</ThemeProvider>
	);
}
