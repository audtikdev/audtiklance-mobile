import { View, Text } from 'react-native'
import React from 'react'
import ResetPasswordOtp from '@/components/Auth/ResetPasswordOtp'
import { useLocalSearchParams } from 'expo-router';

const resetPasswordOtp = () => {
  const { query } = useLocalSearchParams();

  return (
    <View>
      <ResetPasswordOtp query={query as string} />
    </View>
  )
}

export default resetPasswordOtp