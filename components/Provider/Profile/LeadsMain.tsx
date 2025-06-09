import { View, Text, useColorScheme, ScrollView, StyleSheet, Pressable, Image, TextInput, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { generalStyle } from '@/style/generalStyle'
import { Modalize } from 'react-native-modalize'
import { IHandles } from 'react-native-modalize/lib/options'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { getLeads, payLead } from '@/api/leads'
import Plan from './Plan'
import { LEAD } from '@/types/leads'
import LottieView from 'lottie-react-native'
import { openLink } from '@/utils/helper'
import Toast from 'react-native-toast-message'

const LeadsMain = () => {
    const leadRef = useRef<Modalize>(null)
    const [leads, setLeads] = useState<Array<LEAD>>([])
    const [load, setLoad] = useState(false)
    const [selectedLead, setSelectedLead] = useState<LEAD>()

    useEffect(() => {
        (async () => {
            setLoad(true)
            const response = await getLeads()
            if (response?.status === 200) {
                setLeads(response?.data)
            }
            setLoad(false)
        })()
    }, [])

    const openLeadModal = (lead: LEAD) => {
        setSelectedLead(lead)
        leadRef.current?.open()
    }

    return (
        <View style={styles.container}>
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                <Pressable onPress={() => router.back()} style={{ display: "flex", flexDirection: "row", alignItems: "center", columnGap: 10 }}>
                    <Ionicons name="arrow-back-sharp" size={24} color={"black"} />
                    <Text style={{ fontSize: 16, fontWeight: 400 }}>Back</Text>
                </Pressable>
                <Text style={{ fontSize: 16, fontWeight: 600, textAlign: "center" }}>Customer Leads</Text>
            </View>
            {
                load ?
                    <View style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 750, width: "100%" }}>
                        <LottieView source={require("../../../assets/images/service2.json")} loop={true} autoPlay style={{ width: 300, height: 350 }} />
                    </View> : leads.length < 1 ?
                        <View style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 20, height: "90%" }}>
                            <Text style={{ fontSize: 16, fontWeight: 500 }}>You don't have any leads yet</Text>
                            <Text style={{ fontSize: 14, fontWeight: 600, textAlign: "center", paddingTop: 10 }}>Your leads will show up here when customers contact you</Text>
                            <Image style={{ width: 300, height: 300, paddingVertical: 40 }} source={require("../../../assets/images/Empty-product.png")} />
                        </View> :
                        <View style={styles.scrollContainer}>
                            <ScrollView>
                                {
                                    leads?.map((lead, i) => (
                                        <Pressable onPress={() => openLeadModal(lead)} key={i} style={{ display: "flex", marginTop: 10, justifyContent: "space-between", flexDirection: "row", alignItems: "center" }}>
                                            <View style={styles.box}>
                                                <Image source={{ uri: lead?.user?.profilePicture || `https://ui-avatars.com/api/?name=${lead?.user?.firstName}+${lead?.user?.lastName}` }} style={styles.iconView} />
                                                <View>
                                                    <Text style={{ fontSize: 18, fontWeight: 600 }}>{lead?.user?.firstName} {lead?.user?.lastName}</Text>
                                                    <Text style={{ fontSize: 16, fontWeight: 400, width: '80%' }}>{lead?.message}</Text>
                                                </View>
                                            </View>
                                            <AntDesign name="right" size={24} color={"black"} />
                                        </Pressable>
                                    ))
                                }
                            </ScrollView>
                        </View>
            }
            <LeadModal leadRef={leadRef} lead={selectedLead!} />
        </View>
    )
}

export default LeadsMain

const LeadModal: React.FC<{ leadRef: React.RefObject<IHandles | null>, lead: LEAD }> = ({ leadRef, lead }) => {
    const [load, setLoad] = useState(false)

    const payForLead = async (id: string) => {
        setLoad(true)
        const res = await payLead(id, { amount: 10 })
        console.log(res);
        if (res?.status === 200 || res?.status === 201) {
            openLink(res?.data?.data)
        } else {
            Toast.show({
                type: 'error',
                text1: 'An error occurred'
            })
        }
        setLoad(false)
    }

    return (
        <Modalize
            ref={leadRef}
            adjustToContentHeight={true}
        >
            {
                lead?.isPaid ?
                    <View style={styles.modalContent}>
                        <Text style={{ marginVertical: 20, fontSize: 16, fontWeight: 500, textAlign: "center", borderBottomWidth: 0.5, paddingBottom: 15 }}>You can communicate with this customer using the following method</Text>
                        <Pressable onPress={() => router.push(`/chat/${lead?.user?._id}/null`)} style={styles.bookButton}><Text style={{ color: "white", fontSize: 16 }}>Chat with customer</Text></Pressable>
                        <Pressable onPress={() => openLink(`tel:${lead?.user?.phoneNumber}`)} style={styles.bookButton}><Text style={{ color: "white", fontSize: 16 }}>Call customer</Text></Pressable>
                    </View> :
                    <View style={{ ...styles.shareModalContent, height: 260, paddingTop: 30 }}>
                        <Text style={{ fontSize: 18, fontWeight: 700, textAlign: "center", marginBottom: 10 }}>{lead?.user?.firstName} {lead?.user?.lastName}</Text>
                        <Text style={{ fontSize: 16, fontWeight: 500 }}>{lead?.message}</Text>
                        <Pressable onPress={() => payForLead(lead?.id!)} style={styles.bookButton}>
                            {
                                load ?
                                <ActivityIndicator color={"white"} /> :
                                <Text style={{ color: "white", fontSize: 16 }}>Pay for lead</Text>
                            }
                        </Pressable>
                        <Text style={{textAlign: 'center', marginTop: 10}}>Pay <Text style={{fontWeight: 600}}>$10</Text> to view this lead and
                            gain valuable insights. This will help you connect with potential
                            clients and grow your business.</Text>
                    </View>

            }
        </Modalize>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        paddingTop: 80,
        height: "100%"
    },
    modalContent: {
        padding: 20,
        height: 260,
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
    scrollContainer: {
        marginTop: 40,
        height: '91%'
    },
    shareModalContent: {
        padding: 20,
        height: 300,
        display: "flex",
        alignItems: "center"
    },
    input: {
        width: "100%",
        height: 103,
        backgroundColor: "#CED2D9E5",
        borderRadius: 5,
        marginTop: 30,
        padding: 10
    },
    button: {
        width: 70,
        height: 30,
        backgroundColor: "#1B64F1",
        borderRadius: 4,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    box: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        columnGap: 10,
        marginTop: 20
    },
    iconView: {
        width: 50,
        height: 50,
        borderRadius: 50,
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
    buttonText: {
        fontSize: 16,
        fontWeight: 600
    },
})