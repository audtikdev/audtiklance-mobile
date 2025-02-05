import { View, Text, Pressable, StyleSheet, useColorScheme, TextInput, ActivityIndicator } from 'react-native'
import React, { useRef, useState } from 'react'
import { Modalize } from 'react-native-modalize'
import { AntDesign, Entypo, Fontisto, Ionicons, MaterialIcons } from '@expo/vector-icons'
import { IHandles } from 'react-native-modalize/lib/options'
import { generalStyle } from '@/style/generalStyle'
import { reportService, reviewService } from '@/api/service'
import { Service } from '@/types/service'
import Toast from 'react-native-toast-message'
import StarRating from '../StarRating'

const FlagOrReportService: React.FC<{ flagOrReportRef: React.RefObject<IHandles>, service: Service, bookService: any }> = ({ flagOrReportRef, service, bookService }) => {
    const colorScheme = useColorScheme() || "light"
    const reportModalRef = useRef<Modalize>(null)
    const flagModalRef = useRef<Modalize>(null)

    return (
        <>
            <Modalize
                ref={flagOrReportRef}
                adjustToContentHeight={true}
            >
                <View style={styles.modalContent}>
                    <Text style={{ ...styles.buttonText, ...generalStyle.text["light"], textAlign: "center", textTransform: "capitalize" }}>{service?.business_name}</Text>
                    <Pressable onPress={() => { flagOrReportRef.current?.close(); bookService() }} style={{ ...styles.registerButton }}>
                        <AntDesign name="login" size={24} color="white" />
                        <Text style={{ ...styles.buttonText, ...generalStyle.text["dark"] }}>Book Now</Text>
                    </Pressable>
                    <Pressable onPress={() => flagModalRef.current?.open()} style={styles.deleteButton}>
                        <Entypo name="block" size={20} color="white" />
                        <Text style={{ ...styles.buttonText, ...generalStyle.text["dark"] }}>Flag Service</Text>
                    </Pressable>
                    <Pressable onPress={() => reportModalRef.current?.open()} style={styles.deleteButton}>
                        <MaterialIcons name="report-gmailerrorred" size={23} color="white" />
                        <Text style={{ ...styles.buttonText, ...generalStyle.text["dark"] }}>Report Service</Text>
                    </Pressable>
                </View>
            </Modalize>
            <ReportUser reportModalRef={reportModalRef} service={service} />
            <FlagUser flagModalRef={flagModalRef} service={service} />
        </>
    )
}

export default FlagOrReportService

const ReportUser: React.FC<{ reportModalRef: React.RefObject<IHandles>, service: Service }> = ({ reportModalRef, service }) => {
    const [reason, setReason] = useState("")
    const [load, setLoad] = useState(false)

    const handleReportService = async () => {
        setLoad(true)
        const res = await reportService({ content: reason }, service?.id!)
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
                <Text style={{ ...styles.buttonText, fontSize: 14, ...generalStyle.text["light"], textAlign: "center", textTransform: "capitalize" }}>Are you sure you want to report {service?.business_name}</Text>
                <TextInput onChangeText={(text) => setReason(text)} value={reason} multiline numberOfLines={5} placeholderTextColor={"black"} style={{ ...styles.registerInput, height: 100, padding: 10, }} placeholder='Give a reason why you want to report this service...' />
                <Pressable onPress={handleReportService} style={styles.deleteButton}>
                    {
                        load ?
                            <ActivityIndicator color={"white"} /> :
                            <>
                                <MaterialIcons name="report-gmailerrorred" size={23} color="white" />
                                <Text style={{ ...styles.buttonText, ...generalStyle.text["dark"] }}>Report Service</Text>
                            </>
                    }
                </Pressable>
            </View>
        </Modalize>
    )
}

const FlagUser: React.FC<{ flagModalRef: React.RefObject<IHandles>, service: Service }> = ({ flagModalRef, service }) => {
    const colorScheme = useColorScheme() || "light"
    const [load, setLoad] = useState(false)

    const handleReportService = async () => {
        setLoad(true)
        const res = await reportService({ content: "I dont want to see their services" }, service?.id!)
        if (res?.status === 200) {
            Toast.show({
                type: 'success',
                text1: 'Flagged successfully'
            })
            flagModalRef.current?.close()
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
            ref={flagModalRef}
            adjustToContentHeight={true}
        >
            <View style={{ ...styles.modalContent, height: 500 }}>
                <Text style={{ ...styles.buttonText, fontSize: 14, marginBottom: 20, ...generalStyle.text["light"], textAlign: "center", textTransform: "capitalize" }}>You will no longer see a service post from {service?.business_name}</Text>
                <Pressable onPress={handleReportService} style={styles.deleteButton}>
                    {
                        load ?
                            <ActivityIndicator color={"white"} /> :
                            <>
                                <Entypo name="block" size={20} color="white" />
                                <Text style={{ ...styles.buttonText, ...generalStyle.text["dark"] }}>Flag Service</Text>
                            </>
                    }
                </Pressable>
                <Pressable onPress={handleReportService} style={styles.deleteButton}>
                    {
                        load ?
                            <ActivityIndicator /> :
                            <>
                                <MaterialIcons name="report-gmailerrorred" size={23} color="white" />
                                <Text style={{ ...styles.buttonText, ...generalStyle.text["dark"] }}>Flag And Report Service</Text>
                            </>
                    }
                </Pressable>
            </View>
        </Modalize>
    )
}

export const RateModal: React.FC<{ rateRef: React.RefObject<IHandles>, serviceID: string }> = ({ rateRef, serviceID }) => {
    const [rating, setRating] = useState(0)
    const [content, setContent] = useState("")
    const [load, setLoad] = useState(false)

    const handleRateService = async () => {
        const body = {
            rating: rating,
            comment: content
        }
        console.log(body);
        
        setLoad(true)
        const res = await reviewService(body, serviceID)
        setLoad(false)
        rateRef.current?.close()
        if (res?.status === 200 || res?.status === 201) {
            Toast.show({
                type: 'success',
                text1: 'Thanks for your review'
            })
        } else {
            Toast.show({
                type: 'error',
                text1: res?.data
            })
        }
    }

    return (
        <Modalize
            ref={rateRef}
            adjustToContentHeight={true}
        >
            <View style={{ ...styles.shareModalContent }}>
                <Text style={{ fontSize: 16, fontWeight: 500, textAlign: "center", marginBottom: 30 }}>Rate this service provider</Text>
                <StarRating setRating={setRating} rating={rating} />
                <TextInput onChangeText={(text)=> setContent(text)} value={content} placeholderTextColor="#00000080" style={styles.input} multiline={true} textAlignVertical='top' placeholder='Tell us more about this service provider' />
                <Pressable onPress={handleRateService} style={{ ...styles.registerButton }}>
                    {
                        load ?
                        <ActivityIndicator color={'white'} /> :
                        <Text style={{ ...styles.buttonText, ...generalStyle.text.dark }}>Submit</Text>
                    }
                </Pressable>
            </View>
        </Modalize>
    )
}

const styles = StyleSheet.create({
    modalContent: {
        padding: 20,
        height: 530,
    },
    buttonView: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        columnGap: 10,
        marginTop: 10
    },
    shareModalContent: {
        padding: 30,
        height: 600,
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