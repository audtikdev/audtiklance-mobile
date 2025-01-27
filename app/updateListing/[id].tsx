import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import UpdateListing from '@/components/UpdateListing/UpdateListing'

const updateListing = () => {
    const {id} = useLocalSearchParams()
  return (
    <View>
      <UpdateListing id={id as string} />
    </View>
  )
}

export default updateListing