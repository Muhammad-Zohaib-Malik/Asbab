import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Feather } from '@expo/vector-icons';

const Profile = () => {
  const [user, setUser] = useState({
    name: 'John Doe',
    number: '1234567890',
    role: 'User' // Static Role
  });

  const [editingField, setEditingField] = useState('');

  const handleChange = (field: any, value: any) => {
    setUser(prevState => ({
      ...prevState,
      [field]: value
    }));
  };

  const toggleEdit = (field: any) => {
    if (editingField === field) {
      setEditingField(''); // Save and exit edit mode
    } else {
      setEditingField(field); // Enable edit mode for the selected field
    }
  };

  return (
    <View className="flex-1 p-5 bg-white">
      {/* Profile Circle */}
      <View className="items-center mb-5">
        <View className="w-32 h-32 overflow-hidden bg-gray-200 rounded-full">
          <Image
            source={{ uri: 'https://via.placeholder.com/150' }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
      </View>

      <Text className="mb-5 text-2xl font-bold text-center">User Profile</Text>

      {/* Name Field */}
      <View className="flex-row items-center mb-4">
        <Text className="text-lg font-JakartaMedium">Name</Text>
        <TouchableOpacity
          className="ml-2"
          onPress={() => toggleEdit('name')}
        >
          {editingField === 'name' ? (
            <Feather name="check" size={20} color="blue" />
          ) : (
            <Feather name="edit-2" size={20} color="gray" />
          )}
        </TouchableOpacity>
      </View>

      {editingField === 'name' ? (
        <TextInput
          className="p-3 mb-4 border border-gray-300 rounded-lg"
          placeholder="Enter your name"
          value={user.name}
          onChangeText={(text) => handleChange('name', text)}
        />
      ) : (
        <Text className="p-3 mb-4 border border-gray-300 rounded-lg font-JakartaMedium">{user.name}</Text>
      )}

      {/* Number Field */}
      <View className="flex-row items-center mb-4">
        <Text className="text-lg font-JakartaMedium">Number</Text>
        <TouchableOpacity
          className="ml-2"
          onPress={() => toggleEdit('number')}
        >
          {editingField === 'number' ? (
            <Feather name="check" size={20} color="blue" />
          ) : (
            <Feather name="edit-2" size={20} color="gray" />
          )}
        </TouchableOpacity>
      </View>

      {editingField === 'number' ? (
        <TextInput
          className="p-3 mb-4 border border-gray-300 rounded-lg font-JakartaMedium"
          placeholder="Enter your number"
          value={user.number}
          onChangeText={(text) => handleChange('number', text)}
          keyboardType="numeric"
        />
      ) : (
        <Text className="p-3 mb-4 border border-gray-300 rounded-lg font-JakartaMedium">{user.number}</Text>
      )}

      {/* Role Field (Non-Editable) */}
      <View className="mb-4">
        <Text className="text-lg font-JakartaMedium">Role</Text>
        <Text className="p-3 mb-4 text-gray-600 bg-gray-100 border border-gray-300 rounded-lg font-JakartaMedium">
          {user.role}
        </Text>
      </View>
    </View>
  );
};

export default Profile;
