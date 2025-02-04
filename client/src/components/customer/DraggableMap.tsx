import { View } from 'react-native'
import React, { FC, useRef } from 'react'
import MapView from "react-native-maps"
import { customMapStyle, islamabadInitialRegion } from '@/utils/CustomMap'

const DraggableMap:FC<{height:number}> = ({height}) => {
  const mapRef=useRef<MapView>(null)

  const handleRegionChangeComplete=async()=>{

  } 

  return (
    <View style={{height:height,width:"100%"}}>
      <MapView
       ref={mapRef}
        maxZoomLevel={16}
        minZoomLevel={12}
        pitchEnabled={false}
        onRegionChangeComplete={handleRegionChangeComplete}
        initialRegion={islamabadInitialRegion}
        provider='google'
        customMapStyle={customMapStyle}
        showsMyLocationButton={false}
        showsCompass={false}
        showsIndoors={false}
        showsIndoorLevelPicker={false}
        showsTraffic={false}
        showsScale={false}
        showsBuildings={false}
        showsPointsOfInterest={false}
        showsUserLocation={true}
        >

      </MapView>
    </View>
  )
}

export default DraggableMap