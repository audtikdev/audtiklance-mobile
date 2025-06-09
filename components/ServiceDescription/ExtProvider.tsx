import { View, Text, useColorScheme, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { Modalize } from 'react-native-modalize'
import { generalStyle } from '@/style/generalStyle'
import { IHandles } from 'react-native-modalize/lib/options'
import { Service } from '@/types/service'
import { makeCall } from '@/utils/helper'

const ExtProvider: React.FC<{ extProviderRef: React.RefObject<IHandles | null>, service: Service }> = ({ extProviderRef, service }) => {
    const colorScheme = useColorScheme() || "light"

    return (
        <Modalize
            ref={extProviderRef}
            adjustToContentHeight={true}
        >
            <View style={styles.modalContent}>
                <Text style={{ marginVertical: 20, fontSize: 16, fontWeight: 500, textAlign: "center", borderBottomWidth: 0.5, paddingBottom: 15 }}>This is a third party service provider, you can contact them using this details</Text>
                <Text style={{ marginBottom: 10, fontSize: 16, fontWeight: 500, textAlign: "center" }}>Address</Text>
                <Text style={{ marginBottom: 20, fontSize: 16, textAlign: "center" }}>{service?.address}</Text>
                <Pressable onPress={()=> makeCall(service?.phone!)} style={styles.bookButton}><Text style={{ color: "white", fontSize: 16 }}>Call Service</Text></Pressable>
            </View>
        </Modalize>
    )
}

export default ExtProvider

const styles = StyleSheet.create({
    modalContent: {
        padding: 20,
        paddingTop: 10,
        height: 550,
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