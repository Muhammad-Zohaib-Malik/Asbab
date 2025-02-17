import { View, Text } from 'react-native';
import React from 'react';

const Home = () => {
  return (
    <View className="items-center justify-center flex-1 bg-gray-100">
      <View
        className="w-11/12 p-8 bg-white rounded-3xl"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 5,
        }}
      >
        <Text className="text-3xl font-bold text-center text-blue-600">
          Captain
        </Text>
        <Text className="mt-2 text-lg text-center text-gray-600">
          Welcome to the Home Screen!
        </Text>
      </View>
    </View>
  );
};

export default Home;
