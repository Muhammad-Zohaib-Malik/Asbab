import LiveTrackingMap from "@/components/customer/LiveTrackingMap";
import LiveTrackingSheet from "@/components/customer/LiveTrackingSheet";
import SearchingRideSheet from "@/components/customer/SearchingRideSheet";
import { useWS } from "@/service/WebProvider";
import { rideStyles } from "@/styles/rideStyles";
import { screenHeight } from "@/utils/Constants";
import { resetAndNavigate } from "@/utils/Helpers";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useRoute } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";

const androidHeights = [screenHeight * 0.12, screenHeight * 0.42];

const LiveRide = () => {
  const { emit, on, off } = useWS();
  const [rideData, setRideData] = useState<any>(null);
  const [riderCoords, setriderCoords] = useState<any>(null);
  const route = useRoute() as any;
  const params = route?.params || {};
  const id = params.id;
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => androidHeights, []);
  const [mapHeight, setMapHeight] = useState(snapPoints[0]);
  const handleSheetChanges = useCallback((index: number) => {
    let height = screenHeight * 0.18;
    if (index == 1) {
      height = screenHeight * 0.5;
    }
    setMapHeight(height);
  }, []);

  useEffect(() => {
    if (id) {
      emit("subscribeRide", id);
      on("rideData", (data) => {
        setRideData(data);
        if (data?.staus === "SEARCHING_FOR_RIDER") {
          emit("searchrider", id);
        }
      });

      on("rideUpdate", (data) => {
        setRideData(data);
      });

      on("rideCanceled", (error) => {
        resetAndNavigate("/customer/home");
        Alert.alert("Ride Cancelled");
      });
      on("error", (error) => {
        resetAndNavigate("/customer/home");
        Alert.alert("Oh Dang! No Riders Found");
      });

      return () => {
        off("rideData");
        off("rideUpdate");
        off("rideCanceled");
        off("error");
      };
    }
  }, [id, emit, on, off]);

  useEffect(() => {
    if (rideData?.rider?._id) {
      emit("subscribeToriderLocation", rideData?.rider?._id);
      on("riderLocationUpdate", (data) => {
        setriderCoords(data);
      });
    }
    return () => {
      off("riderLocationUpdate");
    };
  }, [rideData]);

  return (
    <View style={rideStyles.container}>
      <StatusBar style="light" backgroundColor="#075BB5" translucent={false} />
      {rideData && (
        <LiveTrackingMap
          height={mapHeight}
          status={rideData?.status}
          drop={{
            lattitude: parseFloat(rideData?.drop?.latitude),
            longitude: parseFloat(rideData?.drop?.longitude),
          }}
          pickup={{
            lattitude: parseFloat(rideData?.pickup?.latitude),
            longitude: parseFloat(rideData?.pickup?.longitude),
          }}
          rider={
            riderCoords
              ? {
                  latitude: riderCoords.lattitude,
                  longitude: riderCoords.longitude,
                  heading: riderCoords.heading,
                }
              : {}
          }
        />
      )}

      {rideData ? (
        <BottomSheet
          ref={bottomSheetRef}
          index={1}
          handleIndicatorStyle={{ backgroundColor: "#ccc" }}
          enableOverDrag={false}
          enableDynamicSizing={false}
          style={{ zIndex: 4 }}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
        >
          <BottomSheetScrollView contentContainerStyle={rideStyles?.container}>
            {rideData?.status === "SEARCHING_FOR_RIDER" ? (
              <SearchingRideSheet item={rideData} />
            ) : (
              <LiveTrackingSheet item={rideData} />
            )}
          </BottomSheetScrollView>
        </BottomSheet>
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Fetching Information...</Text> // custom
          <ActivityIndicator color="black" size="small" />
        </View>
      )}
    </View>
  );
};

export default memo(LiveRide);
