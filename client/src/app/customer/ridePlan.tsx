import { customMapStyle, islamabadInitialRegion } from "@/utils/CustomMap";
import { useState } from "react";
import { KeyboardAvoidingView, View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

const RidePlan = () => {
  const [region, setRegion] = useState(
   islamabadInitialRegion
  );

  const [marker, setMarker] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  return (
    <KeyboardAvoidingView style={styles.container}>
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
      <View style={styles.bottomSection}>
        {/* Add additional UI elements here */}
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
  bottomSection: {
    height: "30%",
    backgroundColor: "white",
    padding: 16,
  },
});

export default RidePlan;
