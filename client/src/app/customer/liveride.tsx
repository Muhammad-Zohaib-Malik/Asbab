import LiveTrackingMap from "@/components/customer/LiveTrackingMap";
import SearchingRideSheet from "@/components/SearchingRideSheet";
import { useWS } from "@/service/WebProvider";
import { rideStyles } from "@/styles/rideStyles";
import { screenHeight } from "@/utils/Constants";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useRoute } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { memo, useCallback, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

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
