import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { useUserStore } from '../../store/userStore';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Setting = () => {
  const { setUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);

  // Handle logout (Only clears token)
  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem('token'); // Clear token from AsyncStorage
      setUser(null); // Clear user from state
      router.replace('/role'); // Navigate to role screen
    } catch (error: unknown) {
      console.log('Error logging out:', error);
      if (error instanceof Error) {
        Alert.alert('Error', error.message || 'Failed to logout.');
      } else {
        Alert.alert('Error', 'Failed to logout.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Show confirmation alert
  const confirmLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Do you really want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: handleLogout }
      ]
    );
  };

  return (
    <View className="items-center justify-center flex-1 bg-white">
      <Text className="mb-4 text-xl font-bold">Setting</Text>

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <TouchableOpacity
          className="px-4 py-2 bg-blue-600 rounded-lg"
          onPress={confirmLogout}
        >
          <Text className="font-bold text-white">Logout</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Setting;
