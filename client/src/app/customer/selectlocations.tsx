import LocationInput from "@/components/customer/LocationInput"
import LocationItem from "@/components/customer/LocationItem"
import { useUserStore } from "@/store/userStore"
import { commonStyles } from "@/styles/commonStyles"
import { homeStyles } from "@/styles/homeStyles"
import { uiStyles } from "@/styles/uiStyles"
import { Colors } from "@/utils/Constants"
import { calculateDistance, getLatLong, getPlacesSuggestions } from "@/utils/mapUtils"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import { StatusBar } from "expo-status-bar"
import React, { useEffect, useState } from "react"
import { Image, Text, TouchableOpacity, View } from "react-native"
import { FlatList } from "react-native-gesture-handler"
import { SafeAreaView } from "react-native-safe-area-context"
import MapPickerModel from "@/components/customer/MapPickerModel"

const LocationSelection = () => {
    const { location, setLocation } = useUserStore()
    const [pickup, setPickup] = useState("")
    const [drop, setDrop] = useState("")
    const [locations, setLocations] = useState([])
    const [focusedInput, setFocusedInput] = useState("drop")
    const [modalTitle, setModalTitle] = useState("drop")
    const [isMapModalVisible, setMapModalVisible] = useState(false)
    const [pickupCoords, setPickupCoords] = useState<any>(null)
    const [dropCoords, setDropCoords] = useState<any>(null)

    const fetchLocation = async (query: string) => {
        if (query?.length > 4) {
            const data = await getPlacesSuggestions(query)
            setLocations(data)
        }
    }

    const addLocation = async (id: string) => {
        const data = await getLatLong(id)
        if (data) {
            if (focusedInput === "drop") {
                setDrop(data?.address)
                setDropCoords(data)
            }
            else {
                setLocation(data)
                setPickupCoords(data)
                setPickup(data?.address)
            }
        }
    }

    const renderLocations = ({ item }: any) => {
        return (
            <LocationItem item={item} onPress={() => addLocation(item?.place_id)} />
        )
    }


    const checkDistance = async () => {

        if (!pickupCoords || !dropCoords) return
        const { latitude: lat1, longitude: lon1 } = pickupCoords
        const { latitude: lat2, longitude: lon2 } = dropCoords
        if (lat1 === lat2 && lat1 === lon2) {
            alert("Pickup and drop location cannot be the same please select different locations")
            return
        }
        const distance = calculateDistance(lat1, lon1, lat2, lon2)
        const minDistance = 0.5
        const maxDistance = 50

        if (distance < minDistance) {
            alert("Pickup and drop location cannot be less than 0.5 km please select different locations")
        }
        else if (distance > maxDistance) {
            alert("Pickup and drop location cannot be more than 50 km please select different locations")
        }
        else {
            setLocations([])
            router.navigate({
                pathname: '/customer/ridebooking',
                params: {
                    distanceInKm: distance.toFixed(2),
                    drop_latitude: dropCoords.latitude,
                    drop_longitude: dropCoords.longitude,
                    drop_address: drop
                }
            })
            console.log(`Distance is valid ${distance.toFixed(2)}`)
        }
    }


    useEffect(() => {
        if (dropCoords && pickupCoords) {
            checkDistance()
        }
        else {
            setLocations([])
            setMapModalVisible(false)
        }
    }, [dropCoords, pickupCoords])


    useEffect(() => {

        if (location) {
            setPickupCoords(location)
            setPickup(location?.address)
        }
    }, [location])


    return (
        <View style={homeStyles.container}>
            <StatusBar style="light" backgroundColor="#075BB5" translucent={false} />
            <SafeAreaView />
            <TouchableOpacity style={commonStyles.flexRow} onPress={() => router.back()}>
                <Ionicons name="chevron-back" size={24} color={Colors.iosColor} />
                <Text className="font-JakartaMedium" style={{ color: Colors.iosColor }}>Back</Text>
            </TouchableOpacity>

            <View style={uiStyles.locationInputs}>
                <LocationInput
                    placeholder="Search Pickup Location"
                    type="pickup"
                    value={pickup}
                    onChangeText={(text) => {
                        setPickup(text)
                        fetchLocation(text)
                    }}
                    onFocus={() => setFocusedInput("pickup")}
                />
                <LocationInput
                    placeholder="Drop Location"
                    type="drop"
                    value={drop}
                    onChangeText={(text) => {
                        setDrop(text)
                        fetchLocation(text)
                    }}
                    onFocus={() => setFocusedInput("drop")}
                />

                <Text className="font-JakartaMedium" style={uiStyles.suggestionText}>suggestions</Text>
            </View>

            <FlatList
                data={locations}
                renderItem={renderLocations}
                keyExtractor={(item: any) => item.place_id}
                initialNumToRender={5}
                windowSize={5}
                ListFooterComponent={
                    <TouchableOpacity
                        style={[commonStyles.flexRow, uiStyles.container]}
                        onPress={() => {
                            setModalTitle(focusedInput);
                            setMapModalVisible(true);
                        }}
                    >
                        <Image source={require('@/assets/icons/map_pin.png')} style={uiStyles.mapPinIcon} />
                        <Text className="font-JakartaMedium" style={uiStyles.mapPinIcon}>Select From Map</Text>
                    </TouchableOpacity>
                }
            />

            {
                isMapModalVisible && (
                    <MapPickerModel
                        selectedLocation={{
                            latitude:
                                focusedInput === "drop"
                                    ? dropCoords?.latitude
                                    : pickupCoords?.latitude,
                            longitude:
                                focusedInput === "drop"
                                    ? dropCoords?.logitude
                                    : pickupCoords?.logitude,
                            address: focusedInput === "drop" ? drop : pickup
                        }}
                        title={modalTitle}
                        visible={isMapModalVisible}
                        onClose={() => setMapModalVisible(false)}
                        onSelectLocation={(data) => {
                            if (data) {
                                if (modalTitle === "drop") {
                                    setDrop(data?.address)
                                    setDropCoords(data)
                                }
                                else {
                                    setLocation(data)
                                    setPickupCoords(data)
                                    setPickup(data?.address)
                                }

                            }
                        }}
                    />
                )
            }

        </View>
    )
}

export default LocationSelection