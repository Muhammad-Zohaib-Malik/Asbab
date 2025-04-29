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

type VehicleType = "bike" | "auto" | "cabEconomy" | "cabPremium";

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
            <Text>Looking for You</Text>
            <Text>{item?.vehicle} Ride</Text>
          </View>
        </View>
        <ActivityIndicator color="black" size="small" />
      </View>

      <View style={{ padding: 10 }}>
        <Text> Location Details</Text>
        <View
          style={[
            commonStyles?.flexRowGap,
            { marginVertical: 15, width: "90%" },
          ]}
        >
          <Image
            source={require("@/assets/icons/marker.png")}
            style={rideStyles?.pinIcon}
          />
          <Text numberOfLines={2}>{item?.pickup?.address}</Text>
        </View>
        <View style={[commonStyles?.flexRowGap, { width: "90%" }]}>
          <Image
            source={require("@/assets/icons/drop_marker.png")}
            style={rideStyles?.pinIcon}
          />
          <Text numberOfLines={2}>{item?.drop?.address}</Text>
        </View>

        <View style={{ marginVertical: 20 }}>
          <View style={[commonStyles.flexRowBetween]}>
            <View style={[commonStyles.flexRow]}>
              <MaterialCommunityIcons
                name="credit-card"
                size={20}
                color="black"
              />
              <Text style={{ marginLeft: 10 }}>Payment</Text>
            </View>
            <Text>RS{item?.fare?.toFixed(2)}</Text>
          </View>
          <Text>Payment via cash</Text>
        </View>
      </View>

      <View style={rideStyles?.bottomButtonContainer}>
        <TouchableOpacity
          style={rideStyles?.cancelButton}
          onPress={() => {
            emit("cancelRide", item?._id);
            console.log("Cancel");
          }}
        >
          <Text style={rideStyles?.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={rideStyles?.backButton2}
          onPress={() => router.back()}
        >
          <Text style={rideStyles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
    
  );
};

export default SearchingRideSheet;
