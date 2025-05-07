import { useWS } from "@/service/WebProvider";
import { commonStyles } from "@/styles/commonStyles";
import { rideStyles } from "@/styles/rideStyles";
import { resetAndNavigate } from "@/utils/Helpers";
import { vehicleIcons } from "@/utils/mapUtils";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FC, useState, useEffect } from "react";
import { Image, Text, TouchableOpacity, View, Alert } from "react-native";
import RatingPopup from "@/components/customer/RatingPopup"; 
import { ratingRide } from "@/service/rideService";

type VehicleType = "bike" | "auto" | "cabEconomy" | "cabPremium" | "truck";

interface RideItem {
  vehicle?: VehicleType;
  _id: string;
  pickup?: { address: string };
  drop?: { address: string };
  fare?: number;
  otp: string;
  captain: any;
  status: string;
}

const LiveTrackingSheet: FC<{ item: RideItem }> = ({ item }) => {
  const { emit } = useWS();
  const [isCompleted, setIsCompleted] = useState(false); 
  const [showRatingPopup, setShowRatingPopup] = useState(false);

  useEffect(() => {
    
    if (item.status === "COMPLETED") {
      setIsCompleted(true); 
      setShowRatingPopup(true); 
    }
  }, [item.status]); 

  const submitRating = async (rating: number, review: string) => {
    const isSuccessful = await ratingRide(item._id, rating, review);
    if (isSuccessful) {
      setShowRatingPopup(false); 
    }
  };

  return (
    <View>
      {/* Ride Info */}
      <View style={rideStyles?.headerContainer}>
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
                ? "Captain Near You"
                : item?.status === "ARRIVED"
                ? "Happy Journey"
                : "WHOO🎉"}
            </Text>

            <Text>{item?.status === "START" ? `OTP - ${item?.otp}` : "🕶️"}</Text>
          </View>
        </View>

        {item?.captain?.phone && (
          <Text>
            +92
            {item?.captain?.phone?.slice(0, 5)  + item?.captain?.phone?.slice(5)}
          </Text>
        )}
      </View>

      {/* Ride Details */}
      <View style={{ padding: 10 }}>
        <Text className="font-JakartaMedium" style={{ fontSize: 16, marginBottom: 10 }}>
          Location details
        </Text>

        {/* Pickup Location */}
        <View style={[commonStyles.flexRowGap, { marginVertical: 15, width: "90%" }]}>
          <Image source={require("@/assets/icons/map_pin.png")} style={rideStyles.pinIcon} />
          <Text numberOfLines={2}>{item?.pickup?.address}</Text>
        </View>

        {/* Drop Location */}
        <View style={[commonStyles.flexRowGap, { marginVertical: 10, width: "90%" }]}>
          <Image source={require("@/assets/icons/drop_marker.png")} style={rideStyles.pinIcon} />
          <Text numberOfLines={2}>{item?.drop?.address}</Text>
        </View>

        {/* Payment Info */}
        <View style={{ marginVertical: 20 }}>
          <View style={[commonStyles.flexRowBetween]}>
            <View style={commonStyles.flexRow}>
              <MaterialCommunityIcons name="credit-card" size={24} color="black" />
              <Text className="font-JakartaMedium">Payment</Text>
            </View>
            <Text style={{ fontWeight: "bold" }}>
              RS { Math.ceil(Number(item.fare?.toFixed(2)))}
            </Text>
          </View>
          <Text style={{ color: "gray" }}>Payment via cash</Text>
        </View>
      </View>

      {/* Bottom Buttons */}
      <View style={rideStyles.bottomButtonContainer}>
        <TouchableOpacity
          style={rideStyles.cancelButton}
          onPress={() => {
            emit("cancelRide", item?._id);
          }}
        >
          <Text style={rideStyles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={rideStyles.backButton2}
          onPress={() => {
            if (item?.status === "COMPLETED") {
              resetAndNavigate("/customer/home");
            }
          }}
        >
          <Text style={rideStyles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>

      {/* Rating Popup */}
      {showRatingPopup && (
        <RatingPopup
          onSubmit={submitRating}
          onCancel={() => setShowRatingPopup(false)} 
        />
      )}
    </View>
  );
};

export default LiveTrackingSheet;
