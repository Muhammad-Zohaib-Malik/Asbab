import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useCaptainStore } from "@/store/captainStore";

const Setting = () => {
  const { setUser } = useCaptainStore();
  const [isLoading, setIsLoading] = useState(false);

  // Handle logout (Only clears token)
  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem("token"); // Clear token from AsyncStorage
      setUser(null); // Clear user from state
      router.replace("/role"); // Navigate to role screen
    } catch (error) {
      console.log("Error logging out:", error);
      if (error instanceof Error) {
        Alert.alert("Error", error.message || "Failed to logout.");
      } else {
        Alert.alert("Error", "Failed to logout.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Show confirmation alert
  const confirmLogout = () => {
    Alert.alert("Confirm Logout", "Do you really want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: handleLogout },
    ]);
  };

  return (
    <View className="items-center justify-center flex-1 bg-gray-100">
      <View
        className="w-11/12 p-5 bg-white rounded-3xl"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 5,
        }}
      >
        <Text className="mb-6 text-2xl font-bold text-center text-gray-800">
          Settings
        </Text>

        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <TouchableOpacity
            className="flex-row items-center justify-center px-4 py-3 bg-red-500 rounded-lg"
            onPress={confirmLogout}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 5,
              elevation: 3,
            }}
          >
            <Ionicons
              name="log-out-outline"
              size={24}
              color="white"
              className="mr-2"
            />
            <Text className="font-bold text-white">Logout</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Setting;
