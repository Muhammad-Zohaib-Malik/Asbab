import AsyncStorage from "@react-native-async-storage/async-storage";

// Utility object to interact with AsyncStorage
export const asyncStorage = {
  // Set an item in AsyncStorage
  setItem: async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error("Error saving data", error);
    }
  },

  // Get an item from AsyncStorage
  getItem: async (key: string): Promise<string | null> => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value; // Return null if not found
    } catch (error) {
      console.error("Error retrieving data", error);
      return null;
    }
  },

  // Remove an item from AsyncStorage
  removeItem: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing data", error);
    }
  },
};
