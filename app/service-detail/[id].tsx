import { View, Text } from 'react-native'
import React from 'react'
import ServiceDescription from '@/components/ServiceDescription/ServiceDescription'
import { useLocalSearchParams } from 'expo-router';

const serviceDetails = () => {
    const { id } = useLocalSearchParams();
  return (
    <View>
      <ServiceDescription id={id as string} />
    </View>
  )
}

export default serviceDetails