import { View, Text, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, TouchableNativeFeedback, Keyboard, useColorScheme, Pressable, ActivityIndicator, Platform } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { MESSAGE } from './type'
import { createConversation, getPreviousConversation, sendMessage } from '@/api/chat'
import Toast from 'react-native-toast-message'
import { Entypo, Feather, Fontisto, Ionicons } from '@expo/vector-icons'
import { generalStyle } from '@/style/generalStyle'
import { router } from 'expo-router'
import LottieView from 'lottie-react-native'
import * as Notifications from 'expo-notifications';
import { RootState } from '../Store/store'
import { useSelector } from 'react-redux'
import { getUserByID } from '@/api/auth'
import { Modalize } from 'react-native-modalize'
import ChatModal from './ChatModal'
import { openLink } from '@/utils/helper'

const ChatContent: React.FC<{ convoId: string, recipientId: string }> = ({ convoId, recipientId }) => {
    const authUser = useSelector((state: RootState) => state.authProvider.auth)
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const [conversationID, setConversationID] = useState(convoId)
    const [recipient, setRecipient] = useState<{email: string}>()
    const colorScheme = useColorScheme() || "light"
    const [messages, setMessages] = useState<Array<MESSAGE>>([])
    const [inputValue, setInputValue] = useState("")
    const [load, setLoad] = useState(false)
    const [sendLoad, setSendLoad] = useState(false)
    const scrollViewRef = useRef<ScrollView>(null);
    const chatModalRef = useRef<Modalize>(null)

    const getConversation = async () => {
        const response = await getPreviousConversation(conversationID)
        if (response?.status === 201 || response?.status === 200) {
            const data = response.data?.data
            setMessages(data)
            await getRecipient()
        } else {
            Toast.show({
                type: "error",   
                text1: "Error fetching conversation"
            })
        }
    }

    const getRecipient = async () => {
        const response = await getUserByID(recipientId)
        if (response?.status === 200) {            
            setRecipient(response?.data)
            console.log(response?.data);
        }

    }

    async function registerForPushNotificationsAsync() {
        let token;
        if (Platform.OS === 'ios') {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status !== 'granted') {
                alert('Permission for notifications required!');
                return;
            }
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(token);
        return token;
    }

    async function sendTestNotification(name: string, message: string) {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: name,
                body: message,
            },
            // @ts-ignore
            trigger: { seconds: 0 },
        });
    }

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token as string));

        // Listener for foreground notifications
        const subscription = Notifications.addNotificationReceivedListener(notification => {
            // @ts-ignore
            setNotification(notification);
        });
        const responeReceiver = Notifications.addNotificationResponseReceivedListener(response => {
            console.log('Notification clicked:', response);
        });

        const createSocket = () => {
            const newSocket = new WebSocket(
                `https://api.audtiklance.com/ws/chat/?token=${authUser?.access}`
            );

            newSocket.onopen = () => {
                console.log("WebSocket connection established hook");
            };

            newSocket.onclose = () => {
                console.log("WebSocket connection closed");
            };

            newSocket.onerror = (error) => {
                console.error("WebSocket error:", error);
            };

            newSocket.onmessage = (event) => {
                console.log("WebSocket message received:", event.data);
                const { type: eventName, content, sender } = JSON.parse(event.data);
                console.log(eventName, content, sender);
                if (eventName === "chat") {
                    sendTestNotification(sender, content)
                    getConversation()
                }
            };

            setSocket(newSocket);
        };

        if (convoId) {
            createSocket();
        }

        return () => {
            if (socket) {
                socket.close();
            }
            subscription.remove()
            responeReceiver.remove()
        };
    }, [convoId])

    useEffect(() => {
        (async () => {
            setLoad(true)
            if (conversationID !== "null") {
                await getConversation()
                await getRecipient()
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

    useEffect(() => {
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true })
        }, 100);
    }, [messages?.length])

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
        <>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                {
                    load ?
                        <View style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", width: "100%" }}>
                            <LottieView source={require("../../assets/images/service2.json")} loop={true} autoPlay style={{ width: 300, height: 350 }} />
                        </View> :
                        <View style={styles.container}>
                            <View style={styles.heading}>
                                <Pressable onPress={() => router.back()} style={styles.buttons}>
                                    <Ionicons name="arrow-back" size={24} color={"black"} />
                                    <Text>Back</Text>
                                </Pressable>
                                <Text style={{ fontSize: 15, textTransform: "capitalize" }}>{messages[0]?.receiver?.firstname} {messages[0]?.receiver?.lastname}</Text>
                                <View style={{ ...styles.buttons, columnGap: 20 }}>
                                    {/* <Ionicons name="call-outline" size={18} color={"black"} /> */}
                                    <Fontisto onPress={()=> openLink(`mailto:${recipient?.email ? recipient?.email : 'support@audtiklance.com'}`)} name="email" size={18} color={"black"} />
                                    <Entypo onPress={() => chatModalRef.current?.open()} name="dots-three-vertical" size={18} color="black" />
                                </View>
                            </View>
                            <View style={styles.chatContainer}>
                                <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false} style={{ width: "100%" }}>
                                    {
                                        messages?.map((message, i) => (
                                            <View key={i} style={{ ...styles.chatView, alignSelf: message?.is_sender ? "flex-end" : "flex-start" }}>
                                                <View style={{ display: "flex", width: "75%", flexDirection: 'row', flexWrap: 'wrap' }}>
                                                    <Text style={{ width: "100%", color: "white" }}>{message?.content}</Text>
                                                </View>
                                                <Text style={{ color: "white", fontSize: 10 }}>{new Date(message?.updated_at)?.toLocaleTimeString()}</Text>
                                            </View>
                                        ))
                                    }
                                </ScrollView>
                            </View>
                            <View style={styles.inputView}>
                                <TextInput value={inputValue} multiline onChangeText={(text) => setInputValue(text)} placeholderTextColor={"black"} placeholder='Enter your message' style={{ ...styles.input }} />
                                <Pressable onPress={() => sendUserMessage()} style={styles.sendView}>
                                    {
                                        sendLoad ?
                                            <ActivityIndicator color={"white"} /> :
                                            <Feather name="send" size={20} color="white" />
                                    }
                                </Pressable>
                            </View>
                        </View>
                }
            </KeyboardAvoidingView>
            <ChatModal chatModalRef={chatModalRef} receiver={recipient} />
        </>
    )
}

export default ChatContent

const styles = StyleSheet.create({
    container: {
        padding: 15,
        paddingTop: 70,
        position: "relative",
        height: "100%",
        display: "flex",
        alignItems: "center",
        width: "100%",
    },
    heading: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        width: "100%"
    },
    buttons: {
        display: "flex",
        flexDirection: "row",
        columnGap: 5,
        alignItems: "center",
        marginBottom: 20
    },
    chatContainer: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        height: "85%",
        paddingBottom: 10,
        width: "100%"
    },
    chatView: {
        display: "flex",
        columnGap: 10,
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",
        width: "80%",
        padding: 8,
        marginVertical: 10,
        backgroundColor: "#1B64F1",
        borderRadius: 6,
    },
    inputView: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        columnGap: 15,
        alignItems: "center",
        paddingBottom: 20
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