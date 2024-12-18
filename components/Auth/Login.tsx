import { View, Text, KeyboardAvoidingView, TouchableWithoutFeedback, Image, TextInput, Pressable, useColorScheme, StyleSheet, Keyboard } from 'react-native'
import React, { useRef, useState } from 'react'
import { generalStyle } from '@/style/generalStyle'
import { LoginUserInfo } from '@/types/auth'
import { router } from 'expo-router'
import { Modalize } from 'react-native-modalize';

const Login = () => {
    const colorScheme = useColorScheme() || "light"
    const [userInfo, setUserInfo] = useState<LoginUserInfo>()
    const modalizeRef = useRef<Modalize>(null)

    const handleInput = (type: string, value: string) => {
        setUserInfo((prevUserInfo) => ({
            ...prevUserInfo!,
            [type!]: value!,
        }));
    }

    const handleSubmit = () => {
        router.push("/(tabs)")
    }

    return (
        <>
            <KeyboardAvoidingView style={styles.registerContainer}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.registerMain}>
                        <Image source={require("../../assets/images/logo.png")} />
                        <Text style={{ ...styles.profileText, ...generalStyle.text[colorScheme] }}>Welcome Back Rejoice!</Text>
                        <TextInput placeholderTextColor={generalStyle.text[colorScheme].color} onChangeText={(text) => handleInput("email", text)} value={userInfo?.email} keyboardType='phone-pad' style={{ ...styles.registerInput, ...generalStyle.border[colorScheme], ...generalStyle.text[colorScheme] }} placeholder='Email' />
                        <TextInput placeholderTextColor={generalStyle.text[colorScheme].color} onChangeText={(text) => handleInput("password", text)} value={userInfo?.password} keyboardType='phone-pad' style={{ ...styles.registerInput, ...generalStyle.border[colorScheme], ...generalStyle.text[colorScheme] }} placeholder='Password' />
                        <Text onPress={()=> router.push("/forgotPassword")} style={{ alignSelf: "flex-end", fontSize: 14, textDecorationLine: "underline", marginTop: -15, ...generalStyle.text[colorScheme] }}>Forgot Password?</Text>
                        <Pressable onPress={handleSubmit} style={{ ...styles.loginButton, ...(colorScheme === "light" && generalStyle.button.active), ...(colorScheme === "dark" && generalStyle.button.dark) }}><Text style={{ ...styles.buttonText, ...generalStyle.text["dark"] }}>Login</Text></Pressable>
                        <View style={styles.registerDivider}>
                            <View style={{ ...styles.dividerLine, ...generalStyle.divider[colorScheme] }}></View>
                            <Text style={{ ...styles.dividerText, ...generalStyle.text[colorScheme] }}>OR</Text>
                            <View style={{ ...styles.dividerLine, ...generalStyle.divider[colorScheme] }}></View>
                        </View>
                        <Pressable style={{ ...styles.oauthButton, ...generalStyle.border[colorScheme] }}>
                            <Image source={require("../../assets/images/google.png")} />
                            <Text style={{ ...styles.oauthText, ...generalStyle.text[colorScheme] }}>Continue with Google</Text>
                        </Pressable>
                        <Text style={{ ...styles.loginText, ...generalStyle.text[colorScheme] }}>Don't have an account? <Text onPress={() => modalizeRef.current?.open()} style={{ color: "#F0594C" }}>Register</Text></Text>
                        <View style={styles.termsContainer}>
                            <Text style={{ textAlign: "center", ...generalStyle.text[colorScheme] }}>By signing up for an account, you agree to</Text>
                            <Text style={{ ...styles.termsText, ...generalStyle.text[colorScheme] }}>Audtiklance’s Terms of Service and Privacy Policy.</Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
            <Modalize
                ref={modalizeRef}
                modalHeight={220}
                modalStyle={generalStyle.background[colorScheme]}
            >
                <View style={styles.modalContent}>
                    <Pressable onPress={() => router.push("/userRegister")} style={{ ...styles.loginButton, marginTop: 40 }}><Text style={{ ...styles.buttonText, ...generalStyle.buttonText[colorScheme] }}>I am looking for service providers</Text></Pressable>
                    <Pressable style={{ ...styles.registerButton, ...generalStyle.border[colorScheme] }}><Text style={{ ...styles.buttonText, ...generalStyle.text[colorScheme] }}>I am a service provider</Text></Pressable>
                </View>
            </Modalize>
        </>
    )
}

export default Login

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
        padding: 20,
        paddingTop: 1
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
        marginBottom: 20,
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
        marginTop: 30
    },
    registerButton: {
        width: "100%",
        height: 52,
        borderRadius: 10,
        borderWidth: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 600
    },
    termsContainer: {
        position: "absolute",
        bottom: 30
    },
    termsText: {
        fontSize: 14,
        fontWeight: 500
    },
    registerDivider: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        columnGap: 5,
        marginTop: 20,
        marginBottom: 20,
        width: "100%"
    },
    dividerLine: {
        width: "50%",
        flexShrink: 1,
        height: 1,
        backgroundColor: "#00000050"
    },
    dividerText: {
        fontSize: 16,
        fontWeight: 600
    },
    oauthButton: {
        height: 50,
        borderWidth: 1,
        flexShrink: 1,
        width: '100%',
        marginBottom: 20,
        borderRadius: 10,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        columnGap: 10
    },
    loginText: {
        fontSize: 14,
        fontWeight: 600,
        marginBottom: 30
    },
    oauthText: {
        fontSize: 18,
        fontWeight: 600
    },
})