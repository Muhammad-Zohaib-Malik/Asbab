import { View, Image, Text, TouchableOpacity } from 'react-native';

const TransportItem = () => {
  const transportData = [
    { image: require('@/assets/images/parcel.png'), label: 'Parcel' },
    { image: require('@/assets/images/auto.png'), label: 'Auto' },
    { image: require('@/assets/images/cab-economy.png'), label: 'Car' },
    { image: require('@/assets/images/motorbike.png'), label: 'Bike' },
  ];

  return (
    <View className="flex-row items-center justify-between mt-4">
      {transportData.map((item, index) => (
        <TouchableOpacity key={index} className="items-center">
          <View className="p-3 bg-gray-100 rounded-lg">
            <Image source={item.image} className="w-16 h-16" />
          </View>
          <Text
            style={{
              backgroundColor: '#0755BB',
              color: 'white',
              paddingHorizontal: 12,
              paddingVertical: 5,
              borderRadius: 10,
              marginTop: 8,
            }}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default TransportItem;
