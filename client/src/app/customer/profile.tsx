import { View, Text, TextInput, Image, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import { updateProfile } from "../../service/authService";  // Adjust the path as needed
import { useUserStore } from '../../store/userStore';

const Profile = () => {
  const { user, setUser } = useUserStore();

  const [localUser, setLocalUser] = useState({
    name: '',
    phone: '',
    role: ''
  });

  const [editingField, setEditingField] = useState('');

  useEffect(() => {
    if (user) {
      setLocalUser(user);
    }
  }, [user]);

  const handleChange = (field: string, value: string) => {
    setLocalUser(prevState => ({
      ...prevState,
      [field]: value
    }));
  };

  const handleUpdateProfile = async () => {
    try {
      await updateProfile({ name: localUser.name });

      setUser({
        ...user,
        name: localUser.name,

      });

      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.log("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile.");
    }
  };

  const toggleEdit = (field: string) => {
    if (editingField === field) {
      setEditingField(''); // Save and exit edit mode
      if (field === 'name') {
        handleUpdateProfile();
      }
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
          className="p-3 mb-4 border border-gray-300 rounded-lg font-JakartaMedium"
          placeholder="Enter your name"
          value={localUser.name}
          onChangeText={(text) => handleChange('name', text)}
        />
      ) : (
        <Text className="p-3 mb-4 border border-gray-300 rounded-lg font-JakartaMedium">{localUser.name}</Text>
      )}

      {/* Number Field (Read-Only) */}
      <View className="flex-row items-center mb-4">
        <Text className="text-lg font-JakartaMedium">Number</Text>
      </View>
      <Text className="p-3 mb-4 border border-gray-300 rounded-lg font-JakartaMedium">{localUser.phone}</Text>

      {/* Role Field (Now Read-Only) */}
      <View className="flex-row items-center mb-4">
        <Text className="text-lg font-JakartaMedium">Role</Text>
      </View>
      <Text className="p-3 mb-4 border border-gray-300 rounded-lg font-JakartaMedium">{localUser.role}</Text>
    </View>
  );
};

export default Profile;
