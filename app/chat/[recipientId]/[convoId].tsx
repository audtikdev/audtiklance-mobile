import { View, Text } from 'react-native'
import React from 'react'
import ChatContent from '@/components/Chat/ChatContent'
import { useLocalSearchParams } from 'expo-router';

const chatContent = () => {
    const {convoId, recipientId}  = useLocalSearchParams();
    
  return (
    <View>
      <ChatContent convoId={convoId as string} recipientId={recipientId as string} />
    </View>
  )
}

export default chatContent