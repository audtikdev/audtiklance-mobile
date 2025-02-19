import { View, Text, StyleSheet, ScrollView, TextInput, useColorScheme, Image, Pressable } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { generalStyle } from '@/style/generalStyle'
import { getChatList } from '@/api/chat'
import LottieView from 'lottie-react-native'
import { router } from 'expo-router'
import { CHAT } from './type'
import Plan from '../Provider/Profile/Plan'
import { RootState } from '../Store/store'
import { useSelector } from 'react-redux'
import { Modalize } from 'react-native-modalize'
import { openLink } from '@/utils/helper'

const ChatList = () => {
    const colorScheme = useColorScheme() || "light"
    const authUser = useSelector((state: RootState) => state.authProvider.auth)
    const planRef = useRef<Modalize>(null)
    const [searchValue, setSearchValue] = useState("")
    const [chatList, setChatList] = useState<Array<CHAT>>([])
    const [load, setLoad] = useState(true)

    useEffect(() => {
        (async () => {
            setLoad(true)
            const response = await getChatList()
            if (response?.status === 201 || response?.status === 200) {
                const data = response?.data?.results
                setChatList(data)
            } else {
                router.push("/login")
            }
            setLoad(false)
        })()
    }, [])

    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 24, fontWeight: 600, }}>Chat</Text>
            <TextInput placeholderTextColor={"black"} onChangeText={(text) => setSearchValue(text)} value={searchValue} style={{ ...styles.registerInput }} placeholder='Search...' />
            {
                load ?
                    <View style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 500, width: "100%" }}>
                        <LottieView source={require("../../assets/images/service2.json")} loop={true} autoPlay style={{ width: 300, height: 350 }} />
                    </View> : chatList.length < 1 ?
                        <View style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 20, height: "80%", width: "100%" }}>
                            <Text style={{ fontSize: 14, fontWeight: 500 }}>You don't have any chats yet</Text>
                            {
                                authUser?.service_profile &&
                                <Text style={{ fontSize: 12, fontWeight: 600, textAlign: "center", paddingTop: 10 }}>Rank higher than others and get more leads</Text>
                            }
                            <Image style={{ width: 300, height: 300, paddingVertical: 40 }} source={require("../../assets/images/Empty-product.png")} />
                            {
                                authUser?.service_profile &&
                                <Pressable onPress={() => openLink('https://app.audtiklance.com/pricing')} style={{ ...styles.numberButton, ...generalStyle.button.active }}><Text style={{ color: "white" }}>Get more leads</Text></Pressable>
                            }
                        </View> :
                        <ScrollView showsVerticalScrollIndicator={false} style={{ width: "100%" }}>
                            {
                                chatList?.map((chat, i) => (
                                    <Pressable onPress={() => router.push(`/chat/${chat?.recipient?.id}/${chat?.id}`)} key={i} style={styles.chatContainer}>
                                        <Image style={styles.image} source={{ uri: chat?.recipient?.profile_picture }} />
                                        <View style={{ width: "100%" }}>
                                            <View style={styles.nameView}>
                                                <Text style={{textTransform: "capitalize"}}>{chat?.recipient?.firstname}</Text>
                                                <Text>{new Date(chat?.updated_at).getHours()}:{new Date(chat?.updated_at).getMinutes()}</Text>
                                            </View>
                                            <Text style={{ ...styles.text }} numberOfLines={1}>{chat?.last_message_content}</Text>
                                        </View>
                                    </Pressable>
                                ))
                            }
                        </ScrollView>
            }
            <Plan planRef={planRef} />
        </View>
    )
}

export default ChatList

const styles = StyleSheet.create({
    container: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        height: "100%",
        width: "100%",
        padding: 15,
        paddingTop: 80,
        paddingBottom: 100
    },
    registerInput: {
        height: 50,
        borderWidth: 1,
        flexShrink: 1,
        width: '100%',
        marginBottom: 20,
        paddingLeft: 10,
        borderRadius: 5,
        marginTop: 20
    },
    chatContainer: {
        display: "flex",
        flexDirection: "row",
        columnGap: 10,
        alignItems: "center",
        width: "98%",
        padding: 10
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
    nameView: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "86%"
    },
    image: {
        borderRadius: 60,
        width: 50,
        height: 50,
    },
    text: {
        width: "86%",
        fontSize: 14,
        fontWeight: 600,
        marginTop: 7
    }
})