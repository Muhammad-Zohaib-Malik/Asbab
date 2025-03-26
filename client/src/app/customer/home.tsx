import { View } from 'react-native';
import { homeStyles } from '@/styles/homeStyles';
import { StatusBar } from 'expo-status-bar';
import LocationBar from '@/components/customer/LocationBar';
import { screenHeight } from '@/utils/Constants';
import DraggableMap from '@/components/customer/DraggableMap';
import { useCallback, useMemo, useRef, useState } from 'react';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import TransportItem from '@/components/customer/TransportItem';

const androidHeights = [screenHeight * 0.12, screenHeight * 0.42]


const Home = () => {

  const bottomSheetRef = useRef(null)
  const snapPoints = useMemo(() => androidHeights, [])
  const [mapHeight, setMapHeight] = useState(snapPoints[0])

  const handleSheetChanges = useCallback((index: number) => {
    let height = screenHeight * 0.8
    if (index == 1) {
      height = screenHeight * 0.5
    }
    setMapHeight(height)
  }, [])
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={homeStyles.container}>
        <StatusBar style="light" backgroundColor="#075BB5" translucent={false} />
        <LocationBar />

        <DraggableMap height={mapHeight} />
        {/* Explorer and View All */}
        {/* <View className="flex-1 p-4 mt-16">
          <View className="flex-row items-center justify-between">
            <Text className="text-xl font-JakartaMedium">Explore</Text>
            <TouchableOpacity>
              <Text className="text-base text-[#075BB5] font-JakartaMedium">View All</Text>
            </TouchableOpacity>
          </View>


          <TransportItem />


        </View> */}
        <BottomSheet
          ref={bottomSheetRef}
          index={1}
          handleIndicatorStyle={{ backgroundColor: "#ccc" }}
          enableOverDrag={false}
          style={{ zIndex: 4 }}
          onChange={handleSheetChanges}
          snapPoints={snapPoints}
        >
          <BottomSheetScrollView
            contentContainerStyle={homeStyles.scrollContainer}>
            {/* <SheetContent /> */}
            <View />
          </BottomSheetScrollView>

        </BottomSheet>


      </View>
    </GestureHandlerRootView>
  );
};

export default Home;
