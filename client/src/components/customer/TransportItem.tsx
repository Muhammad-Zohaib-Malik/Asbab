import { View, Image, Text, TouchableOpacity } from 'react-native';

const TransportItem = () => {
  const transportData = [
    { image: require('@/assets/images/parcel.png'), label: 'Parcel' },
    { image: require('@/assets/images/Sherzore.png'), label: 'Loader' },
    { image: require('@/assets/images/cab-economy.png'), label: 'Car' },
    // { image: require('@/assets/images/motorbike.png'), label: 'Bike' },
    { image: require('@/assets/images/animal.png'), label: 'Animal' },
  ];

  return (
    <View className="flex-row flex-wrap justify-between mt-4">
      {transportData.map((item, index) => (
        <TouchableOpacity
          key={index}
          className="items-center mb-4"
          style={{ width: '23%' }} // Adjust width to fit 4 items per row
        >
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
              textAlign: 'center',
            }}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default TransportItem;
