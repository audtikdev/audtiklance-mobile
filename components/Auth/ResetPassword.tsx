import { View, Text, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, Keyboard, StyleSheet, TextInput, Pressable, useColorScheme, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AntDesign, FontAwesome6, Ionicons } from '@expo/vector-icons'
import { generalStyle } from '@/style/generalStyle'
import { containNumber } from '@/utils/helper'
import Toast from 'react-native-toast-message'
import { router } from 'expo-router'
import { resetPassword } from '@/api/auth'

const ResetPassword: React.FC<{ query: string }> = ({ query }) => {
    const colorScheme = useColorScheme() || "light"
    const [showPass, setShowPass] = useState(true)
    const [otp, setOtp] = useState("")
    const [secret, setSecret] = useState("")
    const [load, setLoad] = useState(false);
    const [userInfo, setUserInfo] = useState<{ password: string, confirmPassword: string }>()

    useEffect(() => {
        const getQuery = query?.split("&")
        const getOtp = getQuery?.[0]?.split("=")
        const getSecret = getQuery?.[1]?.split("=")
        setOtp(getOtp[1])
        setSecret(getSecret[1])
    }, [])

    const handleInput = (type: string, value: string) => {
        setUserInfo((prevUserInfo) => ({
            ...prevUserInfo!,
            [type!]: value!,
        }));
    }

    const handleSubmit = async () => {
        if (!userInfo?.password || userInfo?.password?.length! < 8 || !containNumber(userInfo?.password)) {
            return
        }
        if (userInfo?.password !== userInfo?.confirmPassword) {
            Toast.show({
                type: "error",
                text1: "Password doesn’t match",
                text2: "The new and confirm password must match each other"
            })
            return
        }
        setLoad(true)
        const body = {
            password: userInfo?.password,
            otp: otp,
            secret_key: secret
        }
        const response = await resetPassword(body)
        if (response?.status === 201 || response?.status === 200) {
            Toast.show({
                type: "success",
                text1: "Password Reset Successfully",
                text2: "Navigating to login"
            })
            setTimeout(() => {
                router.push("/login")
            }, 2000)
        } else {
            Toast.show({
                type: "error",
                text1: response?.data
            })
        }
        setLoad(false)
    }

    return (
        <KeyboardAvoidingView style={styles.resetContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.resetMainView}>
                    <Pressable onPress={() => router.back()} style={styles.backIcon}>
                        <Ionicons name="chevron-back" size={24} color="black" />
                    </Pressable>
                    <Text style={{ ...styles.title, ...(colorScheme === "dark" && generalStyle.text.dark) }}>Set New Password</Text>
                    <Text style={{ ...styles.text, ...(colorScheme === "dark" && generalStyle.text.dark) }}>Create a strong password to secure your account</Text>
                    <View style={{ ...styles.passwordContainer, ...generalStyle.border[colorScheme] }}>
                        <TextInput placeholderTextColor={generalStyle.text[colorScheme].color} secureTextEntry={showPass} onChangeText={(text) => handleInput("password", text)} value={userInfo?.password} style={{ ...styles.passwordInput, ...generalStyle.text[colorScheme] }} placeholder='Password' />
                        <Pressable onPress={() => setShowPass(!showPass)}>
                            <FontAwesome6 name={showPass ? "eye" : "eye-slash"} size={15} color={colorScheme === "dark" ? "white" : "black"} />
                        </Pressable>
                    </View>
                    <View style={{ ...styles.passwordContainer, ...generalStyle.border[colorScheme] }}>
                        <TextInput placeholderTextColor={generalStyle.text[colorScheme].color} secureTextEntry={showPass} onChangeText={(text) => handleInput("confirmPassword", text)} value={userInfo?.confirmPassword} style={{ ...styles.passwordInput, ...generalStyle.text[colorScheme] }} placeholder='Confirm Password' />
                        <Pressable onPress={() => setShowPass(!showPass)}>
                            <FontAwesome6 name={showPass ? "eye" : "eye-slash"} size={15} color={colorScheme === "dark" ? "white" : "black"} />
                        </Pressable>
                    </View>
                    <Text style={{ marginVertical: 10, ...generalStyle.text[colorScheme] }}>Password must include:</Text>
                    <Pressable style={{ display: "flex", alignItems: "center", flexDirection: "row", columnGap: 10, marginVertical: 10 }}>
                        <AntDesign name="checksquare" size={24} color={!userInfo?.password || userInfo?.password?.length! < 8 ? "#00000010" : "#1B64F1"} />
                        <Text style={{ ...generalStyle.text[colorScheme] }}>be minimum of 8 characters</Text>
                    </Pressable>
                    <Pressable style={{ display: "flex", alignItems: "center", flexDirection: "row", columnGap: 10 }}>
                        <AntDesign name="checksquare" size={24} color={!userInfo?.password || !containNumber(userInfo?.password) ? "#00000010" : "#1B64F1"} />
                        <Text style={{ ...generalStyle.text[colorScheme] }}>include a number</Text>
                    </Pressable>
                    <Pressable onPress={handleSubmit} style={{ ...styles.registerButton, ...(colorScheme === "light" && generalStyle.button.active), ...(colorScheme === "dark" && generalStyle.button.dark) }}>
                        {
                            load ?
                                <ActivityIndicator size={"large"} /> :
                                <Text style={{ ...styles.buttonText, ...generalStyle.text["dark"] }}>Reset Password</Text>
                        }
                    </Pressable>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

export default ResetPassword

const styles = StyleSheet.create({
    resetContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%"
    },
    resetMainView: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        flexDirection: "column",
        padding: 25,
        paddingTop: 100,
        width: "100%",
        height: "100%",
    },
    backIcon: {
        width: 40,
        height: 40,
        backgroundColor: "#EFECEC",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 700,
        color: "#0E0E0E",
        marginTop: 30,
        marginBottom: 20,
    },
    text: {
        fontSize: 16,
        fontWeight: 500,
        color: "#475367",
        marginBottom: 30
    },
    passwordContainer: {
        width: "100%",
        height: 50,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
        columnGap: 10,
        borderWidth: 1,
        borderRadius: 5,
    },
    passwordInput: {
        width: "90%",
        height: "100%",
        paddingLeft: 10,
        borderWidth: 0
    },
    registerButton: {
        width: "100%",
        height: 52,
        borderRadius: 10,
        backgroundColor: "#00000080",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 60
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 600
    },
})