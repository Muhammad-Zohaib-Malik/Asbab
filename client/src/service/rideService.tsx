import { router } from "expo-router";
import { appAxios } from "./apiInterceptor";
import { Alert } from "react-native";

interface coords {
  address: string;
  latitude: number;
  longitude: number;
}

export const createRide = async (payload: {
  vehicle: "bike" | "auto" | "cabEconomy" | "cabPremium";
  pickup: coords;
  drop: coords;
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


export const getMyRides= async (isCustomer: boolean=true) => {
    try {
        const res = await appAxios.get("/ride/ride")
        const filterRides=res.data.rides?.filter(
            (ride:any)=>ride?.status!="COMPLETED"
        )
        if(filterRides?.length>0){
            router.navigate({
                pathname:isCustomer? "/customer/liveride":"/rider/liveride",
                params:{
                    id:filterRides[0]?._id
                }
            });
        }

    } catch (error:any) {
        
        Alert.alert("There was an error")
        console.log("Error in Get my ride", error?.response?.data?.message)
    }
}
