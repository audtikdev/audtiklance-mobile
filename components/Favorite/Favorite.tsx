import { View, Text, Pressable, StyleSheet, Image, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AntDesign } from '@expo/vector-icons'
import { router } from 'expo-router'
import { Service } from '@/types/service'
import { getFavorites } from '@/api/favorite'
import LottieView from 'lottie-react-native'
import ServiceCard from '../Home/ServiceCard'
import { generalStyle } from '@/style/generalStyle'
import { useSelector } from 'react-redux'
import { RootState } from '../Store/store'

const Favorite = () => {
    const favoritesIDs = useSelector((state: RootState) => state.favoriteProvider.favorite)
    const [favorites, setFavorites] = useState<Array<Service>>([])
    const [load, setLoad] = useState(false)

    useEffect(() => {
        (async () => {
            setLoad(true)
            const res = await getFavorites()
            setLoad(false)
            if (res?.status === 200) {
                setFavorites(res?.data?.results)
            }
        })()
    }, [favoritesIDs?.length])

    return (
        <View style={styles.container}>
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Pressable onPress={() => router.back()} style={{ display: "flex", flexDirection: "row", columnGap: 10, alignItems: "center" }}>
                    <AntDesign name="left" size={24} color="black" />
                    <Text style={{ fontSize: 16, fontWeight: 600 }}>Favorites & Saved</Text>
                </Pressable>
                <Pressable onPress={() => router.push("/(user)/search/type=top")} style={{ ...styles.newButton }}><Text style={{ fontSize: 12 }}>Browse services</Text></Pressable>
            </View>
            {
                load ?
                    <View style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 750, width: "100%" }}>
                        <LottieView source={require("../../assets/images/service2.json")} loop={true} autoPlay style={{ width: 300, height: 350 }} />
                    </View> : favorites.length < 1 ?
                        <View style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 20, height: "90%" }}>
                            <Text style={{ fontSize: 16, fontWeight: 500 }}>You have not marked any service as favorite yet</Text>
                            <Text style={{ fontSize: 14, fontWeight: 600, textAlign: "center", paddingTop: 10 }}>Browse or list of curated services, and marked the ones best suited to you as favorite</Text>
                            <Image style={{ width: 300, height: 300, paddingVertical: 40 }} source={require("../../assets/images/Empty-product.png")} />
                            <Pressable onPress={() => router.push("/(user)/search/type=top")} style={{ ...styles.numberButton, ...generalStyle.button.active }}><Text style={{ color: "white", fontSize: 16 }}>Browse services</Text></Pressable>
                        </View> :
                        <View style={{ marginTop: 40 }}>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={styles.serviceList}>
                                    {
                                        favorites?.map((favorite, i) => (
                                            <ServiceCard key={i} service={favorite} width={'46%'} />
                                        ))
                                    }
                                </View>
                            </ScrollView>
                        </View>
            }
        </View>
    )
}

export default Favorite

const styles = StyleSheet.create({
    container: {
        padding: 15,
        paddingTop: 60,
        height: "100%"
    },
    newButton: {
        padding: 10,
        borderWidth: 0.5,
        borderRadius: 5
    },
    serviceList: {
        paddingBottom: 40,
        display: "flex",
        gap: 10,
        flexDirection: "row",
        width: "100%",
        flexWrap: "wrap",
    },
    numberButton: {
        width: "100%",
        height: 45,
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