import { View, Text } from 'react-native'
import React from 'react'
import ResetPassword from '@/components/Auth/ResetPassword'
import { useLocalSearchParams } from 'expo-router';

const resetPassword = () => {
  const { query } = useLocalSearchParams();

  return (
    <View>
      <ResetPassword query={query as string} />
    </View>
  )
}

export default resetPassword