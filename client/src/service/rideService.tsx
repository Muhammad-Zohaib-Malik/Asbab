import { router } from "expo-router";
import { appAxios } from "./apiInterceptor";
import { Alert } from "react-native";
import { resetAndNavigate } from "@/utils/Helpers";

interface coords {
  address: string;
  latitude: number;
  longitude: number;
}

export interface Ride {
  _id: string;
  vehicle: string;
  distance: number;
  pickup: {
    address: string;
    latitude: number;
    longitude: number;
  };
  drop: {
    address: string;
    latitude: number;
    longitude: number;
  };
  fare: number;
  customer: {
    _id: string;
    phone: string;
  };
  captain: {
    _id: string;
    phone: string;
  };
  status: string;
  otp: string;
  createdAt: string;
  updatedAt: string;
}
type LoadDetails = {
  type: string;
  weight: number;
};

export const createRide = async (payload: {
  vehicle: "bike" | "auto" | "cabEconomy" | "cabPremium" | "truck" | "van";
  pickup: coords;
  drop: coords;
  loadDetails?: LoadDetails;
}) => {
  try {
    const res = await appAxios.post("/ride/create", payload);
    router?.navigate({
      pathname: "/customer/liveride",
      params: {
        id: res?.data?.ride?._id,
      },
    });
  } catch (error: any) {
    Alert.alert("There was an error");
    console.log("Error in ride booking", error?.response?.data?.message);
  }
};

export const getMyRides = async (
  status?: string,
  isCustomer: boolean = true
): Promise<Ride[] | null> => {
  try {
    const res = await appAxios.get("/ride/rides", {
      params: status ? { status } : {},
    });

    const rides: Ride[] = res.data.rides ?? [];

    // Filter rides that are NOT completed
    const liveRides = rides.filter((ride) => ride.status !== "COMPLETED");

    if (liveRides.length > 0) {
      // Navigate to live ride page of first live ride found
      router.push({
        pathname: isCustomer ? "/customer/liveride" : "/rider/liveride",
        params: {
          id: liveRides[0]._id,
        },
      });
    }

    return rides;
  } catch (error: any) {
    Alert.alert("Failed to fetch rides");
    console.log(
      "Error in getMyRides:",
      error?.response?.data?.message || error.message
    );
    return null;
  }
};

// export const getMyRides= async (isCustomer: boolean=true) => {
//     try {
//         const res = await appAxios.get("/ride/rides")
//         const filterRides=res.data.rides?.filter(
//             (ride:any)=>ride?.status!="COMPLETED"
//         )
//         if(filterRides?.length>0){
//             router.navigate({
//                 pathname:isCustomer? "/customer/liveride":"/rider/liveride",
//                 params:{
//                     id:filterRides[0]?._id
//                 }
//             });
//         }

//     } catch (error:any) {

//         Alert.alert("There was an error")
//         console.log("Error in Get my ride", error?.response?.data?.message)
//     }
// }

// export const getMyRides = async (status?: string): Promise<Ride[] | null> => {
//   try {
//     const res = await appAxios.get("/ride/rides", {
//       params: status ? { status } : {},
//     });
//     return res.data.rides ?? [];
//   } catch (error: any) {
//     Alert.alert("Failed to fetch rides");
//     console.log("Error in getMyRides:", error?.response?.data?.message || error.message);
//     return null;
//   }
// };

export const acceptRideOffer = async (rideId: string) => {
  try {
    const res = await appAxios.patch(`/ride/accept/${rideId}`);
    resetAndNavigate({
      pathname: "/captain/liveride",
      params: { id: rideId },
    });
    console.log("Ride offer accepted", res.data);
  } catch (error: any) {
    Alert.alert("There was an error", error);
    console.log("Error in accepting ride offer", error);
  }
};

export const updateRideStatus = async (rideId: string, status: string) => {
  try {
    const res = await appAxios.patch(`/ride/update/${rideId}`, { status });
    return true;
  } catch (error) {
    Alert.alert("There was an error");
    console.log("Error in updating ride status", error);
    return false;
  }
};

export const ratingRide = async (
  rideId: string,
  rating: number,
  review?: string
) => {
  try {
    const res = await appAxios.post(`/ride/rating/${rideId}`, {
      rating,
      review,
    });

    Alert.alert("Thank you for your feedback!");
    console.log("Ride rated successfully:", res.data);
    return true;
  } catch (error: any) {
    Alert.alert("There was an error submitting your rating");
    console.log(
      "Error in rating ride:",
      error?.response?.data?.message || error
    );
    return false;
  }
};

export const createComplaint = async (message: string) => {
  try {
    const res = await appAxios.post("/complaint", { message });
    return res.data;
  } catch (error: any) {
    Alert.alert("There was an error submitting your complaint.");
    console.log(
      "Complaint error:",
      error?.response?.data?.message || error.message
    );
  }
};
