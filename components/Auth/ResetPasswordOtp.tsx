import { View, Text, StyleSheet, Pressable, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform, useColorScheme, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { generalStyle } from '@/style/generalStyle';
import OtpTextInput from 'react-native-otp-textinput';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';
import { sendForgotPasswordOtp, verifyOtp } from '@/api/auth';

const ResetPasswordOtp: React.FC<{ query: string }> = ({ query }) => {
    const colorScheme = useColorScheme() || "light";
    const [inputValue, setInputValue] = useState<string>("")
    const [seconds, setSeconds] = useState(60);
    const [email, setEmail] = useState("")
    const [secret, setSecret] = useState("")
    const [isActive, setIsActive] = useState(true);
    const [load, setLoad] = useState(false);

    useEffect(() => {
        Toast.show({
            type: "success",
            text1: "OTP Code Sent",
            text2: `Check your email for the otp code`
        })
        const getQuery = query?.split("&")
        const getEmail = getQuery?.[0]?.split("=")
        const getSecret = getQuery?.[1]?.split("=")
        setEmail(getEmail[1])
        setSecret(getSecret[1])
    }, [])

    useEffect(() => {
        let timer: any;
        if (isActive && seconds > 0) {
            timer = setInterval(() => {
                setSeconds((prevSeconds) => prevSeconds - 1);
            }, 1000);  // 1 second interval
        } else if (seconds === 0) {
            clearInterval(timer);
            setIsActive(false)
        }

        return () => clearInterval(timer);
    }, [isActive, seconds]);

    const handleSubmit = async () => {
        setLoad(true)
        Keyboard.dismiss()
        const body = {
            action: "ACTIVATE_USER",
            otp: inputValue,
            secret_key: secret
        }
        const response = await verifyOtp(body)
        if (response?.status === 201 || response?.status === 200) {
            router.push(`/resetPassword/otp=${inputValue}&secret=${secret}`)
        } else {
            Toast.show({
                type: "error",
                text1: response?.data
            })
        }
        setLoad(false)
    }

    const resetTimer = async () => {
        const body = {
            email: email
        }
        const response = await sendForgotPasswordOtp(body)
        if (response?.status === 201 || response?.status === 200) {
            Toast.show({
                type: "success",
                text1: "Otp Sent Successfully"
            })
        } else {
            Toast.show({
                type: "error",
                text1: response?.data
            })
        }
        setSeconds(60);
        setIsActive(true);
    };

    return (
        <View>
            <KeyboardAvoidingView style={styles.otpContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.otpMainView}>
                        <View style={styles.otpVerifyContainer}>
                            <Text style={{ ...styles.otpTitle }}>Verify Account</Text>
                            <Text style={{ ...styles.otpText }}>A verification code has been sent to your email <Text style={{ fontWeight: "700" }}>{email}</Text></Text>
                            <View style={{ ...styles.verifyText }}>
                                <Text style={{ ...styles.otpText, fontSize: 13, fontWeight: 600 }}>Enter the OTP code below or <Text style={{ color: "#F0594C", textDecorationLine: "underline" }}>Change email</Text></Text>
                            </View>
                            <View style={styles.otpInput}>
                                <OtpTextInput
                                    inputCount={6}
                                    containerStyle={styles.otpInputContainer}
                                    textInputStyle={{ ...styles.otpInputBox }}
                                    handleTextChange={(otp) => setInputValue(otp)}
                                />
                            </View>
                            <Pressable disabled={inputValue.length < 4} onPress={handleSubmit} style={{ ...styles.numberButton }}>
                                {
                                    load ?
                                    <ActivityIndicator size={"large"} /> :
                                    <Text style={{ ...styles.buttonText  }}>Verify Code</Text>
                                }
                            </Pressable>
                        </View>
                        {
                            isActive ?
                                <Text>Send code reload in: <Text style={{ color: "#F0594C" }}>{seconds}</Text></Text> :
                                <Text onPress={resetTimer} style={{ color: "#F0594C" }}>Resend Code</Text>
                        }
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </View>
    )
}

export default ResetPasswordOtp

const styles = StyleSheet.create({
    otpContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        backgroundColor: "white"
    },
    otpMainView: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "column",
        padding: 40,
        width: "100%",
        height: "100%",
    },
    otpVerifyContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        width: "100%",
        paddingTop: 100
    },
    verifyText: {
        backgroundColor: "#F9FAFB",
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginTop: 40,
        borderRadius: 8,
    },
    otpTitle: {
        fontSize: 24,
        fontWeight: 700,
        marginTop: 10,
        marginBottom: 10
    },
    otpText: {
        fontSize: 14,
        fontWeight: 400,
        textAlign: 'center',
        color: "#475367"
    },
    otpInput: {
        marginTop: 30,
        marginBottom: 30,
        columnGap: 10,
        width: "100%"
    },
    otpInputContainer: {

    },
    otpInputBox: {
        borderColor: "#F0F2F5",
        backgroundColor: "#F9FAFB",
        width: 50,
        height: 60,
        borderRadius: 8
    },
    otpCountryCode: {
        borderWidth: 1,
        width: 68,
        height: 50,
        borderRadius: 5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    numberInput: {
        height: 50,
        borderWidth: 1,
        flexShrink: 1,
        width: '100%',
        marginBottom: 20,
        paddingLeft: 10,
        borderRadius: 5,
    },
    numberButton: {
        width: "100%",
        height: 52,
        borderRadius: 10,
        backgroundColor: "#1B64F1",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 600
    },
    modalContent: {
        padding: 20,
        paddingTop: 60
    },
    modalHeading: {
        fontSize: 16,
        fontWeight: 600,
        fontFamily: "Nunito Sans",
        marginBottom: 5,
        textAlign: "center"
    },
})