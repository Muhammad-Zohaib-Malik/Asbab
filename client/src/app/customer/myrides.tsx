import { getMyRides } from "@/service/rideService";
import React, { useEffect, useState, useCallback } from "react";
import {
  Text,
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";

interface Ride {
  _id: string;
  status: string;
  pickup?: { address?: string };
  drop?: { address?: string };
  captain?: { phone?: string };
}

const statusColors: Record<string, string> = {
  COMPLETED: "text-green-600",
  PENDING: "text-yellow-600",
  ACCEPTED: "text-blue-600",
  CANCELLED: "text-red-600",
  // Add more statuses if needed
};

const MyRides = () => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRides = useCallback(async () => {
    try {
      if (!refreshing) setLoading(true);
      const data = await getMyRides();
      setRides(data ?? []);
    } catch (error) {
      Alert.alert("Error", "Failed to load rides.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [refreshing]);

  useEffect(() => {
    fetchRides();
  }, [fetchRides]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRides();
  };

  if (loading && !refreshing) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (rides.length === 0) {
    return (
      <View className="flex-1 items-center justify-center px-6 bg-gray-50">
        <Text className="text-lg text-gray-600 text-center font-JakartaMedium">
          No active rides found.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 px-4 py-6 bg-gray-50">
      <Text className="text-3xl mb-6 text-gray-800 font-JakartaBold">
        My Rides
      </Text>
      <FlatList
        data={rides}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <View className="mb-5 p-5 bg-white rounded-2xl shadow-md border border-gray-200">
            <View className="flex-row justify-between items-center mb-3">
              <Text
                className={`font-semibold text-lg font-JakartaMedium ${
                  statusColors[item.status] ?? "text-gray-700"
                }`}
              >
                {item.status.charAt(0) + item.status.slice(1).toLowerCase()}
              </Text>
            </View>

            <View className="mb-2">
              <Text className="text-gray-500 font-JakartaMedium">From</Text>
              <Text className="text-gray-900 text-base font-JakartaMedium">
                {item.pickup?.address ?? "N/A"}
              </Text>
            </View>

            <View className="mb-2">
              <Text className="text-gray-500 font-JakartaMedium">To</Text>
              <Text className="text-gray-900 text-base font-JakartaMedium">
                {item.drop?.address ?? "N/A"}
              </Text>
            </View>

            <View>
              <Text className="text-gray-500 font-JakartaMedium">
                Captain Phone
              </Text>
              <Text className="text-gray-900 text-base font-JakartaMedium">
                {item.captain?.phone ?? "N/A"}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default MyRides;
