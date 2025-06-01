import { useWS } from "@/service/WebProvider";
import { commonStyles } from "@/styles/commonStyles";
import { rideStyles } from "@/styles/rideStyles";
import { resetAndNavigate } from "@/utils/Helpers";
import { vehicleIcons } from "@/utils/mapUtils";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FC, useState, useEffect } from "react";
import { Image, Text, TouchableOpacity, View, Modal } from "react-native";
import RatingPopup from "@/components/customer/RatingPopup";
import { ratingRide } from "@/service/rideService";
import { useRouter } from "expo-router"; // ✅ Added for routing

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
  otp: string;
  captain: any;
  status: string;
}

const PaymentPopup: FC<{
  onSelect: (method: "cash" | "card") => void;
  onCancel: () => void;
}> = ({ onSelect, onCancel }) => {
  return (
    <Modal transparent animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 10,
            padding: 20,
            width: "100%",
            maxWidth: 300,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 15,
              textAlign: "center",
            }}
          >
            Select Payment Method
          </Text>

          <TouchableOpacity
            onPress={() => onSelect("cash")}
            style={{
              backgroundColor: "#4caf50",
              padding: 12,
              borderRadius: 6,
              marginBottom: 10,
            }}
          >
            <Text style={{ color: "white", textAlign: "center", fontSize: 16 }}>
              Cash
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onSelect("card")}
            style={{
              backgroundColor: "#2196f3",
              padding: 12,
              borderRadius: 6,
              marginBottom: 10,
            }}
          >
            <Text style={{ color: "white", textAlign: "center", fontSize: 16 }}>
              Card
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onCancel}
            style={{
              marginTop: 10,
              padding: 10,
            }}
          >
            <Text style={{ textAlign: "center", color: "red", fontSize: 14 }}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const LiveTrackingSheet: FC<{ item: RideItem }> = ({ item }) => {
  const { emit } = useWS();
  const router = useRouter(); // ✅ Hook to navigate

  const [isCompleted, setIsCompleted] = useState(false);
  const [showRatingPopup, setShowRatingPopup] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "cash" | "card" | null
  >(null);

  useEffect(() => {
    if (item.status === "COMPLETED") {
      setIsCompleted(true);
      setShowPaymentPopup(true);
    }
  }, [item.status]);

  const onPaymentSelect = (method: "cash" | "card") => {
    setSelectedPaymentMethod(method);
    setShowPaymentPopup(false);

    if (method === "cash") {
      setShowRatingPopup(true);
    } else if (method === "card") {
      router.push({
        pathname: "/customer/payment",
        params: {
          rideId: item._id,
          fare: item.fare?.toString() || "0",
        },
      });
    }
  };

  const submitRating = async (rating: number, review: string) => {
    const isSuccessful = await ratingRide(item._id, rating, review);
    if (isSuccessful) {
      setShowRatingPopup(false);
      resetAndNavigate("/customer/home");
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
            <Text className="font-JakartaMedium">
              {item?.status === "START"
                ? "Captain Near You"
                : item?.status === "ARRIVED"
                ? "Happy Journey"
                : "WHOO🎉"}
            </Text>

            <Text className="font-JakartaMedium">
              {item?.status === "START" ? `OTP - ${item?.otp}` : "🕶️"}
            </Text>
          </View>
        </View>

        {item?.captain?.phone && (
          <Text className="font-JakartaMedium">
            +92 {item?.captain?.phone?.slice(0, 5) + item?.captain?.phone?.slice(5)}
          </Text>
        )}
      </View>

      {/* Ride Details */}
      <View style={{ padding: 10 }}>
        <Text
          className="font-JakartaMedium"
          style={{ fontSize: 16, marginBottom: 10 }}
        >
          Location details
        </Text>

        {/* Pickup Location */}
        <View
          style={[
            commonStyles.flexRowGap,
            { marginVertical: 15, width: "90%" },
          ]}
        >
          <Image
            source={require("@/assets/icons/map_pin.png")}
            style={rideStyles.pinIcon}
          />
          <Text className="font-JakartaMedium" numberOfLines={2}>
            {item?.pickup?.address}
          </Text>
        </View>

        {/* Drop Location */}
        <View
          style={[
            commonStyles.flexRowGap,
            { marginVertical: 10, width: "90%" },
          ]}
        >
          <Image
            source={require("@/assets/icons/drop_marker.png")}
            style={rideStyles.pinIcon}
          />
          <Text className="font-JakartaMedium" numberOfLines={2}>
            {item?.drop?.address}
          </Text>
        </View>

        {/* Payment Info */}
        <View style={{ marginVertical: 20 }}>
          <View style={commonStyles.flexRowBetween}>
            <View style={commonStyles.flexRow}>
              <MaterialCommunityIcons
                name="credit-card"
                size={24}
                color="black"
              />
              <Text className="font-JakartaMedium">Payment</Text>
            </View>
            <Text className="font-JakartaMedium" style={{ fontWeight: "bold" }}>
              RS {Math.ceil(Number(item.fare?.toFixed(2)))}
            </Text>
          </View>

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
        </View>
      </View>

      {/* Payment Popup */}
      {showPaymentPopup && (
        <PaymentPopup
          onSelect={onPaymentSelect}
          onCancel={() => setShowPaymentPopup(false)}
        />
      )}

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
