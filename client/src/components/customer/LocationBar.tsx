import { useState } from "react";
import { useWS } from "@/service/WebProvider";
import { useUserStore } from "@/store/userStore";
import { uiStyles } from "@/styles/uiStyles";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { RFValue } from "react-native-responsive-fontsize";
import { Colors } from "@/utils/Constants";
import { router } from "expo-router";
import DrawerMenu from "@/components/customer/DrawerMenu"



const LocationBar = () => {
  const { location } = useUserStore();
  const { disconnect } = useWS();
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  return (
    <View style={uiStyles.absoluteTop}>
      <SafeAreaView>
        <View style={uiStyles.container}>
          {/* Menu Button */}
          <TouchableOpacity onPress={() => setDrawerOpen(true)}>
            <Ionicons name="menu-outline" size={RFValue(18)} color={Colors.text} />
          </TouchableOpacity>

          {/* Location Button */}
          <TouchableOpacity
            style={uiStyles.locationBar}
            onPress={() => router.navigate("/customer/ridePlan")}
          >
            <View style={uiStyles.dot} />
            <Text className="font-JakartaMedium" numberOfLines={1} style={uiStyles.locationText}>
              {location?.address || "Getting Location..."}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Drawer Component */}
      <DrawerMenu isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)} />
    </View>
  );
};

export default LocationBar;
