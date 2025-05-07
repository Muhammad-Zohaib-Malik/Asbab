import { mapStyles } from "@/styles/mapStyles";
import { customMapStyle, islamabadInitialRegion } from "@/utils/CustomMap";
import {
  FontAwesome,
  FontAwesome6,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { FC, memo, useEffect, useRef, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { RFValue } from "react-native-responsive-fontsize";
import MapViewDirections from "react-native-maps-directions";
import { Colors } from "@/utils/Constants";
import { getPoints } from "@/utils/mapUtils";

const apiKey = process.env.EXPO_PUBLIC_MAP_API_KEY || "";

const CaptainLiveTracking: FC<{
  drop: any;
  pickup: any;
  captain: any;
  status: string;
}> = ({ drop, status, pickup, captain }) => {
  const mapRef = useRef<MapView>(null);
  const [isUserInteracting, setIsUserInteracting] = useState(false);

  const fitToMarkers = async () => {
    if (isUserInteracting) return;

    const coordinates = [];

    if (pickup?.latitude && pickup?.longitude && status === "START") {
      coordinates.push({
        latitude: pickup.latitude,
        longitude: pickup.longitude,
      });
    }

    if (drop?.latitude && drop?.longitude && status === "ARRIVED") {
      coordinates.push({
        latitude: drop.latitude,
        longitude: drop.longitude,
      });
    }

    if (captain?.latitude && captain?.longitude) {
      coordinates.push({
        latitude: captain.latitude,
        longitude: captain.longitude,
      });
    }

    if (coordinates.length === 0) return;

    try {
      mapRef.current?.fitToCoordinates(coordinates, {
        edgePadding: {
          top: 50,
          right: 50,
          bottom: 50,
          left: 50,
        },
        animated: true,
      });
    } catch (error) {
      console.log("Error in fitToMarkers", error);
    }
  };

  const calculateInitialRegion = () => {
    if (pickup?.latitude && drop?.latitude) {
      const latitude = (pickup.latitude + drop.latitude) / 2;
      const longitude = (pickup.longitude + drop.longitude) / 2;
      return {
        latitude,
        longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
    }
    return islamabadInitialRegion;
  };

  const fitToMarkersWithDelay = () => {
    setTimeout(() => {
      fitToMarkers();
    }, 500);
  };

  useEffect(() => {
    if (pickup?.latitude && drop?.latitude) {
      fitToMarkers();
    }
  }, [pickup?.latitude, drop?.latitude, captain?.latitude]);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        followsUserLocation
        style={{ flex: 1 }}
        initialRegion={calculateInitialRegion()}
        provider="google"
        showsMyLocationButton={false}
        showsCompass={false}
        showsIndoors={false}
        customMapStyle={customMapStyle}
        showsUserLocation={true}
        onRegionChange={() => setIsUserInteracting(true)}
        onRegionChangeComplete={() => setIsUserInteracting(false)}
      >
        {captain?.latitude && pickup?.latitude && (
          <MapViewDirections
            origin={status === "START" ? pickup : captain}
            destination={status === "START" ? drop : pickup}
            onReady={fitToMarkersWithDelay}
            apikey={apiKey}
            strokeColor={Colors.iosColor}
            strokeColors={[Colors.iosColor]}
            strokeWidth={5}
            precision="high"
            onError={(error) => console.log("Directions error", error)}
          />
        )}

        {drop?.latitude && (
          <Marker
            coordinate={{ latitude: drop.latitude, longitude: drop.longitude }}
            anchor={{ x: 0.5, y: 1 }}
            zIndex={1}
          >
            <Image
              source={require("@/assets/icons/drop_marker.png")}
              style={{ height: 30, width: 30, resizeMode: "contain" }}
            />
          </Marker>
        )}

        {pickup?.latitude && (
          <Marker
            coordinate={{
              latitude: pickup.latitude,
              longitude: pickup.longitude,
            }}
            anchor={{ x: 0.5, y: 1 }}
            zIndex={2}
          >
            <Image
              source={require("@/assets/icons/marker.png")}
              style={{ height: 30, width: 30, resizeMode: "contain" }}
            />
          </Marker>
        )}

        {captain?.latitude && (
          <Marker
            coordinate={{
              latitude: captain.latitude,
              longitude: captain.longitude,
            }}
            anchor={{ x: 0.5, y: 1 }}
            zIndex={3}
          >
            <View
              style={{ transform: [{ rotate: `${captain?.heading || 0}deg` }] }}
            >
              <Image
                source={require("@/assets/icons/cab_marker.png")}
                style={{ height: 40, width: 40, resizeMode: "contain" }}
              />
            </View>
          </Marker>
        )}

        {drop && pickup && (
          <Polyline
            coordinates={getPoints([drop, pickup])}
            strokeColor={Colors.text}
            strokeWidth={2}
            geodesic={true}
            lineDashPattern={[12, 10]}
          />
        )}
      </MapView>


      <TouchableOpacity style={mapStyles.gpsButton} onPress={fitToMarkers}>
        <MaterialCommunityIcons
          name="crosshairs-gps"
          size={RFValue(16)}
          color="#3c75BE"
        />
      </TouchableOpacity>
    </View>
  );
};

export default memo(CaptainLiveTracking);
