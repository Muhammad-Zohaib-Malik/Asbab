import { useUserStore } from "@/store/userStore";
import { modalStyles } from "@/styles/modalStyles";
import {
  getLatLong,
  getPlacesSuggestions,
  reverseGeocode,
} from "@/utils/mapUtils";
import { FC, memo, useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import MapView, { Region } from "react-native-maps";
import LocationItem from "./LocationItem";
import * as Location from "expo-location";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { customMapStyle, islamabadInitialRegion } from "@/utils/CustomMap";
import { mapStyles } from "@/styles/mapStyles";

interface MapPickerModelProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  selectedLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };
  onSelectLocation: (data: any) => void;
}

const MapPickerModel: FC<MapPickerModelProps> = ({
  visible,
  onClose,
  title,
  selectedLocation,
  onSelectLocation,
}) => {
  const mapRef = useRef<MapView>(null);
  const [text, setText] = useState("");
  const { location } = useUserStore();
  const [address, setAddress] = useState("");
  const [locationList, setLocationList] = useState([]);
  const [region, setRegion] = useState<Region | null>(null);
  const textInputRef = useRef<TextInput>(null);

  const fetchLocation = async (query: string) => {
    if (query?.length > 4) {
      const data = await getPlacesSuggestions(query);
      setLocationList(data);
    }
  };

  useEffect(() => {
    if (selectedLocation?.latitude) {
      setAddress(selectedLocation?.address);
      setRegion({
        latitude: selectedLocation?.latitude,
        longitude: selectedLocation?.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });

      mapRef.current?.fitToCoordinates(
        [
          {
            latitude: selectedLocation?.latitude,
            longitude: selectedLocation?.longitude,
          },
        ],
        {
          edgePadding: {
            top: 50,
            right: 50,
            bottom: 50,
            left: 50,
          },
          animated: true,
        },
      );
    }
  }, [selectedLocation, mapRef]);

  const addLocation = async (id: string) => {
    const data = await getLatLong(id);
    if (data) {
      setRegion({
        latitude: data?.latitude,
        longitude: data?.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
      setAddress(data?.address);
    }
    textInputRef.current?.blur();
    setText("");
  };

  const renderLocations = ({ item }: any) => {
    return (
      <LocationItem item={item} onPress={() => addLocation(item?.place_id)} />
    );
  };

  const handleRegionChangeComplete = async (newRegion: Region) => {
    try {
      const address = await reverseGeocode(
        newRegion.latitude,
        newRegion.longitude,
      );
      setAddress(address);
      setRegion(newRegion);
    } catch (error) {
      console.log("Error getting address", error);
    }
  };

  const handleGspButtonPress = async () => {
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
      const address = await reverseGeocode(latitude, longitude);
      setAddress(address);
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      });
    } catch (error) {
      console.log("Error getting location", error);
    }
  };

  return (
    <Modal
      animationType="slide"
      visible={visible}
      presentationStyle="formSheet"
      onRequestClose={onClose}
    >
      <View style={modalStyles.modalContainer}>
        <Text className="font-JakartaBold" style={modalStyles.centerText}>
          Select {title}
        </Text>
        <TouchableOpacity onPress={onClose}>
          <Text className="font-JakartaBold" style={modalStyles?.cancelButton}>
            Cancel
          </Text>
        </TouchableOpacity>

        <View style={modalStyles.searchContainer}>
          <Ionicons name="search-outline" size={RFValue(16)} color="#777" />
          <TextInput
            ref={textInputRef}
            style={modalStyles?.input}
            placeholder="Search Address"
            placeholderTextColor="#aaa"
            value={text}
            onChangeText={(e) => {
              setText(e);
              fetchLocation(e);
            }}
          />
        </View>

        {text !== "" ? (
          <FlatList
            ListHeaderComponent={
              <View>
                {text.length > 4 ? null : (
                  <Text style={{ marginHorizontal: 16 }}>
                    Enter at least 4 characters to search
                  </Text>
                )}
              </View>
            }
            data={locationList}
            renderItem={renderLocations}
            keyExtractor={(item: any) => item?.place_id}
            initialNumToRender={5}
            windowSize={5}
          />
        ) : (
          <>
            <View style={{ flex: 1, width: "100%", height: "100%" }}>
              <MapView
                ref={mapRef}
                maxZoomLevel={16}
                minZoomLevel={12}
                pitchEnabled={false}
                onRegionChangeComplete={handleRegionChangeComplete}
                initialRegion={islamabadInitialRegion}
                style={{ flex: 1 }}
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
              />

              <View style={mapStyles.centerMarkerContainer}>
                <Image
                  source={
                    title == "drop"
                      ? require("@/assets/icons/drop_marker.png")
                      : require("@/assets/icons/marker.png")
                  }
                  style={mapStyles.marker}
                />
              </View>

              <TouchableOpacity
                onPress={handleGspButtonPress}
                style={mapStyles.gpsButton}
              >
                <MaterialCommunityIcons
                  name="crosshairs-gps"
                  size={RFValue(24)}
                  color="#3C75BE"
                />
              </TouchableOpacity>
            </View>
            <View style={modalStyles.footerContainer}>
              <Text
                className="font-JakartaBold"
                style={modalStyles.addressText}
                numberOfLines={2}
              >
                {address === "" ? "Getting address ..." : address}
              </Text>

              <View style={modalStyles.buttonContainer}>
                <TouchableOpacity
                  style={modalStyles.button}
                  onPress={() => {
                    onSelectLocation({
                      type: title,
                      latitude: region?.latitude,
                      longitude: region?.longitude,
                      address: address,
                    });
                    onClose();
                  }}
                >
                  <Text
                    className="font-JakartaBold"
                    style={modalStyles?.buttonText}
                  >
                    Set Address
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </View>
    </Modal>
  );
};

export default memo(MapPickerModel);
