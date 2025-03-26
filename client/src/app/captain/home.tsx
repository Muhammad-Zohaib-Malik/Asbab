import { SafeAreaView, View } from 'react-native';
import React, { useState } from 'react';
// import Header from '@/components/captain/Header';

const Home = () => {
  const [isAvailable, setIsAvailable] = useState(true);

  const toggleAvailability = () => {
    setIsAvailable(!isAvailable);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header isOn={isAvailable} toggleSwitch={toggleAvailability} />
      <View className="flex-1">
        {/* Add your main content here */}
      </View>
    </SafeAreaView>
  );
};

export default Home;
