import { Colors } from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";
import { useOAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

enum Strategy {
	Google = "oauth_google",
	Apple = "oauth_apple",
	Facebook = "oauth_facebook",
}

const Page = () => {
	const router = useRouter();

	const { startOAuthFlow: googleAuth } = useOAuth({
		strategy: Strategy.Google,
	});
	const { startOAuthFlow: facebookAuth } = useOAuth({
		strategy: Strategy.Facebook,
	});
	const { startOAuthFlow: appleAuth } = useOAuth({ strategy: Strategy.Apple });

	const onSelecteAuth = async (strategy: Strategy) => {
		const selectedAuth = {
			[Strategy.Google]: googleAuth,
			[Strategy.Facebook]: facebookAuth,
			[Strategy.Apple]: appleAuth,
		}[strategy];

		try {
			const { createdSessionId, setActive } = await selectedAuth();

			if (createdSessionId) {
				setActive!({ session: createdSessionId });
				router.back();
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<ScrollView style={styles.container}>
			<Text style={styles.header}>Log in or create an account</Text>
			<Text style={styles.subText}>
				By continuing, you agree to our Terms of Service and Privacy Policy.
			</Text>

			<Text style={styles.inputLabel}>Email</Text>
			<TextInput style={styles.input} placeholder="Email" />

			<TouchableOpacity style={defaultStyles.btn}>
				<Text style={defaultStyles.btnText}>Continue</Text>
			</TouchableOpacity>

			<View style={styles.separatorView}>
				<View
					style={{
						borderBottomColor: "#000",
						borderBottomWidth: StyleSheet.hairlineWidth,
						flex: 1,
					}}
				></View>
				<Text style={styles.separator}>or</Text>
				<View
					style={{
						borderBottomColor: "#000",
						borderBottomWidth: StyleSheet.hairlineWidth,
						flex: 1,
					}}
				></View>
			</View>

			<View style={{ gap: 20 }}>
				<TouchableOpacity
					style={styles.btnOutline}
					onPress={() => googleAuth()}
				>
					<Ionicons
						name="logo-google"
						size={24}
						color="black"
						style={styles.btnIcon}
					/>
					<Text style={styles.btnOutlineText}>Continue with Google</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.btnOutline}
					onPress={() => facebookAuth()}
				>
					<Ionicons
						name="logo-facebook"
						size={24}
						color="black"
						style={styles.btnIcon}
					/>
					<Text style={styles.btnOutlineText}>Continue with Facebook</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.btnOutline} onPress={() => appleAuth()}>
					<Ionicons
						name="logo-apple"
						size={24}
						color="black"
						style={styles.btnIcon}
					/>
					<Text style={styles.btnOutlineText}>Continue with Apple</Text>
				</TouchableOpacity>
			</View>
		</ScrollView>
	);
};

export default Page;

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#fff",
		flex: 1,
		paddingHorizontal: 40,
	},
	header: {
		fontSize: 20,
		fontWeight: "bold",
		paddingTop: 30,
		paddingBottom: 20,
		textAlign: "center",
	},
	subText: {
		fontSize: 15,
		color: "#4f4f4f",
		textAlign: "center",
		marginBottom: 30,
	},
	inputLabel: {
		paddingBottom: 5,
		fontWeight: 500,
	},
	input: {
		height: 50,
		borderColor: "#ccc",
		borderWidth: 1,
		borderRadius: 4,
		paddingHorizontal: 10,
		marginBottom: 15,
	},
	separatorView: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
		marginVertical: 30,
	},
	separator: {
		fontSize: 16,
		color: Colors.light.gray,
	},
	btnOutline: {
		backgroundColor: "#fff",
		borderWidth: 1,
		borderColor: "#000",
		height: 50,
		borderRadius: 4,
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "row",
		paddingHorizontal: 10,
	},
	btnOutlineText: {
		color: "#000",
		fontSize: 16,
		fontWeight: "500",
	},
	btnIcon: {
		paddingRight: 10,
	},
});
