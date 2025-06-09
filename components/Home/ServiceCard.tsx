import { View, Text, Image, StyleSheet, Pressable, DimensionValue, Dimensions } from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons'
import { formatCurrency } from '@/utils/helper'
import { router } from 'expo-router'
import { addFavorite, removeFavorite } from '@/api/favorite'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../Store/store'
import { updateFavorite } from '../Context/favoriteProvider'
import Toast from 'react-native-toast-message'
import { BusinessType } from '@/types/service'
const screenWidth = Dimensions.get('window').width;

const ServiceCard: React.FC<{ service: BusinessType, width?: DimensionValue }> = ({ service, width = 200 }) => {
    const favorites = useSelector((state: RootState) => state.favoriteProvider.favorite)
    const dispatch = useDispatch()

    const handleAddFavorite = async () => {
        const res = await addFavorite(service.id!)
        if (res?.status === 200 || res?.status === 201) {
            dispatch(updateFavorite({ favorite: [...favorites, service.id!] }))
            Toast.show({
                type: 'success',
                text1: 'Added to favorite'
            })
        } else {
            Toast.show({
                type: 'error',
                text1: 'Error, try again'
            })
        }
    }

    const handleRemoveFavorite = async () => {
        const res = await removeFavorite(service.id!)
        if (res?.status === 200) {
            const newArr = favorites?.filter((favorite) => favorite !== service.id)
            dispatch(updateFavorite({ favorite: newArr }))
            Toast.show({
                type: 'success',
                text1: 'Removed from favorite'
            })
        } else {
            Toast.show({
                type: 'error',
                text1: 'Error, try again'
            })
        }
    }

    return (
        <View style={{ ...styles.serviceContainer, width: width }}>
            <View style={styles.imageContainer}>
                {service?.is_google_place && <Pressable style={styles.thirdParty}>
                    <Text>Third Party</Text>
                </Pressable>}
                {
                    !favorites?.includes(service.id!) ?
                        <Pressable onPress={handleAddFavorite} style={styles.iconContainer}>
                            <AntDesign name="hearto" size={14} color="#1B64F1" />
                        </Pressable> :
                        <Pressable onPress={handleRemoveFavorite} style={styles.iconContainer}>
                            <AntDesign name="heart" size={16} color="#1B64F1" />
                        </Pressable>
                }
                <Pressable onPress={() => router.push(`/service-detail/${service?.id}`)}>
                    <Image style={styles.image} source={{ uri: service?.mainImage }} />
                </Pressable>
            </View>
            <Text onPress={() => router.push(`/service-detail/${service?.id}`)} numberOfLines={1} style={{ fontSize: 13, fontWeight: 500, marginTop: 20, marginBottom: 0 }}>{service?.title}</Text>
            <Text onPress={() => router.push(`/service-detail/${service?.id}`)} style={{ fontSize: 13, fontWeight: 400, marginVertical: 2 }}>{service?.services?.[0]?.category?.name}</Text>
            {!service?.is_google_place && <Text onPress={() => router.push(`/service-detail/${service?.id}`)} style={{ fontSize: 13, fontWeight: 500, marginTop: 0 }}>{formatCurrency("en-US", "USD", Number(service?.services?.[0]?.price))}</Text>}
        </View>
    )
}

export default ServiceCard


const styles = StyleSheet.create({
    serviceContainer: {
        backgroundColor: "#F9F9F8",
        borderRadius: 10,
        padding: 10,
        width: "20%",
        flexGrow: 0,
        margin: 5,
        height: screenWidth > 600 ? 300 : 220
    },
    imageContainer: {
        width: "100%",
        height: "65%",
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
