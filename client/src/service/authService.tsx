import { useCaptainStore } from "@/store/captainStore";
import { useUserStore } from "@/store/userStore";
import { resetAndNavigate } from "@/utils/Helpers";
import axios from "axios";
import { Alert, Platform } from "react-native";
import { BASE_URL } from "./config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const signIn = async (payload: { role: 'customer' | 'captain', phone: string }, updateAccessToken: () => void) => {
  const { setUser } = useUserStore.getState();
  const { setUser: setCaptainUser } = useCaptainStore.getState();

  try {
    const res = await axios.post(`${BASE_URL}/auth/signin`, payload);

    if (res.data.user.role === "customer") {
      setUser(res.data.user);
    } else {
      setCaptainUser(res.data.user);
    }

    // Use AsyncStorage for storing tokens
    await AsyncStorage.setItem("access_token", res.data.access_token);
    await AsyncStorage.setItem("refresh_token", res.data.refresh_token);

    if (res.data.user.role === "customer") {
      resetAndNavigate("/customer/home");
    } else {
      resetAndNavigate("/captain/home");
    }
    updateAccessToken()
  } catch (error: any) {
    Alert.alert("Oh, no!", error?.response?.data?.msg || "Error in sign-in");
    console.log("Error:", error?.response?.data?.msg || "Error in sign-in");
  }
};



export const logout = async () => {
  const { clearData } = useUserStore.getState();
  const { clearCaptainData } = useCaptainStore.getState();

  try {
    // Get refresh token from AsyncStorage
    const refreshToken = await AsyncStorage.getItem('refresh_token');

    // Make request to backend to invalidate refresh token
    await axios.post(`${BASE_URL}/auth/logout`, {
      refresh_token: refreshToken
    });

    // Clear AsyncStorage
    await AsyncStorage.clear();

    // Clear state
    clearCaptainData();
    clearData();
  } catch (error) {
    console.log("Error during logout:", error);
    throw error;
  }
};


export const updateProfile = async (payload: { name: string }) => {
  try {
    const accessToken = await AsyncStorage.getItem("access_token");
    if (!accessToken) {
      Alert.alert("Error", "No access token found. Please log in again.");
      return;
    }

    console.log("Updating profile with:", payload);

    const res = await axios.put(`${BASE_URL}/auth/update-profile`, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("Response:", res.data);

    if (res.data.user.role === "customer") {
      useUserStore.getState().setUser(res.data.user);
    } else {
      useCaptainStore.getState().setUser(res.data.user);
    }

    Alert.alert("Profile Updated", "Your profile has been successfully updated.");
  } catch (error: unknown) {
    {
      if (axios.isAxiosError(error)) {
        console.log("Error:", error.response?.data || error.message);
        Alert.alert("Update Failed", error.response?.data?.msg || "Error in updating profile");
      } else {
        console.log("Error:", error);
        Alert.alert("Update Failed", "Unexpected error occurred.");
      }
    }
  }
};


export const updateProfilePic = async (photoUri: string) => {
  try {
    const accessToken = await AsyncStorage.getItem("access_token");
    if (!accessToken) {
      Alert.alert("Error", "No access token found. Please log in again.");
      return;
    }

    const formData = new FormData();
    formData.append("profilePic", {
      uri: Platform.OS === 'android' ? photoUri : photoUri.replace('file://', ''),

      name: "profile-pic.jpg",
      type: "image/jpg"
    } as any);

    const res = await axios.put(`${BASE_URL}/auth/update-profile-pic`, formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data"
      }
    });

    console.log("Response:", res.data);

    Alert.alert("Profile Picture Updated", "Your profile picture has been successfully updated.");

    return res.data.user.profilePic;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("Error:", error.response?.data || error.message);
      Alert.alert("Update Failed", error.response?.data?.msg || "Error in updating profile picture");
    } else {
      console.log("Error:", error);
      Alert.alert("Update Failed", "Unexpected error occurred.");
    }
  }
};

