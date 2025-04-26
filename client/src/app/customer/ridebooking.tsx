import RoutesMap from "@/components/customer/RoutesMap";
import { createRide } from "@/service/rideService";
import { useUserStore } from "@/store/userStore";
import { commonStyles } from "@/styles/commonStyles";
import { rideStyles } from "@/styles/rideStyles";
import { calculateFare } from "@/utils/mapUtils";
import { MaterialIcons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { memo, useCallback, useMemo, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const RideBooking = () => {
  const route = useRoute() as any;
  const item = route?.params as any;
  const { location } = useUserStore() as any;
  const [selectedOption, setSelectedOption] = useState("Bike");
  const [loading, setLoading] = useState(false);

  const farePrices = useMemo(() => {
    const distance = parseFloat(item?.distanceInKm);
    return calculateFare(isNaN(distance) ? 0 : distance);
  }, [item?.distanceInKm]);

  const rideOptions = useMemo(
    () => [
      {
        type: "Bike",
        seats: 1,
        time: "1 min",
        dropTime: "4:28 pm",
        price: farePrices?.bike,
        isFastest: true,
        icon: require("@/assets/icons/bike.png"),
      },
      {
        type: "Auto",
        seats: 3,
        time: "1 min",
        dropTime: "4:28 pm",
        price: farePrices?.auto,
        icon: require("@/assets/icons/auto.png"),
      },
      {
        type: "Cab Economy",
        seats: 5,
        time: "1 min",
        dropTime: "4:28 pm",
        price: farePrices?.cabEconomy,
        icon: require("@/assets/icons/cab.png"),
      },
      {
        type: "Cab Premium",
        seats: 4,
        time: "1 min",
        dropTime: "4:28 pm",
        price: farePrices?.cabPremium,
        icon: require("@/assets/icons/cab_premium.png"),
      },
    ],
    [farePrices]
  );

  const handleOptionsSelect = useCallback((type: string) => {
    setSelectedOption(type);
  }, []);

  const handleRideBooking = async () => {
    setLoading(true);
    await createRide({
      vehicle:
        selectedOption === "Cab Economy"
          ? "cabEconomy"
          : selectedOption === "Cab Premium"
          ? "cabPremium"
          : selectedOption === "Bike"
          ? "bike"
          : "auto",
      drop: {
        latitude: parseFloat(item.drop_latitude),
        longitude: parseFloat(item.drop_longitude),
        address: item.drop_address,
      },
      pickup: {
        latitude: parseFloat(location.latitude),
        longitude: parseFloat(location.longitude),
        address: location.address,
      },
    });

    setLoading(false);
  };

  return (
    <View style={rideStyles.container}>
      <StatusBar style="light" backgroundColor="#075BB5" translucent={false} />
      {item?.drop_latitude && location?.latitude && (
        <RoutesMap
          drop={{
            latitude: parseFloat(item?.drop_latitude),
            longitude: parseFloat(item?.drop_longitude),
          }}
          pickup={{
            latitude: parseFloat(location?.latitude),
            longitude: parseFloat(location?.longitude),
          }}
        />
      )}

      <View style={rideStyles.rideSelectionContainer}>
        {/* <View style={rideStyles?.offerContainer}>
                    <Text style={rideStyles?.offerText}>You Got RS 10 off 5 coins cashback</Text>
                </View> */}

        <ScrollView
          contentContainerStyle={rideStyles?.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {rideOptions?.map((ride, index) => (
            <RideOption
              key={index}
              ride={ride}
              selected={selectedOption}
              onSelect={handleOptionsSelect}
            />
          ))}
        </ScrollView>
      </View>

      <TouchableOpacity
        style={rideStyles.backButton}
        onPress={() => router.back()}
      >
        <MaterialIcons
          name="arrow-back-ios"
          size={RFValue(14)}
          style={{ left: 4 }}
          color="black"
        />
      </TouchableOpacity>

      <View style={rideStyles.bookingContainer}>
        <Text disabled={loading} onPress={handleRideBooking}>
          Book Ride
        </Text>
      </View>
    </View>
  );
};

const RideOption = memo(({ ride, selected, onSelect }: any) => (
  <TouchableOpacity
    onPress={() => onSelect(ride?.type)}
    style={[
      rideStyles.rideOption,
      { borderColor: selected === ride.type ? "#222" : "#dddd" },
    ]}
  >
    <View style={commonStyles.flexRowBetween}>
      <Image source={ride?.icon} style={rideStyles?.rideIcon} />
      <View>
        <Text>
          {ride?.type}
          {ride?.isFastest && (
            <Text style={rideStyles.fastestLabel}>Fastest</Text>
          )}
        </Text>
        <Text>
          {ride?.seats} seats {ride?.time} away Drop {ride?.dropTime}
        </Text>
      </View>

      <View style={rideStyles?.priceContainer}>
        <Text>RS{ride?.price?.toFixed(2)}</Text>
        {selected === ride.type && (
          <Text style={rideStyles?.discountedPrice}>
            RS{Number(ride?.price + 10).toFixed(2)}
          </Text>
        )}
      </View>
    </View>
  </TouchableOpacity>
));

export default memo(RideBooking);
