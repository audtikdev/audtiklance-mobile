import { View, Text, useColorScheme, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { Modalize } from 'react-native-modalize'
import { generalStyle } from '@/style/generalStyle'
import { IHandles } from 'react-native-modalize/lib/options'
import { AntDesign } from '@expo/vector-icons'
import { Service } from '@/types/service'
import { makeCall } from '@/utils/helper'
import { router } from 'expo-router'

const OurProvider: React.FC<{ ourProviderRef: React.RefObject<IHandles>, service: Service }> = ({ ourProviderRef, service }) => {
    const colorScheme = useColorScheme() || "light"

    return (
        <Modalize
            ref={ourProviderRef}
            adjustToContentHeight={true}
            modalStyle={generalStyle.modalBackground[colorScheme]}
        >
            {
                false ?
                    <View style={styles.modalContent}>
                        <AntDesign style={{ textAlign: "center" }} name="checkcircle" size={50} color="green" />
                        <Text style={{ ...generalStyle.text[colorScheme], marginVertical: 20, fontSize: 16, textAlign: "center" }}>Congrats, Your details have been sent to the service provider, he will contact your shortly</Text>
                        <Pressable onPress={()=> ourProviderRef.current?.close()} style={styles.bookButton}><Text style={{ color: "white", fontSize: 16 }}>Close</Text></Pressable>
                    </View> :
                    <View style={styles.modalContent}>
                        <Text style={{ ...generalStyle.text[colorScheme], marginVertical: 20, fontSize: 16, fontWeight: 500, textAlign: "center", borderBottomWidth: 0.5, paddingBottom: 15 }}>You can communicate with the service provider using the following method</Text>
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
    }
})