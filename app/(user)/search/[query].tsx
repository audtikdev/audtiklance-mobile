import { View, Text } from 'react-native'
import React from 'react'
import Search from '@/components/Search/Search'
import { useLocalSearchParams } from 'expo-router';

const search = () => {
  const { query } = useLocalSearchParams();
  
  return (
    <View>
      <Search query={query as string} />
    </View>
  )
}

export default search