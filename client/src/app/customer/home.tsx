import { Text, View } from 'react-native'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { homeStyles } from '@/styles/homeStyles'
import { StatusBar } from 'expo-status-bar'
import LocationBar from '@/components/customer/LocationBar'


const Home = () => {

  return (
    <View style={homeStyles.container}>
      <StatusBar style='light' backgroundColor='#075BB5' translucent={false}>
      </StatusBar>
      <LocationBar />
      <Text>hello</Text>
      {/* <DraggableMap height={mapHeight}/> */}
    </View>
  )
}

export default Home