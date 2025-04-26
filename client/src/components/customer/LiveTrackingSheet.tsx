import { useWS } from "@/service/WebProvider";
import { commonStyles } from "@/styles/commonStyles";
import { rideStyles } from "@/styles/rideStyles";
import { resetAndNavigate } from "@/utils/Helpers";
import { vehicleIcons } from "@/utils/mapUtils";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FC } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

type VehcileType = "bike" | "auto" | "cabEconomy" | "cabPremium";

interface RideItem {
  vehicle?: VehcileType;
  _id: string;
  pickup?: { address: string };
  drop?: { address: string };
  fare?: number;
  otp: string;
  rider: any;
  status: string;
}

const LiveTrackingSheet: FC<{ item: RideItem }> = ({ item }) => {
  const { emit } = useWS();
  return (
    <View>
      <View style={rideStyles.headerContainer}>
        <View style={commonStyles.flexRowGap}>
          {item?.vehicle && (
            <Image
              source={vehicleIcons[item.vehicle]?.icon}
              style={rideStyles.rideIcon}
            />
          )}

          <View>
            <Text>
              {item?.status === "START"
                ? "Rider Near You"
                : item?.status === "ARRIVED"
                ? "HAPPY JOURNEY"
                : "WHOO"}
            </Text>
            <Text>{item?.status === "START" ? `OTP -${item?.otp}` : "🕶️"}</Text>
          </View>
        </View>

        {item?.rider?.phone && (
          <Text>
            +92{""}
            {item?.rider?.phone &&
              item?.rider?.phone?.slice(0, 5) +
                " " +
                item?.rider?.phone?.slice(5)}
          </Text>
        )}
      </View>

      <View style={{ padding: 10 }}>
        <Text>Location details</Text> //custom
        <View
          style={[
            commonStyles.flexRowGap,
            { marginVertical: 15, width: "90%" },
          ]}
        >
          <Image
            source={require("@/assets/icons/marker.png")}
            style={rideStyles.pinIcon}
          />
          <Text>{item?.pickup?.address}</Text> //custom
        </View>
        <View style={{ marginVertical: 20 }}>
          <View style={[commonStyles.flexRowBetween]}>
            <View style={commonStyles.flexRow}>
              <MaterialCommunityIcons
                name="credit-card"
                size={24}
                color="black"
              />
              <Text style={{ marginLeft: 10 }}>Payment</Text>
            </View>
            <Text>RS{item.fare?.toFixed(2)}</Text> //custom
          </View>
          <Text>Payment via cash</Text> //custom
        </View>
      </View>

      <View style={rideStyles?.bottomButtonContainer}>
        <TouchableOpacity
          style={rideStyles?.cancelButton}
          onPress={() => {
            emit("cancelRide", item?._id);
          }}
        >
          <Text style={rideStyles?.cancelButtonText}>Cancel</Text> //custom
        </TouchableOpacity>

        <TouchableOpacity
          style={rideStyles?.backButton2}
          onPress={() => {
            if (item?.status === "COMPLETED") {
              resetAndNavigate("/customer/home");
              return;
            }
          }}
        >
          <Text style={rideStyles.backButtonText}>Back</Text>//custom
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LiveTrackingSheet;
