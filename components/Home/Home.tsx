import { View, Text, StyleSheet, useColorScheme, ScrollView, Alert, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { generalStyle } from '@/style/generalStyle'
import Constants from 'expo-constants'
import { popularCategories } from '@/data/home'
import CategoryCard from './CategoryCard'
import ServiceCard from './ServiceCard'
import * as Location from 'expo-location';
import { useDispatch, useSelector } from 'react-redux'
import { updateLocation } from '../Context/locationProvider'
import { RootState } from '../Store/store'
import axios from 'axios'
import LottieView from 'lottie-react-native'
import { router } from 'expo-router'
import { getUser } from '@/api/auth'
import { updateAuth } from '../Context/authProvider'
import { getFavorites } from '@/api/favorite'
import { updateFavorite } from '../Context/favoriteProvider'
import { BusinessType } from '@/types/service'
const Home = () => {
    const authUser = useSelector((state: RootState) => state.authProvider.auth)
    const userLocation = useSelector((state: RootState) => state.locationProvider.location)
    const [status, requestPermission] = Location.useForegroundPermissions();
    const [load, setLoad] = useState(false)
    const [loadTop, setLoadTop] = useState(false)
    const [services, setServices] = useState<BusinessType[]>([])
    const [topServices, setTopServices] = useState<BusinessType[]>([])
    const dispatch = useDispatch()

    const baseUrl = Constants.expoConfig?.extra?.BASE_API

    useEffect(() => {
        (async () => {
            const response = await getUser()
            if (response?.status === 201 || response?.status === 200) {
                const data = response.data
                dispatch(updateAuth({ auth: data }))
                const res = await getFavorites()
                if (res?.status === 200) {
                    const servicesID = res?.data?.map((result: any) => result?.businessId)
                    dispatch(updateFavorite({ favorite: servicesID }))
                }
            }
        })()
    }, [])

    useEffect(() => {
        if (!status?.granted) {
            requestPermission()
                .then(async (response) => {
                    if (response.granted) {
                        const location = await Location.getCurrentPositionAsync({});
                        console.log(location);
                        dispatch(updateLocation({ location: location }))
                    } else {
                        Alert.alert("We Need Your Location To Show Nearby Services")
                    }
                })
        }
    }, [])

    useEffect(() => {
        (async () => {
            setLoad(true)
            if (userLocation?.coords?.longitude && userLocation?.coords?.latitude) {
                const url = `${baseUrl}/businesses/search?lng=${userLocation?.coords?.longitude}&lat=${userLocation?.coords?.latitude}`;
                const response1 = await axios.get(url)
                setServices(response1?.data);
            } else {
                const url = `${baseUrl}/businesses/search`;
                const response1 = await axios.get(url)
                setServices(response1?.data);
            }
            setLoad(false)
        })()
    }, [userLocation])

    useEffect(() => {
        (async () => {
            setLoadTop(true)
            const url2 = `${baseUrl}/businesses/search`;
            const response2 = await axios.get(url2)
            setTopServices(response2?.data)
            setLoadTop(false)
        })()
    }, [])

    return (
        <View>
            <View style={styles.heroText}>
                <Text style={{ ...styles.title, ...generalStyle.text.light }}>Hi {authUser?.user?.firstName}</Text>
                <Text style={{ ...styles.greeting, ...generalStyle.text.light }}>What services do you need?</Text>
            </View>
            <View style={styles.container}>
                <ScrollView>
                    <View style={{ paddingBottom: 420 }}>
                        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
                            <Text style={{ ...styles.title }}>Popular Category</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryList}>
                                {
                                    popularCategories?.map((category, i) => (
                                        <CategoryCard key={i} category={category} />
                                    ))
                                }
                            </ScrollView>
                        </View>
                        <View style={{ paddingHorizontal: 20, marginVertical: 30 }}>
                            <Text style={{ fontSize: 15, fontWeight: 500, textAlign: "center" }}>Have a personalized request in mind?</Text>
                            <Pressable onPress={() => router.push("/createListing")} style={{ ...styles.loginButton }}>
                                <Text style={{ ...styles.buttonText }}>Create a listing</Text>
                            </Pressable>
                        </View>
                        <View style={{ paddingHorizontal: 20 }}>
                            <View style={styles.serviceTitleContainer}>
                                <Text style={{ ...styles.title }}>Top Service Providers</Text>
                                <Text onPress={() => router.push("/(user)/search/type=top")} style={{ textDecorationLine: "underline" }}>See All</Text>
                            </View>
                            {
                                loadTop ?
                                    <View style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200, width: "100%" }}>
                                        <LottieView source={require("../../assets/images/loading.json")} loop={true} autoPlay style={{ width: 200, height: 250 }} />
                                    </View> :
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.serviceList}>
                                        {
                                            topServices?.map((service, i) => (
                                                <ServiceCard service={service} key={i} />
                                            ))
                                        }
                                    </ScrollView>
                            }
                        </View>
                        <View style={{ paddingHorizontal: 20, marginTop: 30 }}>
                            <View style={styles.serviceTitleContainer}>
                                <Text style={{ ...styles.title }}>Services Near You</Text>
                                <Text onPress={() => router.push("/(user)/search/type=location&value=near")} style={{ textDecorationLine: "underline" }}>See All</Text>
                            </View>
                            {
                                load ?
                                    <View style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200, width: "100%" }}>
                                        <LottieView source={require("../../assets/images/loading.json")} loop={true} autoPlay style={{ width: 200, height: 250 }} />
                                    </View> :
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.serviceList}>
                                        {
                                            services?.map((service, i) => (
                                                <ServiceCard service={service} key={i} />
                                            ))
                                        }
                                    </ScrollView>
                            }
                        </View>
                    </View>
                </ScrollView>
            </View>
        </View>
    )
}

export default Home

const styles = StyleSheet.create({
    container: {
        height: "95%",
        backgroundColor: "white"
    },
    heroText: {
        paddingTop: 90,
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: "#bde0fe"
    },
    title: {
        fontSize: 16,
        fontWeight: 700
    },
    greeting: {
        fontSize: 15,
        fontWeight: 500,
        marginTop: 10
    },
    categoryList: {
        display: "flex",
        flexDirection: "row",
        gap: 10,
        paddingEnd: 290,
        marginTop: 20,
    },
    serviceTitleContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    serviceList: {
        marginTop: 20,
        display: "flex",
        gap: 10,
        // paddingEnd: 10,
        flexDirection: "row",
    },
    loginButton: {
        width: "100%",
        height: 45,
        borderRadius: 10,
        backgroundColor: "#1B64F1",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    buttonText: {
        fontSize: 15,
        fontWeight: 600,
        color: "white"
    },
});