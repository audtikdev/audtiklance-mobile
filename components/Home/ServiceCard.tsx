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
                {service?.is_google_place && <Pressable style={styles.thirdParty}>
                    <Text>Third Party</Text>
                </Pressable>}
                <Pressable style={styles.iconContainer}>
                    <AntDesign name="hearto" size={14} color="black" />
                </Pressable>
                <Pressable onPress={() => router.push(`/service-detail/${service?.id}`)}>
                    <Image style={styles.image} source={{ uri: service?.profile_picture }} />
                </Pressable>
            </View>
            <Text onPress={() => router.push(`/service-detail/${service?.id}`)} numberOfLines={1} style={{ fontSize: 15, fontWeight: 600, marginTop: 10, marginBottom: 3, ...generalStyle.text[colorScheme] }}>{service?.business_name}</Text>
            {!service?.is_google_place && <Text onPress={() => router.push(`/service-detail/${service?.id}`)} style={{ fontSize: 13, fontWeight: 400, ...generalStyle.text[colorScheme] }}>{service?.sub_category?.[0]?.sub_category}</Text>}
            {!service?.is_google_place && <Text onPress={() => router.push(`/service-detail/${service?.id}`)} style={{ fontSize: 15, fontWeight: 600, marginTop: 5, ...generalStyle.text[colorScheme] }}>{formatCurrency("en-US", "USD", Number(service?.sub_category?.[0]?.cost))}</Text>}
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
        flexGrow: 0,
        margin: 5
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
    },
    thirdParty: {
        width: 90,
        height: 24,
        backgroundColor: "white",
        borderRadius: 10,
        position: "absolute",
        top: 5,
        left: 6,
        zIndex: 10,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
})
