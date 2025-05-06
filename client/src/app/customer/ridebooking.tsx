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
        price: farePrices?.bike,
        icon: require("@/assets/icons/bike.png"),
      },
      {
        type: "Auto",
        seats: 3,
        price: farePrices?.auto,
        icon: require("@/assets/icons/auto.png"),
      },
      {
        type: "Cab Economy",
        seats: 5,
        price: farePrices?.cabEconomy,
        icon: require("@/assets/icons/cab.png"),
      },
      {
        type: "Cab Premium",
        seats: 4,
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

      <View className="px-1 ">
  <TouchableOpacity
    className="bg-blue-600 rounded-2xl py-4 items-center  active:opacity-80"
    disabled={loading}
    onPress={handleRideBooking}
  >
    <Text className="text-white font-semibold text-lg">
      {loading ? "Booking..." : "Book Ride"}
    </Text>
  </TouchableOpacity>
</View>
    </View>
  );
};

const RideOption = memo(({ ride, selected, onSelect }: any) => (
  <TouchableOpacity
    onPress={() => onSelect(ride?.type)}
    className={`border-2 rounded-xl p-4 mb-3 ${
      selected === ride.type ? "border-black" : "border-gray-300"
    }`}
  >
    <View className="flex-row justify-between items-center">
      {/* Icon and Ride Info */}
      <View className="flex-row items-center space-x-3">
        <Image
          source={ride?.icon}
          className="w-16 h-16 rounded-md"
          resizeMode="contain"
        />
        <View>
          <Text className="font-JakartaBold text-base">{ride?.type}</Text>
          <Text className="text-gray-500 font-JakartaMedium">{ride?.seats} seats</Text>
        </View>
      </View>

      {/* Pricing */}
      <View className="items-end">
        <Text className="text-base font-JakartaMedium text-black">
          RS {ride?.price?.toFixed(2)}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
));


export default memo(RideBooking);
