import { View, Text, Pressable, StyleSheet, useColorScheme, TextInput } from 'react-native'
import React, { useRef, useState } from 'react'
import { Modalize } from 'react-native-modalize'
import { AntDesign, Entypo, Fontisto, Ionicons, MaterialIcons } from '@expo/vector-icons'
import { IHandles } from 'react-native-modalize/lib/options'
import { generalStyle } from '@/style/generalStyle'

const FlagOrReportService: React.FC<{ flagOrReportRef: React.RefObject<IHandles>, name: string, bookService: any }> = ({ flagOrReportRef, name, bookService }) => {
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
                    <Text style={{ ...styles.buttonText, ...generalStyle.text["light"], textAlign: "center", textTransform: "capitalize" }}>{name}</Text>
                    <Pressable onPress={()=> {flagOrReportRef.current?.close(); bookService()}} style={{ ...styles.registerButton }}>
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
            <ReportUser reportModalRef={reportModalRef} name={name} />
            <FlagUser flagModalRef={flagModalRef} name={name} />
        </>
    )
}

export default FlagOrReportService

const ReportUser: React.FC<{ reportModalRef: React.RefObject<IHandles>, name: string }> = ({ reportModalRef, name }) => {
    const colorScheme = useColorScheme() || "light"
    const [reason, setReason] = useState("")

    return (
        <Modalize
            ref={reportModalRef}
            adjustToContentHeight={true}
        >
            <View style={styles.modalContent}>
                <Text style={{ ...styles.buttonText, fontSize: 14, ...generalStyle.text["light"], textAlign: "center", textTransform: "capitalize" }}>Are you sure you want to report {name}</Text>
                <TextInput onChangeText={(text) => setReason(text)} multiline numberOfLines={5} placeholderTextColor={"black"} style={{ ...styles.registerInput, height: 100, padding: 10,  }} placeholder='Give a reason why you want to report this service...' />
                <Pressable style={styles.deleteButton}>
                    <MaterialIcons name="report-gmailerrorred" size={23} color="white" />
                    <Text style={{ ...styles.buttonText, ...generalStyle.text["dark"] }}>Report Service</Text>
                </Pressable>
            </View>
        </Modalize>
    )
}

const FlagUser: React.FC<{ flagModalRef: React.RefObject<IHandles>, name: string }> = ({ flagModalRef, name }) => {
    const colorScheme = useColorScheme() || "light"

    return (
        <Modalize
            ref={flagModalRef}
            adjustToContentHeight={true}
        >
            <View style={{ ...styles.modalContent, height: 500 }}>
                <Text style={{ ...styles.buttonText, fontSize: 14, marginBottom: 20, ...generalStyle.text["light"], textAlign: "center", textTransform: "capitalize" }}>Are you sure you want to flag {name}</Text>
                <Pressable style={styles.deleteButton}>
                    <Entypo name="block" size={20} color="white" />
                    <Text style={{ ...styles.buttonText, ...generalStyle.text["dark"] }}>Flag Service</Text>
                </Pressable>
                <Pressable style={styles.deleteButton}>
                    <MaterialIcons name="report-gmailerrorred" size={23} color="white" />
                    <Text style={{ ...styles.buttonText, ...generalStyle.text["dark"] }}>Flag And Report Service</Text>
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