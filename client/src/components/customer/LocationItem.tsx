import { Image, Text, TouchableOpacity, View } from "react-native";
import { FC } from "react";
import { commonStyles } from "@/styles/commonStyles";
import { locationStyles } from "@/styles/locationStyles";
import { uiStyles } from "@/styles/uiStyles";
import { Ionicons } from "@expo/vector-icons";

const LocationItem: FC<{ item: any; onPress: () => void }> = ({
  item,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[commonStyles.flexRowBetween, locationStyles.container]}
    >
      <View style={commonStyles?.flexRow}>
        <Image
          source={require("@/assets/icons/map_pin.png")}
          style={uiStyles.mapPinIcon}
        />
        <View style={{ width: "83%" }}>
          <Text numberOfLines={1} className="font-JakartaMedium">
            {item?.title}
          </Text>
          <Text
            numberOfLines={1}
            className="font-JakartaMedium"
            style={{ opacity: 0.7, marginTop: 2 }}
          >
            {item?.description}{" "}
          </Text>
        </View>
      </View>
      <Ionicons name="heart-outline" size={24} color="#ccc" />
    </TouchableOpacity>
  );
};
export default LocationItem;
