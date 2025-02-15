import "dotenv/config";

export default {
  expo: {
    extra: {
      googleApiKey: process.env.EXPO_PUBLIC_MAP_API_KEY
    },
    "android": {
      "package": "com.example.app"
    }
  },
};
