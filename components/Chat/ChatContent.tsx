import { View, Text, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, TouchableNativeFeedback, Keyboard, useColorScheme, Pressable, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { MESSAGE } from './type'
import { createConversation, getPreviousConversation, sendMessage } from '@/api/chat'
import Toast from 'react-native-toast-message'
import { Feather, Fontisto, Ionicons } from '@expo/vector-icons'
import { generalStyle } from '@/style/generalStyle'
import { router } from 'expo-router'
import LottieView from 'lottie-react-native'

const ChatContent: React.FC<{ convoId: string, recipientId: string }> = ({ convoId, recipientId }) => {
    const [conversationID, setConversationID] = useState(convoId)
    const [recipient, setRecipient] = useState()
    const colorScheme = useColorScheme() || "light"
    const [messages, setMessages] = useState<Array<MESSAGE>>([])
    const [inputValue, setInputValue] = useState("")
    const [load, setLoad] = useState(false)
    const [sendLoad, setSendLoad] = useState(false)
    // console.log(convoId, recipientId);

    useEffect(() => {
        (async () => {
            setLoad(true)
            if (conversationID !== "null") {
                const response = await getPreviousConversation(conversationID)
                if (response?.status === 201 || response?.status === 200) {
                    const data = response.data?.data
                    setMessages(data)
                } else {
                    Toast.show({
                        type: "error",
                        text1: "Error fetching conversation"
                    })
                }
            } else {
                const response = await createConversation({ user: recipientId })
                if (response?.status === 201 || response?.status === 200) {
                    const data = response.data?.data
                    setConversationID(data?.id)
                } else {
                    Toast.show({
                        type: "error",
                        text1: "Error creating conversation"
                    })
                }
            }
            setLoad(false)
        })()
    }, [conversationID])

    const sendUserMessage = async () => {
        if (!inputValue) {
            return
        }
        setSendLoad(true)
        const body = {
            content: inputValue
        }
        const response = await sendMessage(conversationID, body)
        if (response?.status === 201 || response?.status === 200) {
            const data = response.data?.data
            setMessages([...messages, data])
            setInputValue("")
        } else {
            Toast.show({
                type: "error",
                text1: "Error sending message"
            })
        }
        setSendLoad(false)
    }

    return (
        <KeyboardAvoidingView>
            <TouchableNativeFeedback onPress={Keyboard.dismiss}>
                {
                    load ?
                        <View style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", width: "100%" }}>
                            <LottieView source={require("../../assets/images/service2.json")} loop={true} autoPlay style={{ width: 300, height: 350 }} />
                        </View> :
                        <View style={styles.container}>
                            <View style={styles.heading}>
                                <Pressable onPress={() => router.back()} style={styles.buttons}>
                                    <Ionicons name="arrow-back" size={24} color="black" />
                                    <Text>Back</Text>
                                </Pressable>
                                <Text style={{ fontSize: 18 }}>Receiver</Text>
                                <View style={{ ...styles.buttons, columnGap: 20 }}>
                                    <Ionicons name="call-outline" size={24} color="black" />
                                    <Fontisto name="email" size={24} color="black" />
                                </View>
                            </View>
                            <ScrollView contentContainerStyle={styles.chatContainer}>
                                {
                                    messages?.map((message, i) => (
                                        <View key={i} style={{ ...styles.chatView, alignSelf: message?.is_sender ? "flex-end" : "flex-start" }}>
                                            <Text style={{ width: "80%", color: "white" }}>{message?.content}</Text>
                                            <Text style={{ color: "white", fontSize: 12 }}>{new Date(message?.updated_at)?.toLocaleTimeString()}</Text>
                                        </View>
                                    ))
                                }
                            </ScrollView>
                            <View style={styles.inputView}>
                                <TextInput value={inputValue} multiline onChangeText={(text) => setInputValue(text)} placeholderTextColor={generalStyle.text[colorScheme].color} placeholder='Enter your message' style={{ ...styles.input, ...generalStyle.border[colorScheme] }} />
                                <Pressable onPress={() => sendUserMessage()} style={styles.sendView}>
                                    {
                                        sendLoad ?
                                            <ActivityIndicator /> :
                                            <Feather name="send" size={20} color="white" />
                                    }
                                </Pressable>
                            </View>

                        </View>
                }
            </TouchableNativeFeedback>
        </KeyboardAvoidingView>
    )
}

export default ChatContent

const styles = StyleSheet.create({
    container: {
        padding: 15,
        paddingTop: 80,
        position: "relative",
        height: "100%"
    },
    heading: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start"
    },
    buttons: {
        display: "flex",
        flexDirection: "row",
        columnGap: 5,
        alignItems: "center",
        marginBottom: 20
    },
    chatContainer: {
        marginVertical: 10,
        display: "flex",
        alignItems: "center"
    },
    chatView: {
        display: "flex",
        columnGap: 10,
        flexDirection: "row",
        alignItems: "flex-end",
        width: "80%",
        padding: 8,
        marginVertical: 10,
        backgroundColor: "#1B64F1",
        borderRadius: 6,
    },
    inputView: {
        width: "100%",
        position: "absolute",
        right: 15,
        bottom: 40,
        display: "flex",
        flexDirection: "row",
        columnGap: 15,
        alignItems: "center"
    },
    sendView: {
        width: 40,
        height: 40,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1B64F1",
        borderRadius: 40
    },
    input: {
        height: 40,
        borderWidth: 1,
        flexShrink: 1,
        width: '90%',
        paddingLeft: 10,
        borderRadius: 5,
    }
})