import { useCaptainStore } from "@/store/captainStore";
import { useUserStore } from "@/store/userStore";
import { resetAndNavigate } from "@/utils/Helpers";
import axios from "axios";
import { Alert } from "react-native";
import { BASE_URL } from "./config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const signIn = async (payload: { role: 'customer' | 'captain', phone: string }) => {
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
  } catch (error: any) {
    Alert.alert("Oh, there was an error");
    console.log("Error:", error?.response?.data?.msg || "Error in sign-in");
  }
};

export const logout = async () => {
  const { clearData } = useUserStore.getState();
  const { clearCaptainData } = useCaptainStore.getState();

  try {
    // Use AsyncStorage to clear all stored tokens
    await AsyncStorage.clear();

    clearCaptainData();
    clearData();

    resetAndNavigate("/role");
  } catch (error) {
    console.log("Error during logout:", error);
  }
};
