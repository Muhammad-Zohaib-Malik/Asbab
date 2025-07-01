import { Colors } from "@/utils/Constants";
import { FC } from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";

interface CounterButtonProps {
  title: string;
  onPress: () => void;
  initialCount: number;
  onCountdownEnd: () => void;
}

const CounterButton: FC<CounterButtonProps> = ({
  title,
  onPress,
  initialCount,
  onCountdownEnd,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Text style={styles.text}>{title}</Text>
      <View style={styles.counter}>
        <CountdownCircleTimer
          onComplete={onCountdownEnd}
          isPlaying
          duration={initialCount}
          size={30}
          colors={["#004777", "#F7B733", "#A30000", "#A30000"]}
          colorsTime={[12, 5, 2, 0]}
          strokeWidth={3}
        >
          {({ remainingTime }) => <Text>{remainingTime}</Text>}
        </CountdownCircleTimer>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 10,
    backgroundColor: Colors.header,
  },
  counter: {
    backgroundColor: "white",
    borderRadius: 50,
  },
  text: {
    color: "#fff",
    marginRight: 10,
  },
});

export default CounterButton;
