import OnScreenKeyboard from "@/components/OnScreenKeyboard";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { allWords } from "@/utils/allWords";
import { words } from "@/utils/targetWords";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import SettingsModal from "@/components/SettingsModal";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  ZoomIn,
} from "react-native-reanimated";

const ROWS = 6;

const Page = () => {
  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme ?? "light"].gameBg;
  const textColor = Colors[colorScheme ?? "light"].text;
  const grayColor = Colors[colorScheme ?? "light"].gray;
  const router = useRouter();

  const [rows, setRows] = useState<string[][]>(
    new Array(ROWS).fill(new Array(5).fill("")),
  );
  const [curRow, setCurRow] = useState(0);
  const [curCol, _setCurCol] = useState(0);

  const [greenLetters, setGreenLetters] = useState<string[]>([]);
  const [yellowLetters, setYellowLetters] = useState<string[]>([]);
  const [grayLetters, setGrayLetters] = useState<string[]>([]);

  const settingsModalRef = useRef<BottomSheetModal>(null);
  const handlePresentSettingsModal = () => settingsModalRef.current?.present();

  // const [word, setWord] = useState<string>(
  // 	words[Math.floor(Math.random() * words.length)]
  // );

  const [word, setWord] = useState("simon");
  const wordLetters = word.split("");

  const colStateRef = useRef(curCol);
  const setCurCol = (col: number) => {
    colStateRef.current = col;
    _setCurCol(col);
  };

  const addKey = (key: string) => {
    console.log("addKey", key);
    const newRows = [...rows.map((row) => [...row])];

    if (key === "ENTER") {
      checkWord();
    } else if (key === "BACKSPACE") {
      if (colStateRef.current === 0) {
        newRows[curRow][0] = "";
        setRows(newRows);
        return;
      }
      newRows[curRow][colStateRef.current - 1] = "";

      setCurCol(colStateRef.current - 1);
      setRows(newRows);
      return;
    } else if (colStateRef.current >= newRows[curRow].length) {
      // End of Line, don't add key!
      return;
    } else {
      newRows[curRow][colStateRef.current] = key;
      setRows(newRows);
      setCurCol(colStateRef.current + 1);
    }
  };

  const checkWord = () => {
    const currentWord = rows[curRow].join("");

    if (currentWord.length < word.length) {
      shakeRow();
      return;
    }

    if (!allWords.includes(currentWord)) {
      console.log("not a word");
      shakeRow();
    }

    flipRow();

    const newGreen: string[] = [];
    const newYellow: string[] = [];
    const newGray: string[] = [];

    currentWord.split("").forEach((letter, index) => {
      if (letter === wordLetters[index]) {
        newGreen.push(letter);
      } else if (wordLetters.includes(letter)) {
        newYellow.push(letter);
      } else {
        newGray.push(letter);
      }
    });

    setGreenLetters([...greenLetters, ...newGreen]);
    setYellowLetters([...yellowLetters, ...newYellow]);
    setGrayLetters([...grayLetters, ...newGray]);

    setTimeout(() => {
      if (currentWord === word) {
        router.push(
          `/end?win=true&word=${word}&gameField=${JSON.stringify(rows)}`,
        );
      } else if (curRow + 1 >= rows.length) {
        router.push(
          `/end?win=false&word=${word}&gameField=${JSON.stringify(rows)}`,
        );
      }
    }, 1500);

    setCurRow(curRow + 1);
    setCurCol(0);
  };

  // Animations
  // Shake
  const offsetShakes = Array.from({ length: ROWS }, () => useSharedValue(0));

  const rowStyles = Array.from({ length: ROWS }, (_, index) =>
    useAnimatedStyle(() => {
      return {
        transform: [{ translateX: offsetShakes[index].value }],
      };
    }),
  );

  const shakeRow = () => {
    const TIME = 60;
    const OFFESET = 10;

    offsetShakes[curRow].value = withSequence(
      withTiming(-OFFESET, { duration: TIME / 2 }),
      withRepeat(withTiming(OFFESET, { duration: TIME }), 4, true),
      withTiming(0, { duration: TIME / 2 }),
    );
  };

  // Flip
  const tileRotates = Array.from({ length: ROWS }, () =>
    Array.from({ length: 5 }, () => useSharedValue(0)),
  );

  const cellBackgrounds = Array.from({ length: ROWS }, () =>
    Array.from({ length: 5 }, () => useSharedValue("transparent")),
  );

  const cellBorders = Array.from({ length: ROWS }, () =>
    Array.from({ length: 5 }, () => useSharedValue(Colors.light.gray)),
  );

  const tileStyles = Array.from({ length: ROWS }, (_, index) => {
    return Array.from({ length: 5 }, (_, tileIndex) =>
      useAnimatedStyle(() => {
        return {
          transform: [{ rotateX: `${tileRotates[index][tileIndex].value}deg` }],
          backgroundColor: cellBackgrounds[index][tileIndex].value,
          borderColor: cellBorders[index][tileIndex].value,
        };
      }),
    );
  });

  const flipRow = () => {
    const TIME = 300;
    const OFFSET = 90;

    tileRotates[curRow].forEach((tileStyle, index) => {
      tileStyle.value = withDelay(
        index * 100,
        withSequence(
          withTiming(OFFSET, { duration: TIME }),
          withTiming(0, { duration: TIME }),
        ),
      );
    });
  };

  const setCellColor = (cell: string, rowIndex: number, cellIndex: number) => {
    if (curRow > rowIndex) {
      if (wordLetters[cellIndex] === cell) {
        cellBackgrounds[rowIndex][cellIndex].value = withDelay(
          cellIndex * 200,
          withTiming(Colors.light.green),
        );
      } else if (wordLetters.includes(cell)) {
        cellBackgrounds[rowIndex][cellIndex].value = withDelay(
          cellIndex * 200,
          withTiming(Colors.light.yellow),
        );
      } else {
        cellBackgrounds[rowIndex][cellIndex].value = withDelay(
          cellIndex * 200,
          withTiming(grayColor),
        );
      }
    } else {
      cellBackgrounds[rowIndex][cellIndex].value = withTiming("transparent", {
        duration: 100,
      });
    }
  };

  const setBorderColor = (
    cell: string,
    rowIndex: number,
    cellIndex: number,
  ) => {
    if (curRow > rowIndex && cell !== "") {
      if (wordLetters[cellIndex] === cell) {
        cellBorders[rowIndex][cellIndex].value = withDelay(
          cellIndex * 200,
          withTiming(Colors.light.green),
        );
      } else if (wordLetters.includes(cell)) {
        cellBorders[rowIndex][cellIndex].value = withDelay(
          cellIndex * 200,
          withTiming(Colors.light.yellow),
        );
      } else {
        cellBorders[rowIndex][cellIndex].value = withDelay(
          cellIndex * 200,
          withTiming(grayColor),
        );
      }
    }
    return Colors.light.gray;
  };

  useEffect(() => {
    if (curRow === 0) return;

    rows[curRow - 1].map((cell, cellIndex) => {
      setCellColor(cell, curRow - 1, cellIndex);
      setBorderColor(cell, curRow - 1, cellIndex);
    });
  }, [curRow]);

  // WEB
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        addKey("ENTER");
      } else if (e.key === "Backspace") {
        addKey("BACKSPACE");
      } else if (e.key.length === 1) {
        addKey(e.key);
      }
    };

    if (Platform.OS === "web") {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      if (Platform.OS === "web") {
        document.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [curCol]);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <SettingsModal ref={settingsModalRef} />
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
              <TouchableOpacity onPress={handlePresentSettingsModal}>
                <Ionicons name="settings-sharp" size={28} color={textColor} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <View style={styles.gameField}>
        {rows.map((row, i) => (
          <Animated.View
            key={`row-${i}`}
            style={[styles.gameFieldRow, rowStyles[i]]}
          >
            {row.map((cell, j) => (
              <Animated.View
                entering={ZoomIn.delay(50 * j)}
                key={`row-${i}-${j}}`}
                style={[styles.cell, tileStyles[i][j]]}
              >
                <Text
                  style={[
                    styles.cellText,
                    { color: curRow > i ? "#fff" : textColor },
                  ]}
                >
                  {cell}
                </Text>
              </Animated.View>
            ))}
          </Animated.View>
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