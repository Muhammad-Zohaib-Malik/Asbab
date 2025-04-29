import { Image, SafeAreaView, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { useWS } from "@/service/WebProvider";
import { useCaptainStore } from "@/store/captainStore";
import { getMyRides } from "@/service/rideService";
import * as Location from "expo-location";
import { homeStyles } from "@/styles/homeStyles";
import { StatusBar } from "expo-status-bar";
import CaptainHeader from "@/components/captain/CaptainHeader";
import { FlatList } from "react-native-gesture-handler";
import { rideStyles } from "@/styles/rideStyles";
import { riderStyles } from "@/styles/riderStyles";
import CaptainRidesItem from "@/components/captain/CaptainRidesItem";

const CaptainHome = () => {
  const isFocused = useIsFocused();
  const { emit, on, off } = useWS();
  const { onDuty, setLocation } = useCaptainStore();
  const [rideroffers, setRiderOffers] = useState<any[]>([]);

  useEffect(() => {
    getMyRides(false);
  }, []);

  useEffect(() => {
    let locationSubscription: any;
    const startLocationUpdates = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 10000,
            distanceInterval: 10,
          },
          (location) => {
            const { latitude, longitude, heading } = location.coords;
            setLocation({
              latitude: latitude,
              longitude: longitude,
              address: "SomeWhere",
              heading: heading as number,
            });
            emit("updateLocation", {
              latitude,
              longitude,
              heading,
            });
          }
        );
      }
    };

    if (onDuty && isFocused) {
      startLocationUpdates();
    }
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [onDuty, isFocused]);

  useEffect(() => {
    if (onDuty && isFocused) {
      on("rideOffer", (rideDetails: any) => {
        setRiderOffers((prevOffers) => {
          const existingIds = new Set(prevOffers?.map((offer) => offer?.id));
          if (!existingIds.has(rideDetails?.id)) {
            return [...prevOffers, rideDetails];
          }
          return prevOffers;
        });
      });
    }
    return () => {
      off("rideOffer");
    };
  }, [onDuty, on, off, isFocused]);


  const removeRide = (id: string) => {
    setRiderOffers((prevOffers) =>
      prevOffers.filter((offer) => offer?.id !== id)
    );
  };

  const renderRides = ({ item }: any) => {
    return (
      <CaptainRidesItem removeIt={()=>removeRide(item?._id)} item={item}/>
    )
  }


  return (
    <View style={homeStyles.container}>
      <StatusBar style="light" backgroundColor="#075BB5" translucent={false} />
      <CaptainHeader />

      <FlatList data={!onDuty ? [] : rideroffers}
        renderItem={renderRides}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 10, paddingBottom: 120 }}
        keyExtractor={(item: any) => item?._id || Math.random().toString()}
        ListEmptyComponent={
          <View style={riderStyles?.emptyContainer}>
            <Image source={require("@/assets/icons/ride.jpg")} style={riderStyles?.emptyImage} />
            <Text style={{ textAlign: 'center' }}>{onDuty ? "There are no available rides! Stay Actice" : "You're currently OFF-DUTY! please go ON-DUTY to start earning"}</Text>
          </View>
        }

      />

    </View>
  );
};

export default CaptainHome;
