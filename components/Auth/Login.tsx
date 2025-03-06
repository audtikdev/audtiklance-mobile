import { View, Text, KeyboardAvoidingView, TouchableWithoutFeedback, Image, TextInput, Pressable, useColorScheme, StyleSheet, Keyboard, ActivityIndicator, Alert, Platform } from 'react-native'
import React, { useRef, useState } from 'react'
import { generalStyle } from '@/style/generalStyle'
import { LoginUserInfo } from '@/types/auth'
import { router } from 'expo-router'
import { Modalize } from 'react-native-modalize';
import { appleRegisterUser, googleRegisterUser, loginUser } from '@/api/auth'
import { useDispatch, useSelector } from 'react-redux'
import { updateAuth } from '../Context/authProvider'
import * as AuthSession from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';
import { jwtDecode } from "jwt-decode";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Toast from 'react-native-toast-message'
import { RootState } from '../Store/store'

const Login = () => {
    const authUser = useSelector((state: RootState) => state.authProvider.auth)
    const colorScheme = useColorScheme() || "light"
    const [userInfo, setUserInfo] = useState<LoginUserInfo>()
    const [load, setLoad] = useState(false)
    const [loadGoogle, setLoadGoogle] = useState(false)
    const modalizeRef = useRef<Modalize>(null)
    const dispatch = useDispatch()
    const redirectUri = AuthSession.makeRedirectUri();
    GoogleSignin.configure({
        webClientId: '15571279761-50hvuoaofihijl2c8v6vuimpcgt751a3.apps.googleusercontent.com',
        iosClientId: '15571279761-v4q3rb97hueq6koviotj3fa3jflhvi4p.apps.googleusercontent.com',
        offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    });

    const handleGoogleSignIn = async () => {
        try {
            setLoadGoogle(true)
            await GoogleSignin.hasPlayServices();
            await GoogleSignin.signIn();
            const tokens = await GoogleSignin.getTokens();
            const body = {
                access_token: tokens.accessToken!,
            }
            const res = await googleRegisterUser(body)
            if (res?.status === 201 || res?.status === 200) {
                const data = res?.data?.data
                dispatch(updateAuth({ auth: data }))
                router.push("/(user)")
            } else {
                Toast.show({
                    type: "error",
                    text1: "Error, try again"
                })
            }
            setLoadGoogle(false)
        } catch (error: any) {
            console.error(error);
            setLoadGoogle(false)
        }

    }

    const handleAppleLogin = async () => {
        try {
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
            });
            const decoded = jwtDecode(credential.identityToken!);
            console.log(decoded);

            const body = {
                // @ts-ignore
                email: decoded?.email,
                firstname: credential?.fullName?.givenName || "Rejoice",
                lastname: credential?.fullName?.familyName || "Uahomo"
            }
            const res = await appleRegisterUser(body)
            if (res?.status === 201 || res?.status === 200) {
                const data = res?.data?.data
                dispatch(updateAuth({ auth: data }))
                router.push("/(user)")
            } else {
                Toast.show({
                    type: "error",
                    text1: "Email or password incorrect"
                })
            }

        } catch (error: any) {
            if (error.code === 'ERR_CANCELED') {
                // User canceled the sign-in request
                Alert.alert('Login canceled');
            } else {

                console.log(error);

            }
        }
    };

    const handleInput = (type: string, value: string) => {
        setUserInfo((prevUserInfo) => ({
            ...prevUserInfo!,
            [type!]: value!,
        }));
    }

    const handleSubmit = async () => {
        if ((!userInfo?.email || userInfo?.email?.length! < 4) || (!userInfo?.password || userInfo?.password?.length! < 4)) {
            return
        }
        setLoad(true)
        const response = await loginUser(userInfo!)
        console.log(response);

        if (response?.status === 201 || response?.status === 200) {
            const data = response?.data?.data
            dispatch(updateAuth({ auth: data }))
            if (data?.service_profile) {
                router.push("/(provider)")
            } else {
                router.push("/(user)")
            }
        } else {
            Toast.show({
                type: "error",
                text1: "Email or password incorrect"
            })
        }
        setLoad(false)
    }

    return (
        <>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.registerContainer}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={{ width: '100%' }}>
                        <View style={styles.registerMain}>
                            <Image source={require("../../assets/images/logo.png")} />
                            <Text style={{ ...styles.profileText }}>Welcome Back {authUser?.firstname}</Text>
                            <TextInput textContentType="emailAddress" autoCapitalize='none' autoCorrect={false} keyboardType='email-address' placeholderTextColor={"black"} onChangeText={(text) => handleInput("email", text)} value={userInfo?.email} style={{ ...styles.registerInput }} placeholder='Email' />
                            <TextInput textContentType="password" placeholderTextColor={"black"} onChangeText={(text) => handleInput("password", text)} value={userInfo?.password} style={{ ...styles.registerInput }} placeholder='Password' />
                            <Text onPress={() => router.push("/forgotPassword")} style={{ alignSelf: "flex-end", fontSize: 14, textDecorationLine: "underline", marginTop: -15 }}>Forgot Password?</Text>
                            <Pressable onPress={handleSubmit} style={{ ...styles.loginButton }}>
                                {
                                    load ?
                                        <View><ActivityIndicator color={"white"} size="large" /></View> :
                                        <Text style={{ ...styles.buttonText }}>Login</Text>
                                }
                            </Pressable>
                            <View style={styles.registerDivider}>
                                <View style={{ ...styles.dividerLine, ...generalStyle.divider[colorScheme] }}></View>
                                <Text style={{ ...styles.dividerText }}>OR</Text>
                                <View style={{ ...styles.dividerLine, ...generalStyle.divider[colorScheme] }}></View>
                            </View>
                            <Pressable onPress={() => handleGoogleSignIn()} style={{ ...styles.oauthButton }}>
                                <Image source={require("../../assets/images/google.png")} />
                                {
                                    loadGoogle ?
                                    <ActivityIndicator color={'blue'} /> :
                                    <Text style={{ ...styles.oauthText }}>Continue with Google</Text>
                                }
                            </Pressable>
                            <AppleAuthentication.AppleAuthenticationButton
                                buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                                buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                                cornerRadius={10}
                                style={{ width: '100%', height: 50, marginBottom: 15 }}
                                onPress={handleAppleLogin}
                            />

                            <Text style={{ ...styles.loginText }}>Don't have an account? <Text onPress={() => modalizeRef.current?.open()} style={{ color: "#F0594C" }}>Register</Text></Text>
                        </View>
                        <View style={styles.termsContainer}>
                            <Text style={{ textAlign: "center", fontSize: 12 }}>By signing up for an account, you agree to</Text>
                            <Text style={{ ...styles.termsText, textAlign: 'center', fontSize: 12 }}>Audtiklance’s Terms of Service and Privacy Policy.</Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
            <Modalize
                ref={modalizeRef}
                adjustToContentHeight={true}
            >
                <View style={styles.modalContent}>
                    <Pressable onPress={() => router.push("/userRegister")} style={{ ...styles.loginButton, marginTop: 40 }}><Text style={{ ...styles.buttonText, ...generalStyle.buttonText.light }}>I am looking for service providers</Text></Pressable>
                    <Pressable onPress={() => router.push("/providerRegister1")} style={{ ...styles.registerButton }}><Text style={{ ...styles.buttonText, color: "black" }}>I am a service provider</Text></Pressable>
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
        padding: 20,
        backgroundColor: "white"
    },

    registerMain: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        width: "100%",
        height: "93%"
    },
    modalContent: {
        padding: 20,
        paddingTop: 1,
        height: 220
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
        fontWeight: 600,
        color: "white"
    },
    termsContainer: {
        marginTop: 5,
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