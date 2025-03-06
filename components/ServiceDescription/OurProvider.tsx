import { View, Text, useColorScheme, StyleSheet, Pressable, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { Modalize } from 'react-native-modalize'
import { generalStyle } from '@/style/generalStyle'
import { IHandles } from 'react-native-modalize/lib/options'
import { AntDesign } from '@expo/vector-icons'
import { Service } from '@/types/service'
import { makeCall } from '@/utils/helper'
import { router } from 'expo-router'
import { TextInput } from 'react-native-gesture-handler'
import { sendLead } from '@/api/leads'
import Toast from 'react-native-toast-message'

const OurProvider: React.FC<{ ourProviderRef: React.RefObject<IHandles>, service: Service }> = ({ ourProviderRef, service }) => {
    const [message, setMessage] = useState("")
    const [load, setLoad] = useState(false)

    const sendServiceLead = async () => {
        setLoad(true)
        const response = await sendLead({service_profile: service?.id!, message: message})
        if (response?.status === 201 || response?.status === 200) {
            Toast.show({
                type: "success",
                text1: "Message Sent Successfully"
            })
        }
        setLoad(false)
        ourProviderRef.current?.close()
    }

    return (
        <Modalize
            ref={ourProviderRef}
            adjustToContentHeight={true}
        >
            {
                true ?
                    <View style={{...styles.modalContent, height: 600}}>
                        <Text style={{ marginTop: 6, fontSize: 18, fontWeight: 600, textAlign: "center" }}>Send a message to {service?.business_name}</Text>
                        <Text style={{ marginVertical: 10, fontSize: 16, textAlign: "center" }}>Ask questions or describe what you need. You don’t need to include contact info yet.</Text>
                        <TextInput onChangeText={(text)=> setMessage(text)} placeholderTextColor={"black"} numberOfLines={5} multiline placeholder='Send a brief description of the job to the provider' style={{ ...styles.registerInput }} />
                        <Pressable onPress={sendServiceLead} style={styles.bookButton}>
                            {
                                load ?
                                <ActivityIndicator size={"large"} color="white" /> :
                                <Text style={{ color: "white", fontSize: 16 }}>Send</Text>
                            }
                        </Pressable>
                    </View> :
                    <View style={styles.modalContent}>
                        <Text style={{ marginVertical: 20, fontSize: 16, fontWeight: 500, textAlign: "center", borderBottomWidth: 0.5, paddingBottom: 15 }}>You can communicate with the service provider using the following method</Text>
                        <Pressable onPress={()=> router.push(`/chat/${service?.owner_id}/null`)} style={styles.bookButton}><Text style={{ color: "white", fontSize: 16 }}>Chat Service</Text></Pressable>
                        <Pressable onPress={()=> makeCall(service?.phone!)} style={styles.bookButton}><Text style={{ color: "white", fontSize: 16 }}>Call Service</Text></Pressable>
                    </View>
            }
        </Modalize>
    )
}

export default OurProvider

const styles = StyleSheet.create({
    modalContent: {
        padding: 20,
        height: 530,
    },
    bookButton: {
        width: "100%",
        height: 50,
        borderRadius: 10,
        marginTop: 10,
        backgroundColor: "#1B64F1",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    registerInput: {
        height: 100,
        borderWidth: 1,
        flexShrink: 1,
        width: '100%',
        marginBottom: 20,
        marginTop: 10,
        paddingLeft: 10,
        borderRadius: 5,
    },
})