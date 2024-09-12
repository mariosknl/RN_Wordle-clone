import OnScreenKeyboard from "@/components/OnScreenKeyboard";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, useColorScheme, View } from "react-native";

const ROWS = 6;

const Page = () => {
	const colorScheme = useColorScheme();
	const backgroundColor = Colors[colorScheme ?? "light"].gameBg;
	const textColor = Colors[colorScheme ?? "light"].text;
	const grayColor = Colors[colorScheme ?? "light"].gray;
	const router = useRouter();

	const [rows, setRows] = useState<string[][]>(
		new Array(ROWS).fill(new Array(5).fill(""))
	);
	const [curRow, setCurRow] = useState(0);
	const [curCol, setCurCol] = useState(0);

	const [greenLetters, setGreenLetters] = useState<string[]>([]);
	const [yellowLetters, setYellowLetters] = useState<string[]>([]);
	const [grayLetters, setGrayLetters] = useState<string[]>([]);

	const addKey = (key: string) => {
		console.log("add key", key);
	};

	return (
		<View style={[styles.container, { backgroundColor }]}>
			<Stack.Screen
				options={{
					headerRight: () => (
						<View style={styles.headerIcons}>
							<Ionicons
								name="help-circle-outline"
								size={28}
								color={textColor}
							/>
							<Ionicons name="podium-outline" size={28} color={textColor} />
							<Ionicons name="settings-sharp" size={28} color={textColor} />
						</View>
					),
				}}
			/>

			<View style={styles.gameField}>
				{rows.map((row, i) => (
					<View key={`row-${i}`} style={styles.gameFieldRow}>
						{row.map((cell, j) => (
							<View key={`row-${i}-${j}}`} style={styles.cell}>
								<Text style={[styles.cellText, { color: textColor }]}>
									{cell}
								</Text>
							</View>
						))}
					</View>
				))}
			</View>
			<OnScreenKeyboard
				onKeyPressed={addKey}
				greenLetters={greenLetters}
				yellowLetters={yellowLetters}
				grayLetters={grayLetters}
			/>
		</View>
	);
};

export default Page;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingVertical: 40,
	},
	gameField: {
		alignItems: "center",
		gap: 8,
	},
	gameFieldRow: {
		flexDirection: "row",
		gap: 8,
	},
	cell: {
		backgroundColor: "#fff",
		width: 62,
		height: 62,
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 2,
	},
	cellText: {
		fontSize: 30,
		textTransform: "uppercase",
		fontWeight: "bold",
	},
	headerIcons: {
		flexDirection: "row",
		gap: 10,
	},
});
