import { View, Text, KeyboardAvoidingView, TouchableWithoutFeedback, Image, TextInput, Pressable, useColorScheme, StyleSheet, Keyboard, ActivityIndicator, Platform } from 'react-native'
import React, { useState } from 'react'
import { generalStyle } from '@/style/generalStyle'
import { router } from 'expo-router'
import { sendForgotPasswordOtp } from '@/api/auth'
import Toast from 'react-native-toast-message'

const ForgotPassword = () => {
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
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.registerContainer}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.registerMain}>
                        <Image source={require("../../assets/images/logo.png")} />
                        <Text style={{ ...styles.profileText }}>Forgot Your Password? Request A Reset Link</Text>
                        <TextInput textContentType="emailAddress" autoCapitalize='none' autoCorrect={false} keyboardType='email-address' placeholderTextColor={"black"} onChangeText={(text) => setEmail(text)} value={email} style={{ ...styles.registerInput }} placeholder='Email' />
                        <Pressable onPress={handleSubmit} style={{ ...styles.loginButton }}>
                            {
                                load ?
                                    <ActivityIndicator color={"white"} /> :
                                    <Text style={{ ...styles.buttonText }}>Send Link</Text>
                            }
                        </Pressable>
                        <Pressable onPress={()=> router.push('/login')} style={{ ...styles.borderButton }}>
                            <Text style={{ ...styles.buttonText, color: '#1B64F1' }}>Login</Text>
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
        padding: 20,
        backgroundColor: "white"
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
        height: 45,
        borderWidth: 1,
        flexShrink: 1,
        width: '100%',
        marginBottom: 10,
        paddingLeft: 10,
        borderRadius: 5,
    },
    loginButton: {
        width: "100%",
        height: 47,
        borderRadius: 10,
        backgroundColor: "#1B64F1",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    borderButton: {
        width: "100%",
        height: 47,
        borderRadius: 10,
        borderColor: "#1B64F1",
        borderWidth: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 600,
        color: 'white'
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