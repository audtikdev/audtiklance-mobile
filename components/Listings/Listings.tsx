import { View, Text, Pressable, StyleSheet, ScrollView, Image, useColorScheme } from 'react-native'
import React, { useEffect, useState } from 'react'
import List from './List'
import { AntDesign } from '@expo/vector-icons'
import { router } from 'expo-router'
import { ListingBody } from '@/types/listing'
import { getAllListing, getMyListing } from '@/api/listing'
import LottieView from 'lottie-react-native'
import { generalStyle } from '@/style/generalStyle'

const Listings = () => {
    const [listings, setListings] = useState<Array<ListingBody>>([])
    const [load, setLoad] = useState(false)
    const colorScheme = useColorScheme() || "light"

    useEffect(() => {
        (async () => {
            setLoad(true)
            const res = await getMyListing()
            if (res?.status === 200) {
                setListings(res?.data?.data || [])
            }
            setLoad(false)
        })()
    }, [])

    return (
        <View style={styles.container}>
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ display: "flex", flexDirection: "row", columnGap: 10, alignItems: "center" }}>
                    <AntDesign onPress={() => router.back()} name="left" size={24} color="black" />
                    <Text style={{ fontSize: 16, fontWeight: 600, ...generalStyle.text[colorScheme] }}>Listings</Text>
                </View>
                <Pressable onPress={() => router.push("/createListing")} style={{...styles.newButton, ...generalStyle.border[colorScheme]}}><Text style={{ fontSize: 12, ...generalStyle.text[colorScheme] }}>Create new listing</Text></Pressable>
            </View>
            {
                load ?
                    <View style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 750, width: "100%" }}>
                        <LottieView source={require("../../assets/images/service2.json")} loop={true} autoPlay style={{ width: 300, height: 350 }} />
                    </View> : listings.length < 1 ?
                        <View style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 20, height: "90%" }}>
                            <Text style={{ fontSize: 16, fontWeight: 500 }}>You have not created any listing yet</Text>
                            <Text style={{ fontSize: 14, fontWeight: 600, textAlign: "center", paddingTop: 10 }}>Create a listing and let service providers reach out to you instead</Text>
                            <Image style={{ width: 300, height: 300, paddingVertical: 40 }} source={require("../../assets/images/Empty-product.png")} />
                            <Pressable onPress={() => router.push("/createListing")} style={{ ...styles.numberButton, ...generalStyle.button.active }}><Text style={{ color: "white", fontSize: 16 }}>Create a listing</Text></Pressable>
                        </View> :
                        <View style={{ marginTop: 20 }}>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={{ paddingBottom: 40 }}>
                                    {
                                        listings?.map((listing, i) => (
                                            <List key={i} listing={listing} setListing={setListings} />
                                        ))
                                    }
                                </View>
                            </ScrollView>
                        </View>
            }
        </View>
    )
}

export default Listings

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