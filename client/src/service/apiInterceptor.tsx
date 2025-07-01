import axios from "axios";
import { BASE_URL } from "./config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { resetAndNavigate } from "@/utils/Helpers";
import { logout } from "./authService";

export const appAxios = axios.create({
  baseURL: BASE_URL,
});

export const refresh_tokens = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem("refresh_token");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await axios.post(`${BASE_URL}/auth/refresh-token`, {
      refresh_token: refreshToken,
    });

    const new_access_token = response.data.access_token;
    const new_refresh_token = response.data.refresh_token;

    await AsyncStorage.setItem("access_token", new_access_token);
    await AsyncStorage.setItem("refresh_token", new_refresh_token);

    return new_access_token;
  } catch (error) {
    await AsyncStorage.clear(); // Clear all AsyncStorage
    logout();
    resetAndNavigate("/role");
    throw new Error("Refresh token expired or invalid");
  }
};

appAxios.interceptors.request.use(async (config) => {
  const access_token = await AsyncStorage.getItem("access_token");
  if (access_token) {
    config.headers.Authorization = `Bearer ${access_token}`;
  }
  return config;
});

appAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        const newAccessToken = await refresh_tokens();
        if (newAccessToken) {
          error.config.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(error.config);
        }
      } catch (error) {
        console.log("Error refreshing Token");
      }
    }
    return Promise.reject(error);
  },
);
