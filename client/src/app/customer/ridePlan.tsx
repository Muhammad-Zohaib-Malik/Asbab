import { customMapStyle, islamabadInitialRegion } from "@/utils/CustomMap";
import { useCallback, useEffect, useState } from "react";
import { KeyboardAvoidingView, View, StyleSheet, TouchableOpacity, Text, Pressable, ScrollView, Dimensions, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import 'react-native-get-random-values';
import { router } from "expo-router";
import { windowHeight, windowWidth } from "@/utils/Constants";
import { mapStyles } from "@/styles/mapStyles";
import _, { set } from "lodash";
import * as Location from 'expo-location';
import axios from "axios";
import { Toast } from "react-native-toast-notifications";
import { parseDuration } from "@/utils/time.duration";
import moment from "moment";
import { calculateDistance } from "@/utils/mapUtils";


type Coordinate = {
  latitude: number,
  longitude: number
}

const RidePlan = () => {
  const [region, setRegion] = useState(
    islamabadInitialRegion
  );

  const [marker, setMarker] = useState<Coordinate | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Coordinate | null>(null);
  const [keyboardAvoidingHeight, setkeyboardAvoidingHeight] = useState(false);
  const [places, setPlaces] = useState<any>([]);
  const [distance, setDistance] = useState<any>(null);
  const [selectedVehcile, setselectedVehcile] = useState("Car");
  const [query, setQuery] = useState("");
  const [locationSelected, setlocationSelected] = useState(false);
  const [loadingTravelTime, setLoadingTravelTime] = useState(false);

  const [travelTimes, setTravelTimes] = useState({
    driving: null,
    walking: null,
    bicycling: null,
    transit: null,
  });


  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Toast.show(
          "Please approve your location tracking otherwise you can't use this app!",
          {
            type: "danger",
            placement: "bottom",
          }
        );
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const { latitude, longitude } = location.coords;
      setCurrentLocation({ latitude, longitude });
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);


  const fetchPlaces = async (input: any) => {
    try {
      const response = await axios.get(
        `https://maps.gomaps.pro/maps/api/place/autocomplete/json`,
        {
          params: {
            input,
            key: process.env.EXPO_PUBLIC_MAP_API_KEY,
            language: "en",
          },
        }
      );
      setPlaces(response.data.predictions);
    } catch (error) {
      console.log(error);
    }
  };

  const debouncedFetchPlaces = useCallback(_.debounce(fetchPlaces, 100), []);

  useEffect(() => {
    if (query.length > 2) {
      debouncedFetchPlaces(query);
    } else {
      setPlaces([]);
    }
  }, [query, debouncedFetchPlaces]);

  const handleInputChange = async (text: any) => {
    setQuery(text);
  };

  const fetchTravelTimes = async (origin: any, destination: any) => {
    const modes = ["driving", "walking", "bicycling", "transit"];
    let travelTimes = {
      driving: null,
      walking: null,
      bicycling: null,
      transit: null,
    } as any;

    for (const mode of modes) {
      let params = {
        origins: `${origin.latitude},${origin.longitude}`,
        destinations: `${destination.latitude},${destination.longitude}`,
        key: process.env.EXPO_PUBLIC_MAP_API_KEY,
        mode: mode,
      } as any;

      if (mode === "driving") {
        params.departure_time = "now";
      }

      try {
        const response = await axios.get(
          `https://maps.gomaps.pro/maps/api/distancematrix/json`,
          { params }
        );

        const elements = response.data.rows[0].elements[0];
        if (elements.status === "OK") {
          travelTimes[mode] = elements.duration.text;
        }
      } catch (error) {
        console.log(error);
      }
    }

    setTravelTimes(travelTimes);
  };

  const handlePlaceSelect = async (placeId: any) => {
    try {
      const response = await axios.get(
        `https://maps.gomaps.pro/maps/api/place/details/json`,
        {
          params: {
            place_id: placeId,
            key: process.env.EXPO_PUBLIC_MAP_API_KEY,
          },
        }
      );
      const { lat, lng } = response.data.result.geometry.location;

      const selectedDestination = { latitude: lat, longitude: lng };
      setRegion({
        ...region,
        latitude: lat,
        longitude: lng,
      });
      setMarker({
        latitude: lat,
        longitude: lng,
      });
      setPlaces([]);

      setlocationSelected(true);
      setkeyboardAvoidingHeight(false);
      if (currentLocation) {
        await fetchTravelTimes(currentLocation, selectedDestination);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const calculateDistance = (lat1: any, lon1: any, lat2: any, lon2: any) => {
  //   var p = 0.017453292519943295; // Math.PI / 180
  //   var c = Math.cos;
  //   var a =
  //     0.5 -
  //     c((lat2 - lat1) * p) / 2 +
  //     (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;

  //   return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
  // };

  const getEstimatedArrivalTime = (travelTime: any) => {
    const now = moment();
    const travelMinutes = parseDuration(travelTime);
    const arrivalTime = now.add(travelMinutes, "minutes");
    return arrivalTime.format("hh:mm A");
  };

  useEffect(() => {
    if (marker && currentLocation) {
      const dist = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        marker.latitude,
        marker.longitude
      );
      setDistance(dist);
    }
  }, [marker, currentLocation]);




  return (
    <KeyboardAvoidingView style={mapStyles.container}>
      {/* Map Section (70% Height) */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={region}
          customMapStyle={customMapStyle}
          onRegionChangeComplete={(region) => setRegion(region)}
        >
          {marker && <Marker coordinate={marker} />}
          {currentLocation && <Marker coordinate={currentLocation} />}
          {currentLocation && marker && (
            <MapViewDirections
              origin={currentLocation}
              destination={marker}
              apikey={process.env.EXPO_PUBLIC_MAP_API_KEY!}
              strokeWidth={4}
              strokeColor="blue"
            />
          )}
        </MapView>
      </View>

      {/* Bottom Section (30% Height) */}
      <View className="justify-end flex-1">
        <View className="flex-1">
          {
            locationSelected ? (
              <View>
                <ScrollView style={{ paddingBottom: windowHeight(20), height: windowHeight(280) }}>
                  <View style={{ borderBottomWidth: 1, borderBottomColor: "#b5b5b5", paddingBottom: windowHeight(10), flexDirection: 'row' }}>
                    <Pressable onPress={() => setlocationSelected(false)}>
                      <Text>hello</Text>
                    </Pressable>
                    <Text className="m-auto text-[20px] text-bold">Gathering Option</Text>
                  </View>
                  <View style={{ padding: windowWidth(10) }}>
                    <Pressable style={{
                      width: Dimensions.get("screen").width * 1, borderWidth: selectedVehcile === "car" ? 2 : 0,
                      borderRadius: 10, padding: 10, marginVertical: 5
                    }} onPress={() => setselectedVehcile("car")}>
                      <View style={{ margin: "auto" }}>
                        <Image
                          source={require('@/assets/images/cab-economy.png')}
                          style={{ width: 90, height: 80 }}
                        />
                      </View>
                      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        <View>
                          <Text style={{ fontSize: 20, fontWeight: "600" }}>
                            Asbab x
                          </Text>
                          <Text style={{ fontSize: 16 }}>
                            {getEstimatedArrivalTime(travelTimes.driving)}{" "} dropoff
                          </Text>
                        </View>


                      </View>
                    </Pressable>
                  </View>
                </ScrollView>
              </View>
            ) : (
              <>
                <View className="flex flex-row items-center justify-between">
                  <TouchableOpacity onPress={() => router.back()}>
                    <AntDesign name="arrowleft" size={24} color="black" />
                  </TouchableOpacity>
                  <Text className="m-auto text-lg font-JakartaMedium">Ride Plan</Text>
                </View>

                <View style={{
                  borderColor: "#000",
                  borderWidth: 2,
                  borderRadius: 15,
                  marginBottom: windowHeight(20),
                  paddingHorizontal: windowHeight(3),
                  paddingVertical: windowHeight(20),
                }}>
                  <View className="flex flex-row items-center ">
                    <FontAwesome name="map-marker" size={32} color="blue" />
                    <View style={{ flex: 1, marginLeft: 5 }}>
                      <Text className="font-JakartaMedium text-[#075BB5]">Current Location</Text>
                      <GooglePlacesAutocomplete
                        placeholder="Where to?"
                        onPress={(data, details = null) => {
                          setkeyboardAvoidingHeight(true);
                          handlePlaceSelect(data.place_id)
                          setPlaces([
                            {
                              description: data.description,
                              details: details,
                            }
                          ]);
                        }}
                        query={{
                          key: `${process.env.EXPO_PUBLIC_MAP_API_KEY!}`,
                          language: 'en',
                        }}
                        styles={{
                          textInputContainer: {
                            width: '100%',
                          },
                          textInput: {
                            height: 40,
                            fontSize: 16,
                            color: '#000',
                            borderBottomWidth: 1,
                            borderColor: "#ccc",
                            paddingHorizontal: 1,
                            borderRadius: 10,
                            backgroundColor: "#fff",
                            textAlignVertical: "center",
                          },
                          predefinedPlacesDescription: {
                            color: '#1faadb'
                          }
                        }}
                        textInputProps={{
                          onChangeText: (text) => handleInputChange(text),
                          value: query,
                          onFocus: () => setkeyboardAvoidingHeight(true),
                        }}
                        onFail={(error) => console.log(error)}
                        fetchDetails={true}
                        debounce={200}
                      />
                    </View>
                  </View>
                </View>




                <ScrollView className="mt-4">
                  {places.map((place: any, index: number) => (
                    <Pressable
                      key={index}
                      className="flex-row items-center p-4 mb-2 bg-white rounded-lg shadow-sm"
                      onPress={() => handlePlaceSelect(place.place_id)}
                    >
                      <FontAwesome name="map-marker" size={24} color="#075BB5" />
                      <Text className="ml-3 text-black font-JakartaMedium">{place.description}</Text>

                    </Pressable>
                  ))}
                </ScrollView>
              </>
            )
          }
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: windowHeight(16),
    paddingVertical: windowHeight(12),
    borderStartStartRadius: windowHeight(16),
    borderStartEndRadius: windowHeight(16),
    borderTopRightRadius: windowHeight(16),
    borderTopLeftRadius: windowHeight(16),
  },
  mapContainer: {
    height: "70%",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

export default RidePlan;