import { View } from 'react-native'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { homeStyles } from '@/styles/homeStyles'
import {StatusBar} from 'expo-status-bar'
import LocationBar from '@/components/customer/LocationBar'
// import { screenHeight } from '@/utils/Constants'


// const  androidHeights=[screenHeight * 0.12,screenHeight * 0.42]


const Home = () => {

  // const bottomSheetRef=useRef(null)
  // const snapPoints=useMemo(()=>androidHeights,[])
  //  const [mapHeight,setMapHeight]=useState(snapPoints[0])

  //  const handleSheetChanges=useCallback((index:number)=>{
  //   let height=screenHeight*0.8
  //   if(index==1){
  //     height=screenHeight*0.5
  //   }
  //   setMapHeight(height)
    
  //  },[])
  return (
    <View style={homeStyles.container}>
      <StatusBar style='light' backgroundColor='#075BB5' translucent={false}>
      </StatusBar>
      <LocationBar/>
      {/* <DraggableMap height={mapHeight}/> */}
    </View>
  )
}

export default Home