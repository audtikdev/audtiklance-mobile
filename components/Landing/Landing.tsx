import { View, Text, Image, Pressable, StyleSheet, useColorScheme } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { generalStyle } from '@/style/generalStyle'
import LottieView from 'lottie-react-native'
import Swiper from 'react-native-swiper'
import { carouselData } from '@/data/landing'
import { Modalize } from 'react-native-modalize';
import { router } from 'expo-router'
import { getUser } from '@/api/auth'

const Landing = () => {
    const colorScheme = useColorScheme() || "light"
    const swiperRef = useRef<Swiper>(null);
    const modalizeRef = useRef<Modalize>(null)

    const slideAnimationFinish = () => {
        swiperRef.current?.scrollBy(1)
    }

    useEffect(() => {
        (async () => {
            const response = await getUser()
            if (response?.status === 201 || response?.status === 200) {
                const data = response?.data?.data
                if (data?.service_profile) {
                    router.push("/(provider)")
                } else {
                    router.push("/(user)")
                }
            }
        })()
    }, [])

    return (
        <>
            <View style={styles.landingContainer}>
                <Swiper style={styles.landingFirst} ref={swiperRef} dotStyle={{ width: 10, height: 10, borderRadius: 10 }} activeDotStyle={{ width: 10, height: 10, borderRadius: 10 }} activeDotColor="#1B64F1" dotColor='#D9D9D9'>
                    {
                        carouselData?.map((data) => (
                            <View style={styles.carouselView} key={data.title}>
                                <LottieView onAnimationFinish={slideAnimationFinish} source={data.image} loop={false} autoPlay style={{ width: 300, height: 350 }} />
                                <Text style={{ ...styles.landingTitle, ...generalStyle.text[colorScheme] }}>{data?.title}</Text>
                                <Text style={{ ...styles.landingText, ...generalStyle.text[colorScheme] }}>{data?.text}</Text>
                            </View>
                        ))
                    }
                </Swiper>
                <View style={styles.landingSecond}>
                    <Pressable onPress={() => router.push("/login")} style={styles.loginButton}><Text style={{ ...styles.buttonText, color: "white" }}>Login</Text></Pressable>
                    <Pressable onPress={() => modalizeRef.current?.open()} style={{ ...styles.registerButton, ...generalStyle.border[colorScheme] }}><Text style={{ ...styles.buttonText, ...generalStyle.text[colorScheme] }}>Create An Account</Text></Pressable>
                    <Text onPress={() => router.push("/(user)")} style={{ ...styles.guestText, ...generalStyle.text[colorScheme] }}>Login as a guest</Text>
                </View>
            </View>
            <Modalize
                ref={modalizeRef}
                adjustToContentHeight={true}
                modalStyle={generalStyle.background[colorScheme]}
            >
                <View style={styles.modalContent}>
                    <Pressable onPress={() => router.push("/userRegister")} style={{ ...styles.loginButton, marginTop: 40 }}><Text style={{ ...styles.buttonText, ...generalStyle.buttonText.light }}>I am looking for service providers</Text></Pressable>
                    <Pressable onPress={() => router.push("/providerRegister1")} style={{ ...styles.registerButton, ...generalStyle.border[colorScheme] }}><Text style={{ ...styles.buttonText, ...generalStyle.text[colorScheme] }}>I am a service provider</Text></Pressable>
                </View>
            </Modalize>
        </>
    )
}

export default Landing

const styles = StyleSheet.create({
    landingContainer: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 20
    },
    landingFirst: {
        paddingTop: 80,
    },
    landingSecond: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 30,
    },
    modalContent: {
        padding: 20,
        paddingTop: 1,
        height: 220
    },
    carouselView: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    landingTitle: {
        fontSize: 24,
        fontWeight: 600,
        marginTop: 20,
        textAlign: "center"
    },
    landingText: {
        fontSize: 18,
        fontWeight: 500,
        marginTop: 20,
        textAlign: "center"
    },
    loginButton: {
        width: "100%",
        height: 52,
        borderRadius: 10,
        backgroundColor: "#1B64F1",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    registerButton: {
        width: "100%",
        height: 52,
        borderRadius: 10,
        borderWidth: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 500
    },
    guestText: {
        fontSize: 18,
        marginTop: 20,
        textDecorationLine: "underline"
    }
})