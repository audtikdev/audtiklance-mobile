// @ts-nocheck
import { View, Text, StyleSheet, ScrollView, TextInput, useColorScheme, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { generalStyle } from '@/style/generalStyle'
import { getChatList } from '@/api/chat'
import LottieView from 'lottie-react-native'
import { router } from 'expo-router'

const ChatList = () => {
    const colorScheme = useColorScheme() || "light"
    const [searchValue, setSearchValue] = useState("")
    const [chatList, setChatList] = useState([])
    const [load, setLoad] = useState(true)

    useEffect(() => {
        (async () => {
            setLoad(true)
            const response = await getChatList()
            if (response?.status === 201 || response?.status === 200) {
                const data = response?.data?.results
                console.log(data);
                setChatList(data)
            } else {
                router.push("/login")
            }
            setLoad(false)
        })()
    }, [])

    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 24, fontWeight: 600, ...generalStyle.text[colorScheme] }}>Chat</Text>
            <TextInput placeholderTextColor={generalStyle.text[colorScheme].color} onChangeText={(text) => setSearchValue(text)} value={searchValue} style={{ ...styles.registerInput, ...generalStyle.border[colorScheme], ...generalStyle.text[colorScheme] }} placeholder='Search...' />
            {
                load ?
                    <View style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 500, width: "100%" }}>
                        <LottieView source={require("../../assets/images/service2.json")} loop={true} autoPlay style={{ width: 300, height: 350 }} />
                    </View> :
                    <ScrollView showsVerticalScrollIndicator={false} style={{ width: "100%" }}>
                        {
                            chatList?.map((chat, i) => (
                                <View key={i} style={styles.chatContainer}>
                                    <Image style={styles.image} source={{uri: chat?.recipient?.profile_picture}} />
                                    <View style={{ width: "100%" }}> 
                                        <View style={styles.nameView}>
                                            <Text style={{ ...generalStyle.text[colorScheme] }}>{chat?.recipient?.firstname}</Text>
                                            <Text style={{ ...generalStyle.text[colorScheme] }}>{new Date(chat?.updated_at).getHours()}:{new Date(chat?.updated_at).getMinutes()}</Text>
                                        </View>
                                        <Text style={{ ...styles.text, ...generalStyle.text[colorScheme] }} numberOfLines={1}>{chat?.last_message_content}</Text>
                                    </View>
                                </View>
                            ))
                        }
                    </ScrollView>
            }
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
        width: "100%",
        padding: 10
    },
    nameView: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "86%"
    },
    image: {
        borderRadius: "100%",
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