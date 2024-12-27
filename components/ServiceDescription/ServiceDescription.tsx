import { View, Text, StyleSheet, Image, Pressable, ScrollView } from 'react-native'
import React from 'react'
import { AntDesign, EvilIcons, Ionicons } from '@expo/vector-icons'

import { formatCurrency } from '@/utils/helper'
import { router } from 'expo-router'

const ServiceDescription: React.FC<{ id: string }> = ({ id }) => {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.heroText}>
                <View style={{ width: "100%", paddingHorizontal: 20 }}>
                    <Pressable onPress={()=> router.back()} style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                        <Ionicons name="chevron-back-outline" size={24} color="black" />
                        <Text style={{ fontSize: 18 }}>Back</Text>
                    </Pressable>
                    <Text style={{ marginTop: 50, fontSize: 20 }}>Rejoice Plumbing Service</Text>
                    <Text style={{ marginTop: 10, fontSize: 30 }}>{formatCurrency("en-US", "USD", 367)}</Text>
                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                        <EvilIcons name="location" size={24} color="black" />
                        <Text style={{ fontSize: 16 }}>47 Dubai Circuit, UAE</Text>
                    </View>
                    <View style={styles.ratingView}>
                        <AntDesign name="star" size={20} color="gold" />
                        <Text>6.4</Text>
                    </View>
                </View>
                <View style={styles.imageContainer}>
                    <Image style={styles.image} source={{ uri: "https://res.cloudinary.com/duqgr7s10/image/upload/v1735312473/pexels-karolina-grabowska-4239037_kavpbg.jpg" }} />
                </View>
            </View>
            <View style={{ width: "100%", paddingHorizontal: 20, marginTop: 20 }}>
                <Text style={{ fontSize: 20, fontWeight: 600 }}>About me</Text>
                <Text style={{ fontSize: 16, marginTop: 10, lineHeight: 23 }}>With over half decade of experience in cleaning services, we offer all kind of cleaning service, such as deep cleaning, window cleaning, couch and rug cleaning, bathroom and toilet cleaning, using various advance maching to get the job done</Text>
                <View style={{ marginTop: 25, display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ fontSize: 20, fontWeight: 600 }}>Review From Client</Text>
                    <Text style={{ textDecorationLine: "underline" }}>View all</Text>
                </View>
                <View style={styles.reviewContainer}>
                    <View style={{ display: "flex", flexDirection: "row", columnGap: 5 }}>
                        {
                            Array(5).fill("")?.map((_, i) => (
                                <AntDesign key={i} name="star" size={20} color="blue" />
                            ))
                        }
                    </View>
                    <Text style={{ fontSize: 18, marginTop: 10 }}>This is what i was looking for</Text>
                    <Text style={{ marginVertical: 5, color: "grey" }}>David Beckham | May 05 2024</Text>
                    <Text style={{ marginTop: 5, lineHeight: 20 }}>This was my first time trying this service provider, and they did exceedingly well</Text>
                </View>
                <Pressable style={styles.bookButton}><Text style={{ color: "white", fontSize: 16 }}>Book Now</Text></Pressable>
            </View>
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
    reviewContainer: {
        width: "100%",
        marginTop: 14,
        padding: 14,
        borderRadius: 6,
        borderWidth: 0.5,
        borderColor: "#08080830"
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