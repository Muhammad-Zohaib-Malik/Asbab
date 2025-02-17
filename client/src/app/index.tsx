import React, { useEffect, useState } from "react";
import { Alert, Image, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { commonStyles } from "@/styles/commonStyles";
import { splashStyles } from "@/styles/splashStyles";
import { resetAndNavigate } from "@/utils/Helpers";
import { refresh_tokens } from "@/service/apiInterceptor";
import { useUserStore } from "@/store/userStore";
import Video from 'react-native-video'; // Import react-native-video



interface DecodedToken {
  exp: number; // Token expiration time in seconds since Unix epoch
}

const Main = () => {
  const { user } = useUserStore(); // Get user from your store
  const [hasNavigated, setHasNavigated] = useState(false); // Prevent multiple navigations

  // Function to check tokens and navigate accordingly
  const tokenCheck = async () => {
    try {
      const access_token = await AsyncStorage.getItem("access_token");
      const refresh_token = await AsyncStorage.getItem("refresh_token");

      const currentTime = Date.now() / 1000; // Current time in seconds

      if (access_token) {
        const decodedAccessToken = jwtDecode<DecodedToken>(access_token);

        if (decodedAccessToken?.exp < currentTime) {
          // Access token is expired
          Alert.alert("Session expired", "Please log in again");
          resetAndNavigate("/role");
          return;
        }
      }

      if (refresh_token) {
        const decodedRefreshToken = jwtDecode<DecodedToken>(refresh_token);

        if (decodedRefreshToken?.exp < currentTime) {
          // Refresh token is expired
          Alert.alert("Refresh token expired", "Please log in again");
          resetAndNavigate("/role");
          return;
        } else {
          // Refresh the access token
          try {
            await refresh_tokens();
          } catch (err) {
            console.error("Error refreshing token:", err);
            Alert.alert("Error", "Failed to refresh token. Please log in again.");
            resetAndNavigate("/role");
            return;
          }
        }
      }

      // If user is available, navigate to home; otherwise, role selection
      if (user) {
        resetAndNavigate("/customer/home");
      } else {
        resetAndNavigate("/role");
      }
    } catch (error) {
      console.error("Error during token check:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
      resetAndNavigate("/role");
    }
  };

  // useEffect to handle initial navigation
  useEffect(() => {
    if (!hasNavigated) {
      const timeout = setTimeout(() => {
        tokenCheck();
        setHasNavigated(true);
      }, 1000); // Delay for splash screen display
      return () => clearTimeout(timeout);
    }
  }, [hasNavigated]);

  // Render splash screen
  return (
    <View style={commonStyles.container}>
      <Image
        source={require("../assets/images/Logo.png")}
        style={splashStyles.img}
      />

    </View>
  );
};

export default Main;
