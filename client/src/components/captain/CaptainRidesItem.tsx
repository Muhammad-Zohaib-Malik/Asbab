import { acceptRideOffer } from "@/service/rideService";
import { useCaptainStore } from "@/store/captainStore";
import { orderStyles } from "@/styles/captainStyles";
import { commonStyles } from "@/styles/commonStyles";
import { calculateDistance, vehicleIcons } from "@/utils/mapUtils";
import { Ionicons } from "@expo/vector-icons";
import { FC, memo } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInLeft, FadeOutRight } from "react-native-reanimated";
import CounterButton from "./CounterButton";

type VehicleType = "bike" | "auto" | "cabEconomy" | "cabPremium";

interface RideItem {
  _id: string;
  vehicle?: VehicleType;
  pickup?: { address: string; latitude: number; longitude: number };
  drop?: { address: string; latitude: number; longitude: number };
  fare?: number;
  distance: number;
}

const CaptainRidesItem: FC<{ item: RideItem; removeIt: () => void }> = ({
  item,
  removeIt,
}) => {
  const { location } = useCaptainStore();
  const acceptRide = async () => {
    acceptRideOffer(item?._id);
  };
  return (
    <Animated.View
      entering={FadeInLeft.duration(500)}
      exiting={FadeOutRight.duration(500)}
      style={orderStyles.container}
    >
      <View style={commonStyles.flexRowBetween}>
        <View style={commonStyles.flexRow}>
          {item.vehicle && (
            <Image
              source={vehicleIcons![item.vehicle]?.icon}
              style={orderStyles.rideIcon}
            />
          )}
          <Text>{item?.vehicle}</Text>
        </View>
        <Text>#RID{item?._id?.slice(0, 5).toUpperCase()}</Text>
      </View>

      <View style={orderStyles?.locationsContainer}>
        <View style={orderStyles?.flexRowBase}>
          <View>
            <View style={orderStyles?.pickupHollowCircle} />
            <View style={orderStyles?.continuousLine} />
          </View>
          <View style={orderStyles?.infoText}>
            <Text numberOfLines={1}>{item?.pickup?.address?.slice(0, 10)}</Text>
            <Text numberOfLines={2} style={orderStyles.label}>
              {item?.pickup?.address}
            </Text>
          </View>
        </View>
      </View>

        <View style={orderStyles?.locationsContainer}>
            <View style={orderStyles?.flexRowBase}>
            <View>
                <View style={orderStyles?.dropHollowCircle} />
                <View style={orderStyles?.continuousLine} />
            </View>
            <View style={orderStyles?.infoText}>
                <Text numberOfLines={1}>{item?.drop?.address?.slice(0, 10)}</Text>
                <Text numberOfLines={2} style={orderStyles.label}>
                {item?.drop?.address}
                </Text>
            </View>
            </View> 

        </View>

          <View style={[commonStyles.flexRowGap]}>
            <View>
                <Text>Pickup</Text>
                <Text>{(location && (calculateDistance(
                    item?.pickup?.latitude ?? 0,
                    item?.pickup?.longitude ?? 0,
                    location?.latitude ?? 0,
                    location?.longitude ?? 0
                )).toFixed(2)) || "--"}{""}KM</Text>
            </View>

            <View style={orderStyles?.borderLine} >
                <Text style={orderStyles.label}>Drop</Text>
                <Text>{item?.distance.toFixed(2)}Km</Text>
            </View>
          </View>
         


        <View style={orderStyles?.flexRowEnd}>
            <TouchableOpacity>
                <Ionicons name="close-circle" size={24} color="black"/>
            </TouchableOpacity>

            <CounterButton onCountdownEnd={removeIt} initialCount={12} onPress={acceptRide} title="Accept"/>


        </View>
    </Animated.View>
  );
};

export default memo(CaptainRidesItem);
