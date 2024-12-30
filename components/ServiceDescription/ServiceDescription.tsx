import { View, Text, StyleSheet, Image, Pressable, ScrollView, useColorScheme } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AntDesign, EvilIcons, Ionicons } from '@expo/vector-icons'
import Constants from 'expo-constants'
import { formatCurrency } from '@/utils/helper'
import { router } from 'expo-router'
import { generalStyle } from '@/style/generalStyle'
import ReviewCard from '../Review/ReviewCard'
import { Service } from '@/types/service'
import axios from 'axios'
import LottieView from 'lottie-react-native'

const ServiceDescription: React.FC<{ id: string }> = ({ id }) => {
    const colorScheme = useColorScheme() || "light"
    const [service, setService] = useState<Service | null>(null)
    const [load, setLoad] = useState(true)
    const baseUrl = Constants.expoConfig?.extra?.BASE_API

    console.log(id);
    useEffect(() => {
        setLoad(true)
        const url = `${baseUrl}/service/${id}`;
        axios.get(url)
            .then((response: any) => {
                setService(response?.data);
                setLoad(false)
            })
            .catch((error: any) => {
                setService(null)
                console.error("getServices", error);
                setLoad(false)
            });
    }, [id])
    return (
        <ScrollView style={styles.container}>
            {
                load ?
                    <View>
                        <Pressable onPress={() => router.back()} style={{ display: "flex", flexDirection: "row", alignItems: "center", paddingTop: 90, paddingLeft: 20 }}>
                            <Ionicons name="chevron-back-outline" size={24} color="black" />
                            <Text style={{ fontSize: 18 }}>Back</Text>
                        </Pressable>
                        <View style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 750, width: "100%" }}>
                            <LottieView source={require("../../assets/images/service2.json")} loop={true} autoPlay style={{ width: 300, height: 350 }} />
                        </View>
                    </View> :
                    <View>
                        <View style={styles.heroText}>
                            <View style={{ width: "100%", paddingHorizontal: 20 }}>
                                <Pressable onPress={() => router.back()} style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                    <Ionicons name="chevron-back-outline" size={24} color="black" />
                                    <Text style={{ fontSize: 18 }}>Back</Text>
                                </Pressable>
                                <Text style={{ marginTop: 50, fontSize: 20 }}>{service?.business_name}</Text>
                                <Text style={{ marginTop: 10, fontSize: 30 }}>{formatCurrency("en-US", "USD", service?.sub_category?.[0]?.cost!)}</Text>
                                <View style={{ display: "flex", flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                                    <EvilIcons name="location" size={24} color="black" />
                                    <Text style={{ fontSize: 16 }}>{service?.address}</Text>
                                </View>
                                <View style={styles.ratingView}>
                                    <AntDesign name="star" size={20} color="gold" />
                                    <Text>6.4</Text>
                                </View>
                            </View>
                            <View style={styles.imageContainer}>
                                <Image style={styles.image} source={{ uri: service?.profile_picture }} />
                            </View>
                        </View>
                        <View style={{ width: "100%", paddingHorizontal: 20, marginTop: 20 }}>
                            <Text style={{ fontSize: 20, fontWeight: 600, ...generalStyle.text[colorScheme] }}>About me</Text>
                            <Text style={{ fontSize: 16, marginTop: 10, lineHeight: 23, ...generalStyle.text[colorScheme] }}>{service?.about_me}</Text>
                            <View style={{ marginTop: 25, display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                <Text style={{ fontSize: 20, fontWeight: 600, ...generalStyle.text[colorScheme] }}>Review From Client</Text>
                                <Text onPress={() => router.push("/reviews/1234")} style={{ textDecorationLine: "underline", ...generalStyle.text[colorScheme] }}>View all</Text>
                            </View>
                            <ReviewCard />
                            <Pressable style={styles.bookButton}><Text style={{ color: "white", fontSize: 16 }}>Book Now</Text></Pressable>
                        </View>
                    </View>
            }
        </ScrollView>
    )
}

export default ServiceDescription

const styles = StyleSheet.create({
    container: {
        marginBottom: 300,
        height: "95%"
    },
    heroText: {
        paddingTop: 90,
        backgroundColor: "#bde0fe80",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-start",

    },
    ratingView: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 30,
        gap: 6,
        marginTop: 10,
        backgroundColor: "white",
        width: 70,
        padding: 6
    },
    imageContainer: {
        width: "100%",
        height: 200,
        marginTop: 20
    },
    image: {
        width: "100%",
        height: "100%",
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