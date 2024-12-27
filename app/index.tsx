import React from 'react'
import Landing from '@/components/Landing/Landing'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

const index = () => {
  return (
    <GestureHandlerRootView>
      <Landing />
    </GestureHandlerRootView>
  )
}

export default index