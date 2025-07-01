import { View } from "react-native";
import { homeStyles } from "@/styles/homeStyles";
import { StatusBar } from "expo-status-bar";
import LocationBar from "@/components/customer/LocationBar";
import { screenHeight } from "@/utils/Constants";
import DraggableMap from "@/components/customer/DraggableMap";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import SheetContent from "@/components/customer/SheetContent";
import { getMyRides } from "@/service/rideService";

const androidHeights = [screenHeight * 0.12, screenHeight * 0.42];

const Home = () => {
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => androidHeights, []);
  const [mapHeight, setMapHeight] = useState(snapPoints[0]);

  const handleSheetChanges = useCallback((index: number) => {
    let height = screenHeight * 0.8;
    if (index == 1) {
      height = screenHeight * 0.5;
    }
    setMapHeight(height);
  }, []);

  useEffect(() => {
    getMyRides();
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={homeStyles.container}>
        <StatusBar
          style="light"
          backgroundColor="#075BB5"
          translucent={false}
        />
        <LocationBar />

        <DraggableMap height={mapHeight} />

        <BottomSheet
          ref={bottomSheetRef}
          index={1}
          handleIndicatorStyle={{ backgroundColor: "#ccc" }}
          enableOverDrag={false}
          enableDynamicSizing={false}
          style={{ zIndex: 4 }}
          onChange={handleSheetChanges}
          snapPoints={snapPoints}
        >
          <BottomSheetScrollView
            contentContainerStyle={homeStyles.scrollContainer}
          >
            <SheetContent />
          </BottomSheetScrollView>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
};

export default Home;
