import { View, Text, KeyboardAvoidingView, TouchableWithoutFeedback, Image, TextInput, Pressable, useColorScheme, StyleSheet, Keyboard } from 'react-native'
import React, { useRef, useState } from 'react'
import { Modalize } from 'react-native-modalize';
import { generalStyle } from '@/style/generalStyle'
import { router } from 'expo-router'

const ForgotPassword = () => {
    const colorScheme = useColorScheme() || "light"
    const [email, setEmail] = useState("")
    const modalizeRef = useRef<Modalize>(null)

    const handleSubmit = () => {
        modalizeRef.current?.open()
    }

    return (
        <>
            <KeyboardAvoidingView style={styles.registerContainer}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.registerMain}>
                        <Image source={require("../../assets/images/logo.png")} />
                        <Text style={{ ...styles.profileText, ...generalStyle.text[colorScheme] }}>Forgot Your Password? Request A Reset Link</Text>
                        <TextInput placeholderTextColor={generalStyle.text[colorScheme].color} onChangeText={(text) => setEmail(text)} value={email} keyboardType='phone-pad' style={{ ...styles.registerInput, ...generalStyle.border[colorScheme], ...generalStyle.text[colorScheme] }} placeholder='Email' />
                        <Pressable onPress={handleSubmit} style={{ ...styles.loginButton, ...(colorScheme === "light" && generalStyle.button.active), ...(colorScheme === "dark" && generalStyle.button.dark) }}><Text style={{ ...styles.buttonText, ...generalStyle.text["dark"] }}>Send Link</Text></Pressable>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
            <Modalize
                ref={modalizeRef}
                adjustToContentHeight={true}
                modalStyle={generalStyle.modalBackground[colorScheme]}
            >
                <View style={styles.modalContent}>
                   <Text style={{...styles.emailTitle, ...generalStyle.text[colorScheme]}}>Reset Password Email Sent</Text>
                   <Image style={{width: 150, height: 150}} source={require("../../assets/images/email.png")} />
                   <Text style={{...styles.emailText, ...generalStyle.text[colorScheme]}}>Check Your Email For The Link To Reset Your Password</Text>
                </View>
            </Modalize>
        </>
    )
}

export default ForgotPassword

const styles = StyleSheet.create({
    registerContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
        padding: 20
    },
    registerMain: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        width: "100%",
        height: "100%"
    },
    modalContent: {
        padding: 25,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: 280
    },
    profileText: {
        fontSize: 18,
        fontWeight: 600,
        marginTop: 10,
        marginBottom: 20
    },
    registerInput: {
        height: 50,
        borderWidth: 1,
        flexShrink: 1,
        width: '100%',
        marginBottom: 10,
        paddingLeft: 10,
        borderRadius: 5,
    },
    loginButton: {
        width: "100%",
        height: 52,
        borderRadius: 10,
        backgroundColor: "#1B64F1",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 600
    },
    emailTitle: {
        fontSize: 18,
        fontWeight: 600,
        fontFamily: "Nunito Sans",
        marginBottom: 5,
        textAlign: "center"
    },
    emailText: {
        fontSize: 14,
        fontWeight: 400,
        fontFamily: "Nunito Sans",
        marginTop: 10,
        textAlign: "center"
    },
})