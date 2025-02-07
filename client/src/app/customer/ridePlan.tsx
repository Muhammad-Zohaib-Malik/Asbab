import { customMapStyle, islamabadInitialRegion } from "@/utils/CustomMap";
import { useState } from "react";
import { KeyboardAvoidingView, View, StyleSheet, TouchableOpacity, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import 'react-native-get-random-values'; // Fix for crypto.getRandomValues()

const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_MAP_API_KEY;
console.log(GOOGLE_MAPS_API_KEY)


import { router } from "expo-router";
import { windowHeight } from "@/utils/Constants";
import { mapStyles } from "@/styles/mapStyles";


const RidePlan = () => {
  const [region, setRegion] = useState(
    islamabadInitialRegion
  );

  const [marker, setMarker] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [keyboardAvoidingHeight, setkeyboardAvoidingHeight] = useState(false);
  const [places, setPlaces] = useState<any>([]);
  const [query, setQuery] = useState("");
  const handleInputChange = (text: any) => {
    setQuery(text);
  }

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
              strokeColor="hotpink"
            />
          )}
        </MapView>
      </View>

      {/* Bottom Section (30% Height) */}
      <View className="flex-1 ">
        <View className="flex-1">
          <View className="flex flex-row items-center justify-between">
            <TouchableOpacity onPress={() => router.back()}>
              <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
            <Text className="m-auto text-lg font-JakartaMedium">Ride Plan</Text>
          </View>
        </View>

        <View style={{
          borderColor: "#000",
          borderWidth: 2,
          borderRadius: 15,
          marginBottom: windowHeight(10),
          paddingHorizontal: windowHeight(10),
          paddingVertical: windowHeight(10),
        }}>
          <View className="flex flex-row items-center m-1">
            <FontAwesome name="map-marker" size={32} color="blue" />
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text className="font-JakartaMedium text-[#075BB5]">Current Location</Text>
              <GooglePlacesAutocomplete
                placeholder="Where to?"
                onPress={(data, details = null) => {
                  setkeyboardAvoidingHeight(true);
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
                    height: 38,
                    fontSize: 16,
                    color: '#000',
                    borderBottomWidth: 1,
                    borderColor: "#ccc",
                    paddingHorizontal: 10,
                    borderRadius: 10,
                    backgroundColor: "#fff",
                    textAlignVertical: "center",
                  },
                  predefinedPlacesDescription: {
                    // color: '#1faadb'
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

      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
