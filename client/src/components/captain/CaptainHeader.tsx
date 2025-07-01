import { useWS } from "@/service/WebProvider";
import { useCaptainStore } from "@/store/captainStore";
import { useIsFocused } from "@react-navigation/native";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { rideStyles } from "@/styles/rideStyles";
import { SafeAreaView } from "react-native-safe-area-context";
import { commonStyles } from "@/styles/commonStyles";
import { MaterialIcons } from "@expo/vector-icons";
import { riderStyles } from "@/styles/riderStyles";
import DrawerMenu from "@/components/captain/DrawerMenu";
import { getTotalEarning } from "@/service/rideService";

const CaptainHeader = () => {
  const { disconnect, emit } = useWS();
  const { setOnDuty, onDuty, setLocation, user: captain } = useCaptainStore();
  const isFocused = useIsFocused();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [totalEarning, setTotalEarning] = useState<number>(0);

  const toggleDuty = async () => {
    if (onDuty) {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Location permission is required to go on duty");
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude, heading } = location.coords;
      setLocation({
        latitude: latitude,
        longitude: longitude,
        address: "SomeWhere",
        heading: heading as number,
      });
      emit("goOnDuty", {
        latitude: location?.coords?.latitude,
        longitude: location?.coords?.longitude,
        heading: heading,
      });
    } else {
      emit("goOffDuty");
    }
  };

  useEffect(() => {
    if (isFocused) {
      toggleDuty();
    }
  }, [onDuty, isFocused]);

  useEffect(() => {
    const fetchTotal = async () => {
      if (isFocused && captain?._id) {
        const total = await getTotalEarning(captain._id);
        setTotalEarning(total);
      }
    };

    fetchTotal();
  }, [isFocused, captain?._id]);

  return (
    <>
      <View style={riderStyles.headerContainer}>
        <SafeAreaView />

        <View style={commonStyles.flexRowBetween}>
          {/* ✅ Menu Icon opens drawer */}
          <MaterialIcons
            name="menu"
            size={30}
            color="black"
            onPress={() => setDrawerOpen(true)}
          />
          <TouchableOpacity
            style={riderStyles.toggleContainer}
            onPress={() => setOnDuty(!onDuty)}
          >
            <Text>{onDuty ? "ON-DUTY" : "OFF-DUTY"}</Text>
            <Image
              source={
                onDuty
                  ? require("@/assets/icons/switch_on.png")
                  : require("@/assets/icons/switch_off.png")
              }
              style={rideStyles.icon}
            />
          </TouchableOpacity>
          <MaterialIcons name="notifications" size={24} color="black" />
        </View>
      </View>

      <View style={riderStyles.earningContainer}>
        <Text className="font-JakartaSemiBold" style={{ color: "#fff" }}>
          Total Earning
        </Text>
        <View style={commonStyles.flexRowGap}>
          <Text className="font-JakartaSemiBold">RS {totalEarning} 💵 </Text>
        </View>
      </View>

      {/* ✅ DrawerMenu Component */}
      <DrawerMenu isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
};

export default CaptainHeader;
