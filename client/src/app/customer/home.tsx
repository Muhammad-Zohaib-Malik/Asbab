import { View, Text, TouchableOpacity, Image } from 'react-native';
import { homeStyles } from '@/styles/homeStyles';
import { StatusBar } from 'expo-status-bar';
import LocationBar from '@/components/customer/LocationBar';
import TransportItem from '@/components/customer/TransportItem';


const Home = () => {
  return (
    <View style={homeStyles.container}>
      <StatusBar style="light" backgroundColor="#075BB5" translucent={false} />
      <LocationBar />

      {/* Explorer and View All */}
      <View className="flex-1 p-4 mt-16">
        <View className="flex-row items-center justify-between">
          <Text className="text-xl font-JakartaMedium">Explore</Text>
          <TouchableOpacity>
            <Text className="text-base text-[#075BB5] font-JakartaMedium">View All</Text>
          </TouchableOpacity>
        </View>


        <TransportItem />


      </View>
    </View>
  );
};

export default Home;
