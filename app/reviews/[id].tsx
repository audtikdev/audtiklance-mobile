import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import ReviewCard from '@/components/Review/ReviewCard'
import {  Review } from '@/types/service'
import Constants from 'expo-constants'
import axios from 'axios'
import LottieView from 'lottie-react-native'
import { getServiceReview } from '@/api/service'
import OurReview from '@/components/Review/OurReview'

const Reviews = () => {
    const { id } = useLocalSearchParams();
    const [reviews, setReviews] = useState<Review[]>([])
    const [load, setLoad] = useState(true)
    const baseUrl = Constants.expoConfig?.extra?.BASE_API

    useEffect(() => {
        (async () => {
            setLoad(true)
            const res = await getServiceReview(id as string)
            if (res?.status === 200) {
                setReviews(res?.data)
            }
            setLoad(false)
        })()
    }, [id])

    return (
        <ScrollView style={styles.container}>
            {
                load ?
                    <View style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 750, width: "100%" }}>
                        <LottieView source={require("../../assets/images/service2.json")} loop={true} autoPlay style={{ width: 300, height: 350 }} />
                    </View> :

                    <>
                        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                            <Pressable onPress={() => router.back()} style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                <Ionicons name="chevron-back-outline" size={24} color="black" />
                                <Text style={{ fontSize: 18 }}>Back</Text>
                            </Pressable>
                            <Text style={{ fontSize: 18, fontWeight: 600 }}>{reviews?.[0]?.business?.title}</Text>
                        </View>
                        <View>
                            {
                                reviews?.length > 0 ?
                                    <View style={{ marginTop: 20 }}>
                                        {
                                            reviews?.map((review, i) => (
                                                <OurReview review={review} key={i} truncate={false} />
                                            ))
                                        }
                                    </View> :
                                    <View>
                                        {/* {
                                            !reviews || reviews?.length < 1 || Object.keys(reviews)?.length < 1 ?
                                                <Text style={{ marginVertical: 30, textAlign: "center", fontSize: 16 }}>No Review Yet</Text> :
                                                <View style={{ marginTop: 20 }}>
                                                    {
                                                        service?.reviews?.map((review, i) => (
                                                            <ReviewCard review={review} key={i} truncate={false} />
                                                        ))
                                                    }
                                                </View>
                                        } */}
                                    </View>
                            }
                        </View>
                    </>
            }
        </ScrollView>
    )
}

export default Reviews

const styles = StyleSheet.create({
    container: {
        paddingTop: 90,
        paddingHorizontal: 20,
        marginBottom: 30,
        height: "95%"
    },
})