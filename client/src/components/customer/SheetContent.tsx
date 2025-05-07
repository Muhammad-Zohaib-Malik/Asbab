import { Image, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { RFValue } from "react-native-responsive-fontsize";

const cubes = [
  { name: "Bike", imageUri: require("@/assets/icons/bike.png") },
  { name: "Auto", imageUri: require("@/assets/icons/auto.png") },
  { name: "Cab Economy", imageUri: require("@/assets/icons/cab.png") },
  { name: "Parcel", imageUri: require("@/assets/icons/parcel.png") },
  { name: "Cab Premium", imageUri: require("@/assets/icons/cab_premium.png") },
  { name: "Truck", imageUri: require("@/assets/icons/truck.png") },
];

const SheetContent = () => {
  return (
    <View className="h-full px-4 pt-4">
      <TouchableOpacity
        className="flex-row items-center bg-gray-100 px-3 py-2 rounded-lg mb-4"
        onPress={() => router.navigate("/customer/selectlocations")}
      >
        <Ionicons name="search-outline" size={RFValue(16)} color="black" />
        <Text className="font-JakartaMedium text-base ml-2">
          Where are you going?
        </Text>
      </TouchableOpacity>

      <View className="flex-row flex-wrap">
        {cubes.map((item, index) => (
          <TouchableOpacity
            key={index}
            className="w-1/4 items-center mb-4"
            onPress={() => router.navigate("/customer/selectlocations")}
          >
            <View className="bg-gray-100 p-2 rounded-md mb-2">
              <Image source={item.imageUri} className="w-16 h-12" />
            </View>
            <Text className="font-JakartaMedium text-center text-xs">
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default SheetContent;
