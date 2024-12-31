import { View, Text, StyleSheet, useColorScheme, ScrollView, Alert } from 'react-native'
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
import { Service } from '@/types/service'
import axios from 'axios'
import LottieView from 'lottie-react-native'
import { router } from 'expo-router'

const Home = () => {
    const userLocation = useSelector((state: RootState) => state.locationProvider.location)
    const colorScheme = useColorScheme() || "light"
    const [status, requestPermission] = Location.useForegroundPermissions();
    const [load, setLoad] = useState(false)
    const [services, setServices] = useState<Service[]>([])
    const [topServices, setTopServices] = useState<Service[]>([])
    const dispatch = useDispatch()

    const baseUrl = Constants.expoConfig?.extra?.BASE_API

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
        (async ()=> {
            setLoad(true)
            const url = `${baseUrl}/service/?search=a&longitude=${userLocation?.coords?.longitude}&latitude=${userLocation?.coords?.latitude}&page=1`;
            const url2 = `${baseUrl}/service/`;
            const [response1, response2] = await Promise.all([axios.get(url), axios.get(url2)])
            setServices(response1?.data.results);
            setTopServices(response2?.data?.results)
            setLoad(false)
        })()
    }, [userLocation])

    return (
        <ScrollView style={styles.container}>
            <View style={styles.heroText}>
                <Text style={{ ...styles.title, ...generalStyle.text.light }}>Hi Rejoice</Text>
                <Text style={{ ...styles.greeting, ...generalStyle.text.light }}>What services do you need?</Text>
            </View>
            <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
                <Text style={{ ...styles.title, ...generalStyle.text[colorScheme] }}>Popular Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryList}>
                    {
                        popularCategories?.map((category, i) => (
                            <CategoryCard key={i} category={category} />
                        ))
                    }
                </ScrollView>
            </View>
            <View style={{ paddingHorizontal: 20, marginTop: 30 }}>
                <View style={styles.serviceTitleContainer}>
                    <Text style={{ ...styles.title, ...generalStyle.text[colorScheme] }}>Top Service Providers</Text>
                    <Text onPress={()=> router.push("/(user)/search/type=top")} style={{ textDecorationLine: "underline", ...generalStyle.text[colorScheme] }}>See All</Text>
                </View>
                {
                    load ?
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
                    <Text style={{ ...styles.title, ...generalStyle.text[colorScheme] }}>Services Near You</Text>
                    <Text onPress={()=> router.push("/(user)/search/type=location&value=near")} style={{ textDecorationLine: "underline", ...generalStyle.text[colorScheme] }}>See All</Text>
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
        </ScrollView>
    )
}

export default Home

const styles = StyleSheet.create({
    container: {
        marginBottom: 100,
        height: "90%"
    },
    heroText: {
        paddingTop: 90,
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: "#bde0fe"
    },
    title: {
        fontSize: 20,
        fontWeight: 700
    },
    greeting: {
        fontSize: 18,
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
    }
});