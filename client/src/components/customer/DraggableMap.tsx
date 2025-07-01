import { Image, TouchableOpacity, View } from "react-native";
import React, { FC, useEffect, useRef, useState } from "react";
import MapView, { Marker, Region } from "react-native-maps";
import { customMapStyle, islamabadInitialRegion } from "@/utils/CustomMap";
import { useIsFocused } from "@react-navigation/native";
import { useUserStore } from "@/store/userStore";
import { useWS } from "@/service/WebProvider";
import { reverseGeocode } from "@/utils/mapUtils";
import haversine from "haversine-distance";
import { mapStyles } from "@/styles/mapStyles";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import * as Location from "expo-location";

const DraggableMap: FC<{ height: number }> = ({ height }) => {
  const isFocused = useIsFocused();
  const [markers, setMarkers] = useState<any[]>([]);
  const mapRef = useRef<MapView>(null);
  const { setLocation, location, outOfRange, setOutOfRange } = useUserStore();
  const { emit, on, off } = useWS();
  const MAX_DISTANCE_THRESHOLD = 1000;

  useEffect(() => {
    (async () => {
      if (isFocused) {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          // Fixed condition check
          try {
            const location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;
            mapRef.current?.fitToCoordinates([{ latitude, longitude }], {
              edgePadding: {
                top: 50,
                right: 50,
                bottom: 50,
                left: 50,
              },
              animated: true,
            });
            const newRegion = {
              latitude,
              longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            };
            handleRegionChangeComplete(newRegion);
          } catch (error) {
            console.log("Error getting location", error);
          }
        } else {
          console.log("Location permission not granted");
        }
      }
    })();
  }, [mapRef, isFocused]);

  //REALTIME NEARBY RIDERS

  // useEffect(() => {
  //   if (location?.latitude && location?.longitude && isFocused) {
  //     emit('subscribeToZone', {
  //       latitude: location.latitude,
  //       longitude: location.longitude
  //     })
  //     on("nearbyCaptains", (captains: any[]) => {
  //       const updatedMarkers = captains.map((captain) => ({
  //         id: captain.id,
  //         latitude: captain.coords.latitude,
  //         longitude: captain.coords.longitude,
  //         type: "captain",
  //         rotation: captain.coords.heading,
  //         visible: true
  //       }))
  //       setMarkers(updatedMarkers)
  //     })
  //   }
  //   return () => {
  //     off("nearbyCaptains")
  //   }
  // }, [location, emit, on, off, isFocused])

  // STIMULATING NEARBY RIDER

  const generateRandomMarkers = () => {
    if (!location?.latitude || !location?.longitude || outOfRange) return;
    const types = ["bike", "auto", "cab"];
    const newMarkers = Array.from({ length: 20 }, (_, index) => {
      const randomType = types[Math.floor(Math.random() * types.length)];
      const randomRotation = Math.floor(Math.random() * 360);
      return {
        id: index,
        latitude: location.latitude + (Math.random() - 0.5) * 0.01,
        longitude: location.longitude + (Math.random() - 0.5) * 0.01,
        type: randomType,
        rotation: randomRotation,
        visible: true,
      };
    });
    setMarkers(newMarkers);
  };

  useEffect(() => {
    generateRandomMarkers();
  }, [location]);

  const handleRegionChangeComplete = async (newRegion: Region) => {
    const address = await reverseGeocode(
      newRegion.latitude,
      newRegion.longitude,
    );
    setLocation({
      latitude: newRegion.latitude,
      longitude: newRegion.longitude,
      address,
    });

    const userLocation = {
      latitude: location?.latitude,
      longitude: location?.longitude,
    } as any;
    if (userLocation) {
      const newLocation = {
        latitude: newRegion.latitude,
        longitude: newRegion.longitude,
      };
      const distance = haversine(userLocation, newLocation);
      setOutOfRange(distance > MAX_DISTANCE_THRESHOLD);
    }
  };

  const handleGspButtonPress = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      mapRef.current?.fitToCoordinates([{ latitude, longitude }], {
        edgePadding: {
          top: 50,
          right: 50,
          bottom: 50,
          left: 50,
        },
        animated: true,
      });
      const address = await reverseGeocode(latitude, longitude);
      setLocation({
        latitude,
        longitude,
        address,
      });
    } catch (error) {
      console.log("Error getting location", error);
    }
  };

  return (
    <View style={{ height: height, width: "100%" }}>
      <MapView
        ref={mapRef}
        maxZoomLevel={16}
        minZoomLevel={12}
        pitchEnabled={false}
        onRegionChangeComplete={handleRegionChangeComplete}
        initialRegion={islamabadInitialRegion}
        provider="google"
        customMapStyle={customMapStyle}
        showsMyLocationButton={false}
        showsCompass={false}
        showsIndoors={false}
        showsIndoorLevelPicker={false}
        showsTraffic={false}
        showsScale={false}
        showsBuildings={false}
        showsPointsOfInterest={false}
        showsUserLocation={true}
        style={{ flex: 1, width: "100%", height: "100%" }}
      >
        {markers
          ?.filter(
            (marker: any) =>
              marker?.latitude && marker?.longitude && marker?.visible,
          )
          .map((marker: any, index: number) => (
            <Marker
              key={index}
              zIndex={index + 1}
              flat
              anchor={{ x: 0.5, y: 0.5 }}
              coordinate={{
                latitude: marker?.latitude,
                longitude: marker?.longitude,
              }}
            >
              <View
                style={{ transform: [{ rotate: `${marker?.rotation}deg` }] }}
              >
                <Image
                  source={
                    marker.type === "bike"
                      ? require("@/assets/icons/bike_marker.png")
                      : marker.type === "auto"
                        ? require("@/assets/icons/auto_marker.png")
                        : require("@/assets/icons/cab_marker.png")
                  }
                  style={{ height: 40, width: 40, resizeMode: "contain" }}
                />
              </View>
            </Marker>
          ))}
      </MapView>

      {/* Center Marker (Absolute Positioning) */}
      <View style={mapStyles.centerMarkerContainer}>
        <Image
          source={require("@/assets/icons/marker.png")}
          style={mapStyles.marker}
        />
      </View>

      {/* GPS Button */}
      <TouchableOpacity
        style={mapStyles.gpsButton}
        onPress={handleGspButtonPress}
      >
        <MaterialCommunityIcons
          name="crosshairs-gps"
          size={RFValue(24)}
          color="#3C75BE"
        />
      </TouchableOpacity>

      {/* Out of Range Indicator */}
      {outOfRange && (
        <View style={mapStyles.outOfRange}>
          <FontAwesome6 name="road-circle-exclamation" size={24} color="red" />
        </View>
      )}
    </View>
  );
};

export default DraggableMap;
