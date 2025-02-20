import { View, Text, Pressable, StyleSheet, useColorScheme, TextInput, ActivityIndicator } from 'react-native'
import React, { useRef, useState } from 'react'
import { Modalize } from 'react-native-modalize'
import { Entypo, Fontisto, Ionicons, MaterialIcons } from '@expo/vector-icons'
import { IHandles } from 'react-native-modalize/lib/options'
import { generalStyle } from '@/style/generalStyle'
import { blockUser, reportUser } from '@/api/chat'
import Toast from 'react-native-toast-message'
import { CHAT_USER } from './type'
import { openLink } from '@/utils/helper'

const ChatModal: React.FC<{ chatModalRef: React.RefObject<IHandles>, receiver: any }> = ({ chatModalRef, receiver }) => {
    const reportModalRef = useRef<Modalize>(null)
    const blockModalRef = useRef<Modalize>(null)

    return (
        <>
            <Modalize
                ref={chatModalRef}
                adjustToContentHeight={true}
            >
                <View style={styles.modalContent}>
                    <Text style={{ ...styles.buttonText, textAlign: "center", textTransform: "capitalize" }}>{receiver?.firstname} {receiver?.lastname}</Text>
                    <View style={styles.buttonView}>
                        {/* <Pressable style={{ ...styles.registerButton }}>
                            <Ionicons name="call-outline" size={18} color={"white"} />
                            <Text style={{ ...styles.buttonText, ...generalStyle.text["dark"] }}>Call</Text>
                        </Pressable> */}
                        <Pressable onPress={()=> openLink(`mailto:${receiver?.email ? receiver?.email : 'support@audtiklance.com'}`)} style={{ ...styles.registerButton }}>
                            <Fontisto name="email" size={18} color={"white"} />
                            <Text style={{ ...styles.buttonText, ...generalStyle.text["dark"] }}>Email</Text>
                        </Pressable>
                    </View>
                    <Pressable onPress={() => blockModalRef.current?.open()} style={styles.deleteButton}>
                        <Entypo name="block" size={20} color="white" />
                        <Text style={{ ...styles.buttonText, ...generalStyle.text["dark"] }}>Block User</Text>
                    </Pressable>
                    <Pressable onPress={() => reportModalRef.current?.open()} style={styles.deleteButton}>
                        <MaterialIcons name="report-gmailerrorred" size={23} color="white" />
                        <Text style={{ ...styles.buttonText, ...generalStyle.text["dark"] }}>Report User</Text>
                    </Pressable>
                </View>
            </Modalize>
            <ReportUser reportModalRef={reportModalRef} receiver={receiver} />
            <BlockUser blockModalRef={blockModalRef} receiver={receiver} />
        </>
    )
}

export default ChatModal

const ReportUser: React.FC<{ reportModalRef: React.RefObject<IHandles>, receiver: CHAT_USER }> = ({ reportModalRef, receiver }) => {
    const [reason, setReason] = useState("")
    const [load, setLoad] = useState(false)

    const handleReportUser = async () => {
        setLoad(true)
        const res = await reportUser({ content: reason }, receiver?.id!)
        
        if (res?.status === 200) {
            Toast.show({
                type: 'success',
                text1: 'Report successfully'
            })
            reportModalRef.current?.close()
        } else {
            Toast.show({
                type: 'error',
                text1: 'Error while reporting, try again'
            })
        }
        setLoad(false)
    }

    return (
        <Modalize
            ref={reportModalRef}
            adjustToContentHeight={true}
        >
            <View style={styles.modalContent}>
                <Text style={{ ...styles.buttonText, fontSize: 14, textAlign: "center", textTransform: "capitalize" }}>Are you sure you want to report {receiver?.firstname} {receiver?.lastname}</Text>
                <TextInput onChangeText={(text) => setReason(text)} multiline numberOfLines={5} placeholderTextColor={"black"} style={{ ...styles.registerInput, height: 100, padding: 10 }} placeholder='Give a reason why you want to report this user...' />
                <Pressable onPress={handleReportUser} style={styles.deleteButton}>
                    {
                        load ?
                            <ActivityIndicator color={"white"} /> :
                            <>
                                <MaterialIcons name="report-gmailerrorred" size={23} color="white" />
                                <Text style={{ ...styles.buttonText, ...generalStyle.text["dark"] }}>Report User</Text>
                            </>
                    }
                </Pressable>
            </View>
        </Modalize>
    )
}

const BlockUser: React.FC<{ blockModalRef: React.RefObject<IHandles>, receiver: CHAT_USER }> = ({ blockModalRef, receiver }) => {
    const [load, setLoad] = useState(false)

    const handleBlockUser = async () => {
        setLoad(true)
        console.log(receiver?.id);
        
        const res = await blockUser(receiver?.id!)
        console.log(res);
        
        if (res?.status === 200) {
            Toast.show({
                type: 'success',
                text1: 'Blocked successfully'
            })
            blockModalRef.current?.close()
        } else {
            Toast.show({
                type: 'error',
                text1: 'Error while blocking, try again'
            })
        }
        setLoad(false)
    }

    return (
        <Modalize
            ref={blockModalRef}
            adjustToContentHeight={true}
        >
            <View style={{ ...styles.modalContent, height: 240 }}>
                <Text style={{ ...styles.buttonText, fontSize: 14, marginBottom: 20, textAlign: "center", textTransform: "capitalize" }}>Are you sure you want to block {receiver?.firstname} {receiver?.lastname}</Text>
                <Pressable onPress={handleBlockUser} style={styles.deleteButton}>
                    {
                        load ?
                            <ActivityIndicator /> :
                            <>
                                <Entypo name="block" size={20} color="white" />
                                <Text style={{ ...styles.buttonText, ...generalStyle.text["dark"] }}>Block User</Text>
                            </>
                    }
                </Pressable>
                <Pressable onPress={handleBlockUser} style={styles.deleteButton}>
                    {
                        load ?
                            <ActivityIndicator color={"white"} /> :
                            <>
                                <MaterialIcons name="report-gmailerrorred" size={23} color="white" />
                                <Text style={{ ...styles.buttonText, ...generalStyle.text["dark"] }}>Block And Report User</Text>
                            </>
                    }
                </Pressable>
            </View>
        </Modalize>
    )
}

const styles = StyleSheet.create({
    modalContent: {
        padding: 20,
        height: 280,
    },
    buttonView: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        columnGap: 10,
        marginTop: 10
    },
    registerButton: {
        width: "100%",
        height: 52,
        borderRadius: 10,
        backgroundColor: "#1B64F1",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        flexDirection: "row",
        columnGap: 10
    },
    registerInput: {
        height: 50,
        fontSize: 13,
        borderWidth: 1,
        flexShrink: 1,
        width: '100%',
        marginBottom: 10,
        paddingLeft: 10,
        borderRadius: 5,
        marginTop: 15
    },
    deleteButton: {
        width: "100%",
        height: 52,
        borderRadius: 10,
        backgroundColor: "#c1121f",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        flexDirection: "row",
        columnGap: 10
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 600
    },
})