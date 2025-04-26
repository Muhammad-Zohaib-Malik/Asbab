import { useWS } from "@/service/WebProvider"
import { rideStyles } from "@/styles/rideStyles"
import { screenHeight } from "@/utils/Constants"
import { useRoute } from "@react-navigation/native"
import { StatusBar } from "expo-status-bar"
import { memo, useCallback, useMemo, useRef, useState } from "react"
import {  Text, View } from "react-native"

const androidHeights=[screenHeight * 0.12, screenHeight * 0.42]

const LiveRide=()=>{

    const {emit,on,off}=useWS()
    const [rideData,setRideData]=useState<any>(null)
    const [riderCoords,setriderCoords]=useState<any>(null)
    const route=useRoute() as any
    const params=route?.params || {}
    const id=params.id 
    const bottomSheetRef=useRef(null)
    const snapPoints=useMemo(()=>androidHeights,[])
    const [mapHeight,setMapHeight]=useState(snapPoints[0])
    const handleSheetChanges=useCallback((index:number)=>{
        let height=screenHeight*0.18
        if(index==1){
            height=screenHeight*0.5
        }
        setMapHeight(height)
    }, [])


    return(
        <View style={rideStyles.container}>
           <StatusBar style="light"  backgroundColor="#075BB5" translucent={false}/>
           <Text>hello</Text>
           
        </View> 
    )
}

export default memo(LiveRide)