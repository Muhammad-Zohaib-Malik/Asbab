import { useWS } from "@/service/WebProvider";
import { commonStyles } from "@/styles/commonStyles";
import { rideStyles } from "@/styles/rideStyles";
import { vehicleIcons } from "@/utils/mapUtils";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { FC } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type VehicleType =
  | "bike"
  | "auto"
  | "cabEconomy"
  | "cabPremium"
  | "truck"
  | "van";

interface RideItem {
  vehicle?: VehicleType;
  _id: string;
  pickup?: { address: string };
  drop?: { address: string };
  fare?: number;
}

const SearchingRideSheet: FC<{ item: RideItem }> = ({ item }) => {
  const { emit } = useWS();

  return (
    <View>
      <View style={rideStyles?.headerContainer}>
        <View style={commonStyles.flexRowBetween}>
          {item?.vehicle && (
            <Image
              source={vehicleIcons[item.vehicle]?.icon}
              style={rideStyles?.rideIcon}
            />
          )}

          <View style={{ marginLeft: 10 }}>
            <Text className="font-JakartaMedium">Looking for You</Text>
            <Text className="font-JakartaMedium">{item?.vehicle} Ride</Text>
          </View>
        </View>
        <ActivityIndicator color="black" size="small" />
      </View>

      <View style={{ padding: 10 }}>
        <Text className="font-JakartaMedium"> Location Details</Text>
        <View
          style={[
            commonStyles?.flexRowGap,
            { marginVertical: 15, width: "90%" },
          ]}
        >
          <Image
            source={require("@/assets/icons/map_pin.png")}
            style={rideStyles?.pinIcon}
          />
          <Text className="font-JakartaMedium" numberOfLines={2}>
            {item?.pickup?.address}
          </Text>
        </View>
        <View style={[commonStyles?.flexRowGap, { width: "90%" }]}>
          <Image
            source={require("@/assets/icons/drop_marker.png")}
            style={rideStyles?.pinIcon}
          />
          <Text className="font-JakartaMedium" numberOfLines={2}>
            {item?.drop?.address}
          </Text>
        </View>

        <View style={{ marginVertical: 20 }}>
          <View style={[commonStyles.flexRowBetween]}>
            <View style={[commonStyles.flexRow]}>
              <MaterialCommunityIcons
                name="credit-card"
                size={20}
                color="black"
              />
              <Text className="font-JakartaMedium" style={{ marginLeft: 10 }}>
                Payment
              </Text>
            </View>
            <Text className="font-JakartaMedium">
              RS {item?.fare ? Math.ceil(Number(item.fare.toFixed(2))) : 0}
            </Text>
          </View>
          <View style={rideStyles?.bottomButtonContainer}>
            <TouchableOpacity
              style={rideStyles?.cancelButton}
              onPress={() => {
                emit("cancelRide", item?._id);
                console.log("Cancel");
              }}
            >
              <Text
                className="font-JakartaMedium"
                style={rideStyles?.cancelButtonText}
              >
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={rideStyles?.backButton2}
              onPress={() => router.back()}
            >
              <Text
                className="font-JakartaMedium"
                style={rideStyles.backButtonText}
              >
                Back
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SearchingRideSheet;
