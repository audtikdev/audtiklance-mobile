import { View, Text, Pressable, useColorScheme, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Modalize } from 'react-native-modalize'
import { IHandles } from 'react-native-modalize/lib/options'
import { generalStyle } from '@/style/generalStyle'
import { planBenefits } from '@/data/home'
import { AntDesign } from '@expo/vector-icons'
import { getSubscriptionPlan, subscribePlan } from '@/api/subscribe'
import { PLAN } from '@/types/subscrbe'
import { openLink } from '@/utils/helper'

const Plan: React.FC<{ planRef: React.RefObject<IHandles> }> = ({ planRef }) => {
    const colorScheme = useColorScheme() || "light"
    const subscribeRef = useRef<Modalize>(null)
    const [plan, setPlan] = useState<PLAN>()

    useEffect(() => {
        (async () => {
            const response = await getSubscriptionPlan()
            if (response?.status === 200) {
                setPlan(response?.data?.results[1])
            }
        })()
    }, [])

    return (
        <>
            <Modalize
                ref={planRef}
                adjustToContentHeight={true}
                modalStyle={generalStyle.modalBackground[colorScheme]}
            >
                <View style={{ ...styles.modalContent, height: 570 }}>
                    <Text style={{ ...styles.profileText, ...generalStyle.text[colorScheme] }}>Upgrade To AudtikLance Preferred</Text>
                    {
                        planBenefits?.map((benifit, i) => (
                            <View style={{ display: "flex", flexDirection: "row", columnGap: 10, marginTop: 15, width: "90%" }} key={i}>
                                <AntDesign name="checkcircle" size={24} color="green" />
                                <Text>{benifit}</Text>
                            </View>
                        ))
                    }
                    <Pressable onPress={() => subscribeRef.current?.open()} style={{ ...styles.registerButton, marginTop: 40, ...(colorScheme === "light" && generalStyle.button.active), ...(colorScheme === "dark" && generalStyle.button.dark) }}>
                        <Text style={{ ...styles.buttonText, ...generalStyle.text["dark"] }}>Upgrade</Text>
                    </Pressable>
                </View>
            </Modalize>
            <SubscribeModal subscribeRef={subscribeRef} plan={plan!} />
        </>
    )
}

export default Plan

const SubscribeModal: React.FC<{ subscribeRef: React.RefObject<IHandles>, plan: PLAN }> = ({ subscribeRef, plan }) => {
    const colorScheme = useColorScheme() || "light"
    const [load, setLoad] = useState(false)

    const subscribe = async () => {
        setLoad(true)
        const response = await subscribePlan(plan?.id, { amount: plan?.max_cost })
        if (response?.status === 200) {
            openLink(response?.data?.data)
        }
        setLoad(false)
        subscribeRef.current?.close()
    }

    return (
        <Modalize
            ref={subscribeRef}
            adjustToContentHeight={true}
            modalStyle={generalStyle.modalBackground[colorScheme]}
        >
            <View style={{ ...styles.modalContent, height: 350 }}>
                <Text style={{ ...styles.profileText, ...generalStyle.text[colorScheme] }}>Subscribe To AudtikLance Preferred</Text>
                <Text style={{ fontSize: 16, fontWeight: 500, textAlign: "center", marginBottom: 20, ...generalStyle.text[colorScheme] }}>Subscribe to get the plan upgraded perks for:</Text>
                <Text style={{ fontSize: 28, fontWeight: 700, textAlign: "center", marginBottom: 20, ...generalStyle.text[colorScheme] }}>${plan?.max_cost}</Text>

                <View style={{ display: "flex", flexDirection: "row", columnGap: 10 }}>
                    <Pressable onPress={() => subscribeRef.current?.close()} style={{ ...styles.cancelButton, marginTop: 0, width: "49%" }}>
                        <Text style={{ ...styles.buttonText, color: "black" }}>Cancel</Text>
                    </Pressable>
                    <Pressable onPress={subscribe} style={{ ...styles.registerButton, marginTop: 0, width: "49%", ...(colorScheme === "light" && generalStyle.button.active), ...(colorScheme === "dark" && generalStyle.button.dark) }}>
                        {
                            load ?
                                <ActivityIndicator size={"large"} color={"white"} /> :
                                <Text style={{ ...styles.buttonText, ...generalStyle.text["dark"] }}>Continue</Text>
                        }
                    </Pressable>
                </View>
            </View>
        </Modalize>
    )
}

export const SuccessModal: React.FC<{ successRef: React.RefObject<IHandles> }> = ({ successRef }) => {
    const colorScheme = useColorScheme() || "light"

    return (
        <Modalize
            ref={successRef}
            adjustToContentHeight={true}
            modalStyle={generalStyle.modalBackground[colorScheme]}
        >
            <View style={{ ...styles.modalContent, height: 350 }}>
                <View style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
                    <AntDesign name="checkcircle" size={24} color="green" />
                    <Text>Payment Successful</Text>
                </View>
            </View>
        </Modalize>
    )
}

const styles = StyleSheet.create({
    modalContent: {
        padding: 20,
        height: 500,
    },
    profileText: {
        fontSize: 18,
        fontWeight: 600,
        marginTop: 10,
        marginBottom: 20,
        textAlign: "center"
    },
    registerButton: {
        width: "100%",
        height: 52,
        borderRadius: 10,
        backgroundColor: "#00000080",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    cancelButton: {
        width: "100%",
        height: 52,
        borderRadius: 10,
        backgroundColor: "inherit",
        display: 'flex',
        borderColor: "#1B64F1",
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 600
    },
})