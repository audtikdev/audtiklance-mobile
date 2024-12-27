import { View, Text, Image, StyleSheet, Pressable, useColorScheme, DimensionValue } from 'react-native'
import React from 'react'
import { Service } from '@/types/service'
import { AntDesign } from '@expo/vector-icons'
import { formatCurrency } from '@/utils/helper'
import { generalStyle } from '@/style/generalStyle'
import { router } from 'expo-router'

const ServiceCard: React.FC<{ service: Service, width?: DimensionValue }> = ({ service, width = 230 }) => {
    const colorScheme = useColorScheme() || "light"

    return (
        <View style={{ ...styles.serviceContainer, ...generalStyle.background[colorScheme], width: width }}>
            <View style={styles.imageContainer}>
                <Pressable style={styles.iconContainer}>
                    <AntDesign name="hearto" size={14} color="black" />
                </Pressable>
                <Pressable onPress={()=> router.push("/service-detail/1")}>
                    <Image style={styles.image} source={{ uri: service?.image }} />
                </Pressable>
            </View>
            <Text onPress={()=> router.push("/service-detail/1")} numberOfLines={1} style={{ fontSize: 15, fontWeight: 600, marginTop: 10, marginBottom: 3, ...generalStyle.text[colorScheme] }}>{service?.business_name}</Text>
            <Text onPress={()=> router.push("/service-detail/1")} style={{ fontSize: 13, fontWeight: 400, ...generalStyle.text[colorScheme] }}>{service?.name}</Text>
            <Text onPress={()=> router.push("/service-detail/1")} style={{ fontSize: 15, fontWeight: 600, marginTop: 5, ...generalStyle.text[colorScheme] }}>{formatCurrency("en-US", "USD", Number(service?.price!))}</Text>
        </View>
    )
}

export default ServiceCard


const styles = StyleSheet.create({
    serviceContainer: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        width: "20%",
        flexGrow: 0
    },
    imageContainer: {
        width: "100%",
        height: 100,
        position: "relative"
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 7
    },
    iconContainer: {
        width: 24,
        height: 24,
        backgroundColor: "white",
        borderRadius: 30,
        position: "absolute",
        top: 5,
        right: 6,
        zIndex: 10,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }
})
