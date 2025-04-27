import { SafeAreaView, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { useWS } from "@/service/WebProvider";
import { useCaptainStore } from "@/store/captainStore";
import { getMyRides } from "@/service/rideService";
import * as Location from "expo-location";
import { homeStyles } from "@/styles/homeStyles";
import { StatusBar } from "expo-status-bar";
import CaptainHeader from "@/components/captain/CaptainHeader";

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
            emit("updateLocation", {});
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
      on("riderOffer", (rideDetails: any) => {
        setRiderOffers((prevOffers) => {
          const existingIds = new Set(prevOffers.map((offer) => offer?.id));
          if (!existingIds.has(rideDetails?.id)) {
            return [...prevOffers, rideDetails];
          }
          return prevOffers;
        });
      });
    }
    return () => {
      off("riderOffer");
    };
  }, [onDuty, on, off, isFocused]);


const removeRide = (id: string) => {
  setRiderOffers((prevOffers) =>
    prevOffers.filter((offer) => offer?.id !== id)
  );
};


  return (
    <View style={homeStyles.container}>
     <StatusBar style="light" backgroundColor="#075BB5" translucent={false}/>
     <CaptainHeader/>
    </View>
  );
};

export default CaptainHome;
