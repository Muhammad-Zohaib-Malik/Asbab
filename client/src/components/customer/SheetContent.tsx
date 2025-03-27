import { Image, Text, TouchableOpacity, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { uiStyles } from "@/styles/uiStyles"
import { router } from "expo-router"
import { RFValue } from "react-native-responsive-fontsize"


const cubes = [
    { name: 'Bike', imageUri: require('@/assets/icons/bike.png') },
    { name: 'Auto', imageUri: require('@/assets/icons/auto.png') },
    { name: 'Cab Economy', imageUri: require('@/assets/icons/cab.png') },
    { name: 'Parcel', imageUri: require('@/assets/icons/parcel.png') },
    { name: "Cab Premium", imageUri: require('@/assets/icons/cab_premium.png') }

]

const SheetContent = () => {
    return (
        <View style={{ height: "100%" }}>
            <TouchableOpacity style={uiStyles.searchBarContainer} onPress={() => router.navigate("/customer/selectlocations")}>
                <Ionicons name="search-outline" size={RFValue(16)} color="black" />
                <Text className="font-JakartaMedium" style={{ fontSize: RFValue(16) }}>Where are you going?</Text>
            </TouchableOpacity>

            

            <View style={uiStyles.cubes}>
                {
                    cubes?.slice(0,4)?.map((item,index) => (
                        <TouchableOpacity style={uiStyles.cubeContainer} key={index} onPress={()=>router.navigate("/customer/selectlocations")}>
                        
                        <View style={uiStyles.cubeIconContainer}>
                            <Image source={item?.imageUri} style={uiStyles.cubeIcon} />
                        </View>
                        <Text className="font-JakartaMedium " style={{textAlign:'center'}} >{item?.name}</Text>

                        </TouchableOpacity>
                    ))
                }
                 
            </View>

        </View>
    )
}

export default SheetContent