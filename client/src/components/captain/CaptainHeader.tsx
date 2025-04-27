import { useWS } from "@/service/WebProvider";
import { useCaptainStore } from "@/store/captainStore";
import { useIsFocused } from "@react-navigation/native";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import * as Location from "expo-location";
import { useEffect } from "react";
import { rideStyles } from "@/styles/rideStyles";
import { SafeAreaView } from "react-native-safe-area-context";
import { commonStyles } from "@/styles/commonStyles";
import { MaterialIcons } from "@expo/vector-icons";
import { logout } from "@/service/authService";
import { riderStyles } from "@/styles/riderStyles";

const CaptainHeader = () => {
  const { disconnect, emit } = useWS();
  const { setOnDuty, onDuty, setLocation } = useCaptainStore();
  const isFocused = useIsFocused();

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
      emit("getOnDuty", {
        latitude: location?.coords?.latitude,
        longitude: location?.coords?.longitude,
        heading: heading,
      });
    } else {
      emit("getOffDuty");
    }
  };

  useEffect(() => {
    if (isFocused) {
      toggleDuty();
    }
  }, [onDuty, isFocused]);

  return (
    <>
      <View style={riderStyles.headerContainer}>
        <SafeAreaView />

        <View style={commonStyles.flexRowBetween}>
          <MaterialIcons
            name="menu"
            size={30}
            color="black"
            onPress={() => logout()}
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

      <View style={riderStyles?.earningContainer}>
        <Text style={{ color: "#fff" }}>Today's Earning</Text>
        <View style={commonStyles.flexRowGap}>
          <Text>RS 231.22</Text>

          <MaterialIcons name="arrow-drop-down" size={24} color="fff" />
        </View>
      </View>
    </>
  );
};

export default CaptainHeader;
