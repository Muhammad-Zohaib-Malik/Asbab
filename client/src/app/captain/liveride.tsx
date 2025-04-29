import { useWS } from "@/service/WebProvider";
import { useCaptainStore } from "@/store/captainStore";
import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, View } from "react-native";
import * as Location from "expo-location";
import { resetAndNavigate } from "@/utils/Helpers";
import { rideStyles } from "@/styles/rideStyles";
import { StatusBar } from "expo-status-bar";
import CaptainLiveTracking from "@/components/captain/CaptainLiveTracking";
import { updateRideStatus } from "@/service/rideService";
import CaptainActionButton from "@/components/captain/CaptainActionButton";
import OtpInputModel from "@/components/captain/OtpInputModel";

const LiveRide = () => {
  const [isOtpModelVisible, setIsOtpModelVisible] = useState(false);
  const { setLocation, location, setOnDuty } = useCaptainStore();
  const { emit, on, off } = useWS();
  const [rideData, setRideData] = useState<any>(null);
  const route = useRoute() as any;
  const params = route?.params || {};
  const id = params.id;
  console.log(rideData, "Ride Data");
  console.log(id, "Ride ID");

  useEffect(() => {
    let localtionSubscription: any;
    const startLocationUpdates = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        localtionSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000,
            distanceInterval: 200,
          },
          (location) => {
            const { latitude, longitude, heading } = location.coords;
            setLocation({
              latitude: latitude,
              longitude: longitude,
              address: "SomeWhere",
              heading: heading as number,
            });
            setOnDuty(true);

            emit("goOnDuty", {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              heading: heading as number,
            });

            emit("updateLocation", {
              latitude,
              longitude,
              heading,
            });
            console.log(
              `Location updated Lat ${latitude} Long ${longitude}. Heading ${heading}`
            );
          }
        );
      } else {
        console.log("Location permission not granted");
      }
    };
    startLocationUpdates();

    return () => {
      if (localtionSubscription) {
        localtionSubscription.remove();
      }
    };
  }, [id]);

  useEffect(() => {
    if (id) {
      console.log("Subscribing to ride updates for ID:", id); // Check if the ID is correct
      emit("subscribeRide", id);

      on("rideData", (data) => {
        console.log("Received ride data:", data); // Check if you are receiving the data

        setRideData(data);
      });

      on("rideUpdate", (data) => {
        setRideData(data);
      }); 

      on("rideCanceled", (error) => {
        console.log("Ride Cancelled", error);
        resetAndNavigate("/captain/home");
        Alert.alert("Ride Cancelled");
      });
      on("error", (error) => {
        resetAndNavigate("/captain/home");
        Alert.alert("Oh No! There was an error");
      });

      return () => {
        off("rideData");
        off("error");
      };
    }
  }, [id, emit, on, off]);

  return (
    <View style={rideStyles.container}>
      <StatusBar style="light" backgroundColor="#075BB5" translucent={false} />

      {rideData && (
        <CaptainLiveTracking
          status={rideData?.status}
          drop={{
            latitude: parseFloat(rideData?.drop?.latitude),
            longitude: parseFloat(rideData?.drop?.longitude),
          }}
          pickup={{
            latitude: parseFloat(rideData?.pickup?.latitude),
            longitude: parseFloat(rideData?.pickup?.longitude),
          }}
          captain={{
            latitude: location?.latitude,
            longitude: location?.longitude,
            heading: location?.heading,
          }}
        />
      )}

      <CaptainActionButton
        ride={rideData}
        title={
          rideData?.status === "START"
            ? "ARRIVED"
            : rideData?.status === "ARRIVED"
            ? "COMPLETED"
            : "SUCCESS"
        }
        onPress={async () => {
          if (rideData?.status === "START") {
            setIsOtpModelVisible(true);
            return;
          }
          const isSuccess = await updateRideStatus(rideData?._id, "COMPLETED");
          if (isSuccess) {
            Alert.alert("Ride Completed Successfully");
            resetAndNavigate("/captain/home");
          } else {
            Alert.alert("Error completing ride");
          }
        }}
        color="#228B22"
      />

      {isOtpModelVisible && (
        <OtpInputModel
          visible={isOtpModelVisible}
          onClose={() => setIsOtpModelVisible(false)}
          title="Enter OTP"
          onConfirm={async (otp) => {
            if (otp === rideData?.otp) {
              console.log("Trying to update status to COMPLETED for ride:", rideData?._id);
              const isSuccess = await updateRideStatus(rideData?._id, "ARRIVED");
              if (isSuccess) {
                setIsOtpModelVisible(false);
              } else {
                Alert.alert("Error starting ride");
              }
            } else {
              Alert.alert("Invalid OTP");
            }
          }}
        />
      )}
    </View>
  );
};

export default LiveRide;
