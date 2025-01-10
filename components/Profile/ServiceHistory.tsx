import { View, Text, useColorScheme, ScrollView, StyleSheet, Pressable, Image, TextInput } from 'react-native'
import React, { useRef, useState } from 'react'
import { generalStyle } from '@/style/generalStyle'
import { formatCurrency } from '@/utils/helper'
import { Modalize } from 'react-native-modalize'
import { IHandles } from 'react-native-modalize/lib/options'
import StarRating from '../StarRating'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'

const ServiceHistory = () => {
    const colorScheme = useColorScheme() || "light"
    const rateRef = useRef<Modalize>(null)

    const openRateModal = () => {
        rateRef.current?.open()
    }

    return (
        <View style={styles.container}>
            <View style={{display: "flex", flexDirection: "row", alignItems: "center",  justifyContent: "space-between", width: "100%"}}>
                <Pressable onPress={()=> router.back()} style={{display: "flex", flexDirection: "row", alignItems: "center", columnGap: 10}}>
                    <Ionicons name="arrow-back-sharp" size={24} color={colorScheme === "dark" ? "white" : "black"} />
                    <Text style={{ fontSize: 16, fontWeight: 400, ...generalStyle.text[colorScheme] }}>Back</Text>
                </Pressable>
                <Text style={{ fontSize: 18, fontWeight: 600, textAlign: "center", ...generalStyle.text[colorScheme] }}>Service Request History</Text>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {
                    Array(8).fill("").map((_, i) => (
                        <Pressable key={i} style={{ display: "flex", marginTop: 10, justifyContent: "space-between", flexDirection: "row", alignItems: "center" }}>
                            <View style={styles.box}>
                                <Image source={require("../../assets/images/react-logo.png")} style={styles.iconView} />
                                <View>
                                    <Text style={{ fontSize: 18, fontWeight: 600, ...generalStyle.text[colorScheme] }}>Rejoice Plumbing</Text>
                                    <Text style={{ fontSize: 16, fontWeight: 400, ...generalStyle.text[colorScheme] }}>{formatCurrency("en-US", "USD", 3000)}</Text>
                                    <Text style={{ fontSize: 14, fontWeight: 400, ...generalStyle.text[colorScheme] }}>{new Date().toLocaleString()}</Text>
                                </View>
                            </View>
                            <Pressable onPress={openRateModal} style={styles.button}><Text style={{ fontSize: 14, fontWeight: 400, ...generalStyle.text[colorScheme] }}>Rate</Text></Pressable>
                        </Pressable>
                    ))
                }
            </ScrollView>
            <RateModal rateRef={rateRef} />
        </View>
    )
}

export default ServiceHistory

const RateModal: React.FC<{ rateRef: React.RefObject<IHandles> }> = ({ rateRef }) => {
    const colorScheme = useColorScheme() || "light"
    const [rating, setRating] = useState(0)

    return (
        <Modalize
            ref={rateRef}
            adjustToContentHeight={true}
            modalStyle={{ ...generalStyle.modalBackground[colorScheme] }}
        >
            <View style={{ ...styles.shareModalContent, height: 340, paddingTop: 30 }}>
                <Text style={{ fontSize: 16, fontWeight: 500, textAlign: "center", marginBottom: 30, ...generalStyle.text[colorScheme] }}>Rate this service provider</Text>
                <StarRating setRating={setRating} rating={rating} />
                <TextInput placeholderTextColor="#00000080" style={styles.input} multiline={true} textAlignVertical='top' placeholder='Tell us more about this service provider' />
                <Pressable style={{ ...styles.numberButton, ...generalStyle.button.active }}><Text style={{ ...styles.buttonText, ...generalStyle.text.dark }}>Submit</Text></Pressable>
            </View>
        </Modalize>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        paddingTop: 80,
    },
    scrollContainer: {
        marginTop: 40
    },
    shareModalContent: {
        padding: 20,
        height: 300,
        display: "flex",
        alignItems: "center"
    },
    input: {
        width: "100%",
        height: 103,
        backgroundColor: "#CED2D9E5",
        borderRadius: 5,
        marginTop: 30,
        padding: 10
    },
    button: {
        width: 70,
        height: 30,
        backgroundColor: "#1B64F1",
        borderRadius: 4,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    box: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        columnGap: 10,
        marginTop: 20
    },
    iconView: {
        width: 50,
        height: 50,
        borderRadius: 50,
    },
    numberButton: {
        width: "100%",
        height: 52,
        borderRadius: 10,
        backgroundColor: "#B8BBBC",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 600
    },
})