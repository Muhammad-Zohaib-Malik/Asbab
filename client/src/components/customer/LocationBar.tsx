import { useWS } from "@/service/WebProvider"
import { useUserStore } from "@/store/userStore"
import { uiStyles } from "@/styles/uiStyles"
import { Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Ionicons from '@expo/vector-icons/Ionicons'
import { RFValue } from "react-native-responsive-fontsize"
import { Colors } from "@/utils/Constants"
import { router } from "expo-router"


const LocationBar = () => {
  const { location } = useUserStore()
  const { disconnect } = useWS()


  return (
    <View style={uiStyles.absoluteTop}>
      <SafeAreaView>
        <View style={uiStyles.container}>
          <TouchableOpacity>
            <Ionicons name="menu-outline" size={RFValue(18)} color={Colors.text} />
          </TouchableOpacity>

          <TouchableOpacity style={uiStyles.locationBar}
            onPress={() => router.navigate('/customer/selectlocation')}>
            <View style={uiStyles.dot} />

            <Text className="font-JakartaMedium" numberOfLines={1}  style={uiStyles.locationText}>
              {location?.address || "Getting Location..."}

            </Text>
          </TouchableOpacity>



        </View>

      </SafeAreaView>
    </View>
  )
}

export default LocationBar