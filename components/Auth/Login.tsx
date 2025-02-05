import { View, Text, KeyboardAvoidingView, TouchableWithoutFeedback, Image, TextInput, Pressable, useColorScheme, StyleSheet, Keyboard, ActivityIndicator, Alert, Platform } from 'react-native'
import React, { useRef, useState } from 'react'
import { generalStyle } from '@/style/generalStyle'
import { LoginUserInfo } from '@/types/auth'
import { router } from 'expo-router'
import { Modalize } from 'react-native-modalize';
import { loginUser } from '@/api/auth'
import { useDispatch } from 'react-redux'
import { updateAuth } from '../Context/authProvider'
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';
import { jwtDecode } from "jwt-decode";
// import { GoogleSignin,  statusCodes } from '@react-native-google-signin/google-signin';
import Toast from 'react-native-toast-message'

const Login = () => {
    const colorScheme = useColorScheme() || "light"
    const [userInfo, setUserInfo] = useState<LoginUserInfo>()
    const [load, setLoad] = useState(false)
    const modalizeRef = useRef<Modalize>(null)
    const dispatch = useDispatch()
    const redirectUri = AuthSession.makeRedirectUri();
    // GoogleSignin.configure({
    //     webClientId: '15571279761-v4q3rb97hueq6koviotj3fa3jflhvi4p.apps.googleusercontent.com', 
    //     scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    //     offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    //     hostedDomain: '', // specifies a hosted domain restriction
    //     forceCodeForRefreshToken: false, 
    //     accountName: '',
    //     iosClientId: '15571279761-v4q3rb97hueq6koviotj3fa3jflhvi4p.apps.googleusercontent.com', 
    //     googleServicePlistPath: '',
    //     openIdRealm: '',
    //     profileImageSize: 120,
    //   });

    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: '15571279761-v4q3rb97hueq6koviotj3fa3jflhvi4p.apps.googleusercontent.com',
        androidClientId: "15571279761-66u2sfop0cfvc6eqtaj42alpo6fis65u.apps.googleusercontent.com",
        iosClientId: "15571279761-v4q3rb97hueq6koviotj3fa3jflhvi4p.apps.googleusercontent.com",
        redirectUri: redirectUri
    });

    // const handleGoogleSignIn = async () => {
    //     try {
    //         await GoogleSignin.hasPlayServices();
    //         const response = await GoogleSignin.signIn();
    //         console.log(response.data);

    //       } catch (error: any) {
    //         console.log(error);

    //       }

    // }

    const handleAppleLogin = async () => {
        try {
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
            });
            // console.log(credential);
            const decoded = jwtDecode(credential.identityToken!);
            console.log(decoded);

            // Use credential.user, credential.email, and credential.fullName

        } catch (error: any) {
            if (error.code === 'ERR_CANCELED') {
                // User canceled the sign-in request
                Alert.alert('Login canceled');
            } else {
                // Handle other errors
                Alert.alert('An error occurred', error.message);
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
                            <Text style={{ ...styles.profileText }}>Welcome Back Rejoice!</Text>
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
                            <Pressable onPress={() => promptAsync()} style={{ ...styles.oauthButton }}>
                                <Image source={require("../../assets/images/google.png")} />
                                <Text style={{ ...styles.oauthText }}>Continue with Google</Text>
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