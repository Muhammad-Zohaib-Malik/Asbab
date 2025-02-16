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
import { getLatLong, getPlacesSuggestions } from "@/utils/mapUtils";
import _, { set } from "lodash";
import * as Location from 'expo-location';
import axios from "axios";

const RidePlan = () => {
  const [region, setRegion] = useState(
    islamabadInitialRegion
  );

  const [marker, setMarker] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
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
      if (status !== 'granted') {
        alert("Location permission is required to use this feature. Please enable it in your device settings.");
        return;
      }
      const location = await Location.getCurrentPositionAsync({
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
      const suggestions = await getPlacesSuggestions(input);
      setPlaces(suggestions);
    } catch (error) {
      console.error('Error fetching places:', error);
    }
  }
  const fetchTravelTimes = async (origin: any, destination: any) => {
    const modes = ["driving", "walking", "bicycling", "transit"];
    let travelTimes = {
      driving: null,
      walking: null,
      bicycling: null,
      transit: null,
    } as any
    for (const mode of modes) {
      const params = {
        origin: `${origin.latitude},${origin.longitude}`,
        destination: `${destination.latitude},${destination.longitude}`,
        mode: mode,
        key: process.env.EXPO_PUBLIC_MAP_API_KEY
      } as any
      if (mode === "driving") {
        params.departure_time = "now"
      }
      try {
        const response = await axios.get(`https://maps.gomaps.pro/maps/api/distancematrix/json`, {
          params
        })
        const elements = response.data.rows[0].elements[0]
        if (elements.status === "OK") {
          travelTimes[mode] = elements.duration.text
        }
        else {
          console.warn(`No travel time for mode: ${mode}`);
        }
        setTravelTimes(travelTimes);
      } catch (error) {
        console.error('Error fetching travel times:', error);
      }
    }
  }

  const handlePlaceSelect = async (placeId: any) => {
    try {
      const details = await getLatLong(placeId);

      if (details) {
        setMarker({
          latitude: details.latitude,
          longitude: details.longitude,

        });
        setRegion({
          ...region,
          latitude: details.latitude,
          longitude: details.longitude,

        });
        // setQuery(details.address); // Update input with selected place's address
        setPlaces([]); // Clear the suggestions list
        setlocationSelected(true);
        setkeyboardAvoidingHeight(false);

        if (currentLocation) {
          await fetchTravelTimes(currentLocation, {
            latitude: details.latitude,
            longitude: details.longitude,
          })
        }
      }
    } catch (error) {
      console.error("Error selecting place:", error);
    }
  };


  const deboundedFetchPlaces = useCallback(_.debounce(fetchPlaces, 100), []);
  useEffect(() => {
    if (query.length > 2) {
      deboundedFetchPlaces(query);
    } else {
      setPlaces([]);
    }
  }, [query]);

  const handleInputChange = async (text: any) => {
    setQuery(text);
  };

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
                            20 min  dropoff
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
                          key: `${process.env.EXPO_PUBLIC_MAP_API_KEY}`,
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
