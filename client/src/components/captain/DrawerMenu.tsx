import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

// Menu Items Array
const menuItems = [
  {
    label: "My Rides",
    icon: "car-outline",
    route: "/captain/myrides",
  },
  {
    label: "Profile",
    icon: "person-outline",
    route: "/captain/profile",
  },
  {
    label: "Complaints",
    icon: "chatbox-ellipses-outline",
    route: "/captain/complaint",
  },
  {
    label: "Settings",
    icon: "settings-outline",
    route: "/captain/setting",
  },
];

const DrawerMenu = ({ isOpen, onClose }: any) => {
  const router = useRouter();
  const translateX = useSharedValue(-width);

  useEffect(() => {
    translateX.value = withTiming(isOpen ? 0 : -width, { duration: 300 });
  }, [isOpen]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View
      className="absolute top-0 left-0 z-50 w-screen h-screen bg-white"
      style={[
        animatedStyle,
        {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 5,
        },
      ]}
    >
      {/* Close Button */}
      <TouchableOpacity onPress={onClose} className="self-end m-5">
        <Ionicons name="close-outline" size={32} color="black" />
      </TouchableOpacity>

      {/* Drawer Items */}
      <View className="px-3 py-2 space-y-6 gap-y-6">
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            className="flex-row items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}
            onPress={() => {
              onClose();
              router.navigate(item.route);
            }}
          >
            <View className="flex-row items-center gap-3 space-x-3">
              <Ionicons name={item.icon as any} size={24} color="blue" />
              <Text className="text-lg text-gray-800">{item.label}</Text>
            </View>
            <Ionicons name="chevron-forward" size={32} color="gray" />
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );
};

export default DrawerMenu;
