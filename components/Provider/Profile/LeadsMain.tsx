import { View, Text, useColorScheme, ScrollView, StyleSheet, Pressable, Image, TextInput } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { generalStyle } from '@/style/generalStyle'
import { Modalize } from 'react-native-modalize'
import { IHandles } from 'react-native-modalize/lib/options'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { getLeads } from '@/api/leads'
import Plan from './Plan'
import { LEAD } from '@/types/leads'
import LottieView from 'lottie-react-native'

const LeadsMain = () => {
    const colorScheme = useColorScheme() || "light"
    const leadRef = useRef<Modalize>(null)
    const planRef = useRef<Modalize>(null)
    const [leads, setLeads] = useState<Array<LEAD>>([])
    const [load, setLoad] = useState(false)
    const [selectedLead, setSelectedLead] = useState<LEAD>()

    useEffect(() => {
        (async () => {
            setLoad(true)
            const response = await getLeads()
            if (response?.status === 200) {
                setLeads(response?.data?.results)
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
                    <Ionicons name="arrow-back-sharp" size={24} color={colorScheme === "dark" ? "white" : "black"} />
                    <Text style={{ fontSize: 16, fontWeight: 400, ...generalStyle.text[colorScheme] }}>Back</Text>
                </Pressable>
                <Text style={{ fontSize: 18, fontWeight: 600, textAlign: "center", ...generalStyle.text[colorScheme] }}>Customer Leads</Text>
            </View>
            {
                load ?
                    <View style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 750, width: "100%" }}>
                        <LottieView source={require("../../../assets/images/service2.json")} loop={true} autoPlay style={{ width: 300, height: 350 }} />
                    </View> :
                    <View style={styles.scrollContainer}>
                        <ScrollView>
                            {
                                leads?.map((lead, i) => (
                                    <Pressable onPress={() => openLeadModal(lead)} key={i} style={{ display: "flex", marginTop: 10, justifyContent: "space-between", flexDirection: "row", alignItems: "center" }}>
                                        <View style={styles.box}>
                                            <Image source={{ uri: lead?.user?.profile_picture }} style={styles.iconView} />
                                            <View>
                                                <Text style={{ fontSize: 18, fontWeight: 600, ...generalStyle.text[colorScheme] }}>{lead?.user?.firstname} {lead?.user?.lastname}</Text>
                                                <Text style={{ fontSize: 16, fontWeight: 400, ...generalStyle.text[colorScheme] }}>{lead?.message}</Text>
                                            </View>
                                        </View>
                                        <AntDesign name="right" size={24} color={colorScheme === "dark" ? "white" : "black"} />
                                    </Pressable>
                                ))
                            }
                        </ScrollView>
                    </View>
            }
            <LeadModal leadRef={leadRef} planRef={planRef} lead={selectedLead!} />
            <Plan planRef={planRef} />
        </View>
    )
}

export default LeadsMain

const LeadModal: React.FC<{ leadRef: React.RefObject<IHandles>, planRef: React.RefObject<IHandles>, lead: LEAD }> = ({ leadRef, planRef, lead }) => {
    const colorScheme = useColorScheme() || "light"

    return (
        <Modalize
            ref={leadRef}
            adjustToContentHeight={true}
            modalStyle={{ ...generalStyle.modalBackground[colorScheme] }}
        >
            {
                lead?.paid ?
                    <View style={styles.modalContent}>
                        <Text style={{ ...generalStyle.text[colorScheme], marginVertical: 20, fontSize: 16, fontWeight: 500, textAlign: "center", borderBottomWidth: 0.5, paddingBottom: 15 }}>You can communicate with this customer using the following method</Text>
                        <Pressable style={styles.bookButton}><Text style={{ color: "white", fontSize: 16 }}>Chat with customer</Text></Pressable>
                        <Pressable style={styles.bookButton}><Text style={{ color: "white", fontSize: 16 }}>Call customer</Text></Pressable>
                    </View> :
                    <View style={{ ...styles.shareModalContent, height: 260, paddingTop: 30 }}>
                        <Text style={{ fontSize: 18, fontWeight: 700, textAlign: "center", marginBottom: 10, ...generalStyle.text[colorScheme] }}>{lead?.user?.firstname} {lead?.user?.lastname}</Text>
                        <Text style={{ fontSize: 16, fontWeight: 500, ...generalStyle.text[colorScheme] }}>{lead?.message}</Text>
                        <Text style={{ fontSize: 16, fontWeight: 600, ...generalStyle.text[colorScheme], textAlign: "center", marginTop: 20 }}>Subscribe to get access to the customer contact details and many others like this</Text>
                        <Pressable onPress={() => planRef.current?.open()} style={{ ...styles.numberButton, ...generalStyle.button.active }}><Text style={{ ...styles.buttonText, ...generalStyle.text.dark }}>Subscribe</Text></Pressable>
                    </View>

            }
        </Modalize>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        paddingTop: 80,
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
        height: 52,
        borderRadius: 10,
        backgroundColor: "#B8BBBC",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 600
    },
})