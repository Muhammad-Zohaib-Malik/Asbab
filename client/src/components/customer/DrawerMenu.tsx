import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "@/utils/Constants";

const { width, height } = Dimensions.get("window");

const DrawerMenu = ({ isOpen, onClose }: any) => {
  const translateX = useSharedValue(-width);

  useEffect(() => {
    translateX.value = withTiming(isOpen ? 0 : -width, { duration: 300 });
  }, [isOpen]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          left: 0,
          top: 0,
          width: width,
          height: height,
          backgroundColor: "white",
          padding: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.3,
          shadowRadius: 10,
          elevation: 5,
        },
        animatedStyle,
      ]}
    >
      {/* Close Button */}
      <TouchableOpacity onPress={onClose} style={{ marginBottom: 20, alignSelf: "flex-end" }}>
        <Ionicons name="close-outline" size={32} color={Colors.text} />
      </TouchableOpacity>

      {/* Drawer Items */}
      <View>
        <TouchableOpacity style={{ marginVertical: 10 }}>
          <Text style={{ fontSize: 18 }}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginVertical: 10 }}>
          <Text style={{ fontSize: 18 }}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginVertical: 10 }}>
          <Text style={{ fontSize: 18 }}>Settings</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default DrawerMenu;
