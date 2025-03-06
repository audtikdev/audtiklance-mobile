import { View, Text, StyleSheet, Image, Pressable, ScrollView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { AntDesign, Entypo, EvilIcons, Ionicons } from '@expo/vector-icons'
import Constants from 'expo-constants'
import { formatCurrency } from '@/utils/helper'
import { router } from 'expo-router'
import ReviewCard from '../Review/ReviewCard'
import { Review, Service } from '@/types/service'
import axios from 'axios'
import LottieView from 'lottie-react-native'
import { Modalize } from 'react-native-modalize'
import OurProvider from './OurProvider'
import ExtProvider from './ExtProvider'
import { RootState } from '../Store/store'
import { useSelector } from 'react-redux'
import FlagOrReportService, { RateModal } from './FlagModal'
import { getServiceReview } from '@/api/service'
import OurReview from '../Review/OurReview'
import Quote from '../Quote/Quote'

const ServiceDescription: React.FC<{ id: string }> = ({ id }) => {
    const authUser = useSelector((state: RootState) => state.authProvider.auth)
    const [service, setService] = useState<Service | null>(null)
    const [reviews, setReviews] = useState<Review[]>([])
    const [load, setLoad] = useState(true)
    const [showQuoteModal, setShowQuoteModal] = useState(false)
    const ourProviderRef = useRef<Modalize>(null)
    const extProviderRef = useRef<Modalize>(null)
    const flagOrReportRef = useRef<Modalize>(null)
    const rateRef = useRef<Modalize>(null)
    const baseUrl = Constants.expoConfig?.extra?.BASE_API

    const fetchService = async () => {
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
        const res = await getServiceReview(id)
        if (res?.status === 200) {
            setReviews(res?.data?.data)
        }
    }

    useEffect(() => {
        (async () => {
            setLoad(true)
            await fetchService()
        })()
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
        <View>
            {
                load ?
                    <View>
                        <Pressable onPress={() => router.back()} style={{ display: "flex", flexDirection: "row", alignItems: "center", paddingTop: 50, paddingLeft: 20 }}>
                            <Ionicons name="chevron-back-outline" size={24} color="black" />
                            <Text style={{ fontSize: 18 }}>Back</Text>
                        </Pressable>
                        <View style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 750, width: "100%" }}>
                            <LottieView source={require("../../assets/images/service2.json")} loop={true} autoPlay style={{ width: 300, height: 350 }} />
                        </View>
                    </View> :
                    <View style={{ padding: 10, paddingTop: 50, backgroundColor: 'white' }}>
                        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                            <Pressable onPress={() => router.back()} style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                <Ionicons name="chevron-back-outline" size={24} color="black" />
                                <Text style={{ fontSize: 18 }}>Back</Text>
                            </Pressable>
                            <Entypo onPress={() => flagOrReportRef.current?.open()} name="dots-three-vertical" size={18} color="black" />
                        </View>
                        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                            <View style={{ paddingBottom: 20 }}>
                                <Text style={{ marginTop: 10, fontSize: 16, fontWeight: 500 }}>{service?.business_name}</Text>
                                <Image style={{ width: '100%', height: 300, marginTop: 20 }} source={service?.profile_picture ? { uri: service.profile_picture } : require("../../assets/images/placeholder.png")} />
                                <Text style={{ marginTop: 20, fontSize: 16, fontWeight: 500 }}>Services offered</Text>
                                <View style={{ display: 'flex', flexDirection: 'row', gap: 10, marginTop: 5, flexWrap: 'wrap' }}>
                                    {
                                        service?.sub_category?.map((category, i) => (
                                            <Text key={i} style={styles.pillText}>{category?.sub_category}</Text>
                                        ))
                                    }
                                </View>
                                <View style={{ marginTop: 20, display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                    <Text style={{ fontSize: 16, fontWeight: 500 }}>About me</Text>
                                    {
                                        !service?.is_google_place &&
                                        <Text style={{ fontSize: 16, fontWeight: 500 }}>From {formatCurrency("en-US", "USD", Number(service?.sub_category?.[0]?.cost!))}</Text>
                                    }
                                </View>
                                <View style={{ marginTop: 10, display: 'flex', flexDirection: 'row', alignItems: 'center', columnGap: 10 }}>
                                    <Image style={styles.dpImage} source={service?.profile_picture ? { uri: service.profile_picture } : require("../../assets/images/placeholder.png")} />
                                    <View>
                                        <Text>{service?.owner_name}</Text>
                                        <View style={{ display: 'flex', marginLeft: -5, flexDirection: 'row', alignItems: 'center', columnGap: 5 }}>
                                            <EvilIcons name="location" size={20} color="black" />
                                            <Text>{service?.address}</Text>
                                        </View>
                                    </View>
                                </View>
                                {!service?.is_google_place && <Text style={{ marginTop: 15 }}>Get a <Text onPress={()=> setShowQuoteModal(true)} style={{ color: 'blue' }}>free quote</Text> from this professional</Text>}
                                <Text style={{ marginTop: 20, marginBottom: 5, fontSize: 16, fontWeight: 500 }}>Overview</Text>
                                <Text>{service?.about_me}</Text>
                                <View style={{ marginTop: 25, display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                    <Text style={{ fontSize: 16, fontWeight: 600 }}>Review From Client</Text>
                                    <Text onPress={() => router.push(`/reviews/${service?.id}`)} style={{ textDecorationLine: "underline" }}>View all</Text>
                                </View>
                                <View>
                                    {
                                        reviews?.length > 0 ?
                                            <View>
                                                <OurReview review={reviews[0]} />
                                            </View> :
                                            <View>
                                                {
                                                    !service?.external_reviews || service?.external_reviews?.length < 1 || Object.keys(service?.external_reviews)?.length < 1 ?
                                                        <Text style={{ marginVertical: 30, textAlign: "center" }}>No Review Yet</Text> :
                                                        <ReviewCard review={service?.external_reviews?.[0]!} />
                                                }
                                            </View>
                                    }
                                </View>
                                <Pressable onPress={bookService} style={styles.bookButton}><Text style={{ color: "white", fontSize: 16 }}>Book Now</Text></Pressable>
                                <Pressable onPress={() => rateRef.current?.open()} style={styles.reviewButton}><Text style={{ color: "#1B64F1", fontSize: 16 }}>Drop a review</Text></Pressable>
                            </View>
                        </ScrollView>
                    </View>
            }
            <OurProvider ourProviderRef={ourProviderRef} service={service!} />
            <ExtProvider extProviderRef={extProviderRef} service={service!} />
            <FlagOrReportService flagOrReportRef={flagOrReportRef} service={service!} bookService={bookService} />
            <RateModal rateRef={rateRef} serviceID={service?.id!} />
            <Quote showModal={showQuoteModal} setShowModal={setShowQuoteModal} serviceID={service?.id!} />
        </View>
    )
}

export default ServiceDescription

const styles = StyleSheet.create({
    container: {
        marginBottom: 300,
        height: "76%",
        marginTop: 10
    },
    pillText: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 40,
        fontSize: 13,
        backgroundColor: '#F3F4F6'
    },
    dpImage: {
        width: 50,
        height: 50,
        borderRadius: 100
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
    },
    reviewButton: {
        width: "100%",
        height: 50,
        borderRadius: 10,
        marginTop: 10,
        borderColor: "#1B64F1",
        borderWidth: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }
})