import { View, Text, KeyboardAvoidingView, TouchableWithoutFeedback, Image, TextInput, Pressable, useColorScheme, StyleSheet, Keyboard, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { generalStyle } from '@/style/generalStyle'
import { router } from 'expo-router'
import { sendForgotPasswordOtp } from '@/api/auth'
import Toast from 'react-native-toast-message'

const ForgotPassword = () => {
    const colorScheme = useColorScheme() || "light"
    const [email, setEmail] = useState("")
    const [load, setLoad] = useState(false)

    const handleSubmit = async () => {
        setLoad(true)
        const body = {
            email: email
        }
        const response = await sendForgotPasswordOtp(body)
        if (response?.status === 201 || response?.status === 200) {
            router.push(`/resetPasswordOtp/email=${email}&secret=${response.data?.data}`)
        } else {
            Toast.show({
                type: "error",
                text1: response?.data
            })
        }
        setLoad(false)
    }

    return (
        <>
            <KeyboardAvoidingView style={styles.registerContainer}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.registerMain}>
                        <Image source={require("../../assets/images/logo.png")} />
                        <Text style={{ ...styles.profileText, ...generalStyle.text[colorScheme] }}>Forgot Your Password? Request A Reset Link</Text>
                        <TextInput textContentType="emailAddress" autoCapitalize='none' autoCorrect={false} keyboardType='email-address' placeholderTextColor={generalStyle.text[colorScheme].color} onChangeText={(text) => setEmail(text)} value={email} style={{ ...styles.registerInput, ...generalStyle.border[colorScheme], ...generalStyle.text[colorScheme] }} placeholder='Email' />
                        <Pressable onPress={handleSubmit} style={{ ...styles.loginButton, ...(colorScheme === "light" && generalStyle.button.active), ...(colorScheme === "dark" && generalStyle.button.dark) }}>
                            {
                                load ?
                                    <ActivityIndicator size={"large"} /> :
                                    <Text style={{ ...styles.buttonText, ...generalStyle.text["dark"] }}>Send Link</Text>
                            }
                        </Pressable>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
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
    profileText: {
        fontSize: 16,
        fontWeight: 600,
        marginTop: 10,
        textAlign: "center",
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