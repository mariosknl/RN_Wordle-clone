import {
	StyleSheet,
	Text,
	TouchableOpacity,
	useColorScheme,
	View,
} from "react-native";
import Icon from "@/assets/images/wordle-icon.svg";
import { Link } from "expo-router";
import { format } from "date-fns";
import { Colors } from "@/constants/Colors";
import ThemedText from "@/components/ThemedText";
import { useRef } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import SubscribeModal from "@/components/SubscribeModal";
import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-expo";
import Animated, {
	FadeIn,
	FadeInDown,
	FadeInLeft,
} from "react-native-reanimated";

const AnimatedTouchableOpacity =
	Animated.createAnimatedComponent(TouchableOpacity);

export default function Index() {
	const colorScheme = useColorScheme();
	const backgroundColor = Colors[colorScheme ?? "light"].background;
	const textColor = Colors[colorScheme ?? "light"].text;
	const subscribeModalRef = useRef<BottomSheetModal>(null);
	const { signOut } = useAuth();

	const handlePresentSubscribeModal = () =>
		subscribeModalRef.current?.present();

	return (
		<View style={[styles.container, { backgroundColor }]}>
			<SubscribeModal ref={subscribeModalRef} />

			<Animated.View style={styles.header} entering={FadeInDown}>
				<Icon width={100} height={70} />
				<ThemedText style={styles.title}>Wordle</ThemedText>
				<ThemedText style={styles.text}>
					Get 6 chances to guess a 5-letter word.
				</ThemedText>
			</Animated.View>

			<View style={styles.menu}>
				<Link
					href="/game"
					asChild
					style={[
						styles.btn,
						{ backgroundColor: colorScheme === "light" ? "#000" : "#4a4a4a" },
					]}
				>
					<AnimatedTouchableOpacity entering={FadeInLeft}>
						<Text style={[styles.btnText, styles.primaryText]}>Play</Text>
					</AnimatedTouchableOpacity>
				</Link>

				<SignedOut>
					<Link
						href="/login"
						style={[styles.btn, { borderColor: textColor }]}
						asChild
					>
						<AnimatedTouchableOpacity entering={FadeInLeft.delay(100)}>
							<ThemedText style={styles.btnText}>Log in</ThemedText>
						</AnimatedTouchableOpacity>
					</Link>
				</SignedOut>

				<SignedIn>
					<AnimatedTouchableOpacity
						entering={FadeInLeft.delay(200)}
						style={[styles.btn, { borderColor: textColor }]}
						onPress={() => signOut()}
					>
						<ThemedText style={styles.btnText}>Sign out</ThemedText>
					</AnimatedTouchableOpacity>
				</SignedIn>

				<AnimatedTouchableOpacity
					entering={FadeInLeft.delay(300)}
					style={[styles.btn, { borderColor: textColor }]}
					onPress={handlePresentSubscribeModal}
				>
					<ThemedText style={styles.btnText}>Subscribe</ThemedText>
				</AnimatedTouchableOpacity>
			</View>

			<Animated.View style={styles.footer} entering={FadeIn.delay(300)}>
				<ThemedText style={styles.footerDate}>
					{format(new Date(), "MMMM d, yyyy")}
				</ThemedText>
				<ThemedText style={styles.footerText}>No. 1151</ThemedText>
				<ThemedText style={styles.footerText}>Edited by Marios Knl</ThemedText>
			</Animated.View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		paddingHorizontal: 50,
		gap: 40,
	},
	header: {
		alignItems: "center",
		gap: 10,
	},
	title: {
		fontSize: 40,
		fontFamily: "FrankRuhlLibre_800ExtraBold",
	},
	text: {
		fontSize: 26,
		textAlign: "center",
		fontFamily: "FrankRuhlLibre_500Medium",
	},
	menu: {
		alignItems: "center",
		justifyContent: "center",
		gap: 10,
	},
	btn: {
		justifyContent: "center",
		borderRadius: 30,
		alignItems: "center",
		borderColor: "#000",
		borderWidth: 1,
		width: "60%",
		maxWidth: 200,
	},
	btnText: {
		padding: 14,
		fontSize: 16,
		fontWeight: "semibold",
		color: "#333",
	},
	primaryText: {
		color: "#fff",
	},
	footer: {
		alignItems: "center",
		justifyContent: "center",
	},
	footerText: {
		fontSize: 14,
	},
	footerDate: {
		fontSize: 14,
		fontWeight: "bold",
	},
});
