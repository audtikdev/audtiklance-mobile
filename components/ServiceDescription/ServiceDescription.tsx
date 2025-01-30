import { View, Text, StyleSheet, Image, Pressable, ScrollView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { AntDesign, Entypo, EvilIcons, Ionicons } from '@expo/vector-icons'
import Constants from 'expo-constants'
import { formatCurrency } from '@/utils/helper'
import { router } from 'expo-router'
import ReviewCard from '../Review/ReviewCard'
import { Service } from '@/types/service'
import axios from 'axios'
import LottieView from 'lottie-react-native'
import { Modalize } from 'react-native-modalize'
import OurProvider from './OurProvider'
import ExtProvider from './ExtProvider'
import { RootState } from '../Store/store'
import { useSelector } from 'react-redux'
import FlagOrReportService from './FlagModal'

const ServiceDescription: React.FC<{ id: string }> = ({ id }) => {
    const authUser = useSelector((state: RootState) => state.authProvider.auth)
    const [service, setService] = useState<Service | null>(null)
    const [load, setLoad] = useState(true)
    const ourProviderRef = useRef<Modalize>(null)
    const extProviderRef = useRef<Modalize>(null)
    const flagOrReportRef = useRef<Modalize>(null)
    const baseUrl = Constants.expoConfig?.extra?.BASE_API

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

    const bookService = () => {
        if (!authUser?.access) {
            router.push("/login")
        } else {
            if (service?.is_google_place) {
                extProviderRef.current?.open()
            } else {
                ourProviderRef.current?.open()
            }
        }
    }

    return (
        <>
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
                                    <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                                        <Pressable onPress={() => router.back()} style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                            <Ionicons name="chevron-back-outline" size={24} color="black" />
                                            <Text style={{ fontSize: 18 }}>Back</Text>
                                        </Pressable>
                                        <Entypo onPress={()=> flagOrReportRef.current?.open()} name="dots-three-vertical" size={18} color="black" />
                                    </View>
                                    <Text style={{ marginTop: 50, fontSize: 20 }}>{service?.business_name}</Text>
                                    {!service?.is_google_place && <Text style={{ marginTop: 10, fontSize: 30 }}>{formatCurrency("en-US", "USD", Number(service?.sub_category?.[0]?.cost!))}</Text>}
                                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                                        <EvilIcons name="location" size={24} color="black" />
                                        <Text style={{ fontSize: 16 }}>{service?.address}</Text>
                                    </View>
                                    {service?.external_rating && <View style={styles.ratingView}>
                                        <AntDesign name="star" size={20} color="gold" />
                                        <Text>{!service?.is_google_place ? "5.5" : service?.external_rating}</Text>
                                    </View>}
                                    {service?.is_google_place && <View style={styles.thirdParty}>
                                        <Text>Third Party</Text>
                                    </View>}
                                </View>
                                <View style={styles.imageContainer}>
                                    <Image style={styles.image} source={{ uri: service?.profile_picture }} />
                                </View>
                            </View>
                            <View style={{ width: "100%", paddingHorizontal: 20, marginTop: 20, }}>
                                <Text style={{ fontSize: 20, fontWeight: 600 }}>About me</Text>
                                <Text style={{ fontSize: 16, marginTop: 10, lineHeight: 23 }}>{service?.about_me}</Text>
                                <View style={{ marginTop: 25, display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                    <Text style={{ fontSize: 20, fontWeight: 600 }}>Review From Client</Text>
                                    <Text onPress={() => router.push(`/reviews/${service?.id}`)} style={{ textDecorationLine: "underline" }}>View all</Text>
                                </View>
                                {
                                    !service?.external_reviews || service?.external_reviews?.length < 1 || Object.keys(service?.external_reviews)?.length < 1 ?
                                        <Text style={{ marginVertical: 30, textAlign: "center" }}>No Review Yet</Text> :
                                        <ReviewCard review={service?.external_reviews?.[0]!} />
                                }
                                <Pressable onPress={bookService} style={styles.bookButton}><Text style={{ color: "white", fontSize: 16 }}>Book Now</Text></Pressable>
                            </View>
                        </View>
                }
            </ScrollView>
            <OurProvider ourProviderRef={ourProviderRef} service={service!} />
            <ExtProvider extProviderRef={extProviderRef} service={service!} />
            <FlagOrReportService flagOrReportRef={flagOrReportRef} name={service?.business_name!} bookService={bookService} />
        </>
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
    thirdParty: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        gap: 6,
        marginTop: 10,
        backgroundColor: "white",
        width: 90,
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