import { View, Text, StyleSheet, useColorScheme, Image, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/components/Store/store'
import { getNotification, getUser } from '@/api/auth'
import { updateAuth } from '@/components/Context/authProvider'
import { Feather, FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { formatCurrency } from '@/utils/helper'
import { ScrollView } from 'react-native-gesture-handler'
import { generalStyle } from '@/style/generalStyle'
import LottieView from 'lottie-react-native'
import { router } from 'expo-router'
import { getServiceProfile } from '@/api/service'
import { CHAT } from '@/components/Chat/type'
import { getChatList } from '@/api/chat'
import { getLeads } from '@/api/leads'
import { NOTIFICATION } from '@/types/auth'

const Home = () => {
    const authUser = useSelector((state: RootState) => state.authProvider.auth)
    const dispatch = useDispatch()
    const [load, setLoad] = useState(true)
    const [chatNum, setChatNum] = useState<number>(0)
    const [leadNum, setLeadNum] = useState<number>(0)
    const [notifications, setNotifications] = useState<Array<NOTIFICATION>>([])

    useEffect(() => {
        (async () => {
            setLoad(true)
            const response = await getUser()
            const chatRes = await getChatList()
            const leadRes = await getLeads()
            const notifyRes = await getNotification()
            
            if (response?.status === 201 || response?.status === 200) {
                setChatNum(chatRes?.data?.count)
                setLeadNum(leadRes?.data?.count)
                setNotifications(notifyRes?.data?.results)
                const data = response.data?.data
                dispatch(updateAuth({ auth: data }))
                const res = await getServiceProfile(data?.service_profile)
                dispatch(updateAuth({ auth: res?.data }))
            } else {
                router.push("/login")
            }
            setLoad(false)
        })()
    }, [])

    return (
        <View style={{ ...styles.container }}>
            {
                load ?
                    <View style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 750, width: "100%" }}>
                        <LottieView source={require("../../../assets/images/service2.json")} loop={true} autoPlay style={{ width: 300, height: 350 }} />
                    </View> :
                    <>
                        <Text style={{ fontSize: 20, fontWeight: 700, textTransform: "capitalize" }}>Welcome back, {authUser?.firstname}!</Text>
                        <Text style={{ fontSize: 14, fontWeight: 400, marginTop: 5 }}>Here's what's happening with your business today.</Text>
                        <View style={styles.scrollContainer}>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={{ ...styles.smallContainer, width: "100%", marginTop: 20 }}>
                                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                        <Text style={{ fontSize: 16, fontWeight: 500 }}>Current Services</Text>
                                        <MaterialIcons name="home-repair-service" size={30} color="black" />
                                    </View>
                                    {
                                        authUser?.sub_category?.map((serv, i) => (
                                            <View key={i} style={{ display: "flex", marginTop: 15, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                                <View>
                                                    <Text style={{ fontSize: 18, fontWeight: 600 }}>{serv?.sub_category}</Text>
                                                    <Text style={{ marginTop: 5 }}>{formatCurrency("en-US", "USD", Number(serv?.cost))}</Text>
                                                </View>
                                                <Text>{serv?.time_frame}</Text>
                                            </View>
                                        ))
                                    }
                                </View>
                                <View style={styles.firstContainer}>
                                    <Pressable onPress={() => router.push("/(provider)/chat")} style={styles.smallContainer}>
                                        <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                            <Text style={{ fontSize: 14, fontWeight: 500 }}>Total Messages</Text>
                                            <MaterialCommunityIcons name="android-messages" size={24} color="black" />
                                        </View>
                                        <Text style={{ fontSize: 24, fontWeight: 700, textTransform: "capitalize", marginTop: 40 }}>{chatNum}</Text>
                                    </Pressable>
                                    <Pressable onPress={() => router.push("/leads")} style={styles.smallContainer}>
                                        <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                            <Text style={{ fontSize: 14, fontWeight: 500 }}>Total Leads</Text>
                                            <FontAwesome name="users" size={20} color="black" />
                                        </View>
                                        <Text style={{ fontSize: 24, fontWeight: 700, textTransform: "capitalize", marginTop: 40 }}>{leadNum}</Text>
                                    </Pressable>
                                </View>
                                <View style={{ ...styles.smallContainer, width: "100%", marginTop: 20 }}>
                                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                        <Text style={{ fontSize: 16, fontWeight: 500 }}>Notifications</Text>
                                        <Feather name="activity" size={30} color="black" />
                                    </View>
                                    {
                                        notifications?.slice(0, 6).map((notification, i) => (
                                            <View key={i} style={{ display: "flex", marginTop: 15, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                                <View style={{ display: "flex", flexDirection: "row", columnGap: 10, alignItems: "center" }}>

                                                    <Text>{notification?.notification_message}</Text>
                                                </View>
                                                <Text>{new Date(Date.parse(notification?.created_at as string)).toLocaleDateString()}</Text>
                                            </View>
                                        ))
                                    }
                                </View>
                            </ScrollView>
                        </View>
                    </>
            }
        </View>
    )
}

export default Home

const styles = StyleSheet.create({
    container: {
        padding: 15,
        paddingTop: 90,
        backgroundColor: "white",
        height: "100%"
    },
    firstContainer: {
        display: "flex",
        flexDirection: 'row',
        width: "100%",
        alignItems: "flex-start",
        columnGap: 10,
        marginTop: 25
    },
    scrollContainer: {
        height: '91%',
        paddingTop: 20,
        paddingBottom: 5
    },
    smallContainer: {
        width: "49%",
        borderRadius: 6,
        backgroundColor: "#F5F7F8",
        padding: 12,
        paddingBottom: 20
    }
})