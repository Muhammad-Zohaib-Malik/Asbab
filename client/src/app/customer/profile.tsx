import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import { updateProfile, updateProfilePic } from "../../service/authService";
import { useUserStore } from "../../store/userStore";

const Profile = () => {
  const { user, setUser } = useUserStore();

  const [localUser, setLocalUser] = useState({
    name: "",
    phone: "",
    role: "",
    profilePic: "",
  });

  const [editingField, setEditingField] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setLocalUser(user);
    }
  }, [user]);

  const handleChange = (field: string, value: string) => {
    setLocalUser((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      await updateProfile({ name: localUser.name });
      setUser({ ...user, name: localUser.name });
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.log("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleEdit = (field: string) => {
    if (editingField === field) {
      setEditingField("");
      if (field === "name") {
        handleUpdateProfile();
      }
    } else {
      setEditingField(field);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "You need to allow permission to select an image.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      const newProfilePic = await updateProfilePic(imageUri);
      if (newProfilePic) {
        setUser({ ...user, profilePic: newProfilePic });
      }
    }
  };

  return (
    <View className="flex-1 p-5 bg-white">
      {/* Loader */}
      {isLoading && (
        <View className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}

      {/* Profile Picture */}
      <View className="items-center mb-5">
        <TouchableOpacity onPress={pickImage}>
          <View className="w-32 h-32 overflow-hidden bg-gray-200 rounded-full">
            <Image
              source={{
                uri: localUser.profilePic || "https://via.placeholder.com/150",
              }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
        </TouchableOpacity>
      </View>

      <Text className="mb-5 text-2xl font-bold text-center">User Profile</Text>

      {/* Name Field */}
      <View className="flex-row items-center mb-4">
        <Text className="text-lg font-JakartaMedium">Name</Text>
        <TouchableOpacity className="ml-2" onPress={() => toggleEdit("name")}>
          {editingField === "name" ? (
            <Feather name="check" size={20} color="blue" />
          ) : (
            <Feather name="edit-2" size={20} color="gray" />
          )}
        </TouchableOpacity>
      </View>

      {editingField === "name" ? (
        <TextInput
          className="p-3 mb-4 border border-gray-300 rounded-lg font-JakartaMedium"
          placeholder="Enter your name"
          value={localUser.name}
          onChangeText={(text) => handleChange("name", text)}
        />
      ) : (
        <Text className="p-3 mb-4 border border-gray-300 rounded-lg font-JakartaMedium">
          {localUser.name}
        </Text>
      )}

      {/* Phone Number Field */}
      <View className="flex-row items-center mb-4">
        <Text className="text-lg font-JakartaMedium">Number</Text>
      </View>
      <Text className="p-3 mb-4 border border-gray-300 rounded-lg font-JakartaMedium">
        {localUser.phone}
      </Text>

      {/* Role Field */}
      <View className="flex-row items-center mb-4">
        <Text className="text-lg font-JakartaMedium">Role</Text>
      </View>
      <Text className="p-3 mb-4 border border-gray-300 rounded-lg font-JakartaMedium">
        {localUser.role}
      </Text>
    </View>
  );
};

export default Profile;
