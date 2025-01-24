import { View, Text, KeyboardAvoidingView, TouchableWithoutFeedback, Image, TextInput, Pressable, useColorScheme, StyleSheet, Keyboard, ActivityIndicator, Alert } from 'react-native'
import React, { useRef, useState } from 'react'
import { generalStyle } from '@/style/generalStyle'
import { router } from 'expo-router'
import { RegisterUserInfo } from '@/types/auth'
import { Modalize } from 'react-native-modalize'
import { AntDesign } from '@expo/vector-icons'
import OtpTextInput from 'react-native-otp-textinput';
import { registerUser, sendOtp } from '@/api/auth'
import Toast from 'react-native-toast-message'
import { validateEmail } from '@/utils/helper'
import { updateAuth } from '../Context/authProvider'
import { useDispatch } from 'react-redux'
import * as AppleAuthentication from 'expo-apple-authentication';

const UserRegister = () => {
  const colorScheme = useColorScheme() || "light"
  const [userInfo, setUserInfo] = useState<RegisterUserInfo>()
  const modalizeRef = useRef<Modalize>(null)
  const dispatch = useDispatch()
  const [otp, setOtp] = useState("")
  const [secret, setSecret] = useState("")
  const [load, setLoad] = useState(false)
  const [created, setCreated] = useState(false)

  const handleInput = (type: string, value: string) => {
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo!,
      [type!]: value!,
    }));
  }

  const handleAppleLogin = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      console.log(credential);

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

  const handleSubmit = async () => {
    setLoad(true)
    const body: RegisterUserInfo = {
      ...userInfo!,
      otp: otp,
      secret_key: secret,
      country_code: "1"
    }
    console.log(body);

    const response = await registerUser(body)
    console.log(response);

    if (response?.status === 201 || response?.status === 200) {
      console.log("success");
      const data = response?.data?.data
      dispatch(updateAuth({ auth: data }))
      router.push("/(user)")
    } else {
      Toast.show({
        type: "error",
        text1: response?.data
      })
    }
    setLoad(false)
  }

  const handleSendOtp = async () => {
    if (!userInfo?.firstname || !userInfo?.lastname || !userInfo?.phone) {
      Toast.show({
        type: "error",
        text1: "Fill the required field"
      })
      return
    } else if (!validateEmail(userInfo?.email)) {
      Toast.show({
        type: "error",
        text1: "Invalide Email"
      })
      return
    } else if (!userInfo?.password) {
      Toast.show({
        type: "error",
        text1: "Enter a password"
      })
      return
    } else if (userInfo?.password !== userInfo?.confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Password and confirm password do not match"
      })
      return
    }
    setLoad(true)
    const response = await sendOtp({ email: userInfo?.email! })
    if (response?.status === 201 || response?.status === 200) {
      console.log(response?.data?.data);
      setSecret(response?.data?.data)
      Keyboard.dismiss()
      Toast.show({
        type: "success",
        text1: "OTP Code Sent To Your Email"
      })
      modalizeRef.current?.open()
    } else {
      Toast.show({
        type: "error",
        text1: response?.data
      })
    }
    setLoad(false)
  }

  return (
    <KeyboardAvoidingView style={styles.registerContainer}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.registerMain}>
          <Image source={require("../../assets/images/logo.png")} />
          <Text style={{ ...styles.profileText, ...generalStyle.text[colorScheme] }}>Create a profile</Text>
          <TextInput placeholderTextColor={generalStyle.text[colorScheme].color} onChangeText={(text) => handleInput("firstname", text)} value={userInfo?.firstname} style={{ ...styles.registerInput, ...generalStyle.border[colorScheme], ...generalStyle.text[colorScheme] }} placeholder='First Name' />
          <TextInput placeholderTextColor={generalStyle.text[colorScheme].color} onChangeText={(text) => handleInput("lastname", text)} value={userInfo?.lastname} style={{ ...styles.registerInput, ...generalStyle.border[colorScheme], ...generalStyle.text[colorScheme] }} placeholder='Last Name' />
          <TextInput autoCapitalize='none' autoCorrect={false} keyboardType='email-address' placeholderTextColor={generalStyle.text[colorScheme].color} onChangeText={(text) => handleInput("email", text)} value={userInfo?.email} style={{ ...styles.registerInput, ...generalStyle.border[colorScheme], ...generalStyle.text[colorScheme] }} placeholder='Email' />
          <TextInput placeholderTextColor={generalStyle.text[colorScheme].color} onChangeText={(text) => handleInput("phone", text)} value={userInfo?.phone} keyboardType='phone-pad' style={{ ...styles.registerInput, ...generalStyle.border[colorScheme], ...generalStyle.text[colorScheme] }} placeholder='Phone Number' />
          <TextInput placeholderTextColor={generalStyle.text[colorScheme].color} onChangeText={(text) => handleInput("password", text)} value={userInfo?.password} style={{ ...styles.registerInput, ...generalStyle.border[colorScheme], ...generalStyle.text[colorScheme] }} placeholder='Password' />
          <TextInput placeholderTextColor={generalStyle.text[colorScheme].color} onChangeText={(text) => handleInput("confirmPassword", text)} value={userInfo?.confirmPassword} style={{ ...styles.registerInput, ...generalStyle.border[colorScheme], ...generalStyle.text[colorScheme] }} placeholder='Confirm Password' />
          <Pressable onPress={handleSendOtp} style={{ ...styles.registerButton, ...(colorScheme === "light" && generalStyle.button.active), ...(colorScheme === "dark" && generalStyle.button.dark) }}>
            {
              load ?
                <View><ActivityIndicator color={"white"} size="large" /></View> :
                <Text style={{ ...styles.buttonText, ...generalStyle.text["dark"] }}>Register</Text>
            }
          </Pressable>
          <View style={styles.registerDivider}>
            <View style={{ ...styles.dividerLine, ...generalStyle.divider[colorScheme] }}></View>
            <Text style={{ ...styles.dividerText, ...generalStyle.text[colorScheme] }}>OR</Text>
            <View style={{ ...styles.dividerLine, ...generalStyle.divider[colorScheme] }}></View>
          </View>
          <Pressable style={{ ...styles.oauthButton, ...generalStyle.border[colorScheme] }}>
            <Image source={require("../../assets/images/google.png")} />
            <Text style={{ ...styles.oauthText, ...generalStyle.text[colorScheme] }}>Continue with Google</Text>
          </Pressable>
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={10}
            style={{ width: '100%', height: 50, marginBottom: 15 }}
            onPress={handleAppleLogin}
          />
          <Text style={{ ...styles.loginText, ...generalStyle.text[colorScheme] }}>Already have an account? <Text onPress={() => router.push("/login")} style={{ color: "#F0594C" }}>Log In</Text></Text>
          <View style={styles.termsContainer}>
            <Text style={{ textAlign: "center", fontSize: 12, ...generalStyle.text[colorScheme] }}>By signing up for an account, you agree to</Text>
            <Text style={{ ...styles.termsText, fontSize: 12, ...generalStyle.text[colorScheme] }}>ChaimBase’s Terms of Service and Privacy Policy.</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
      <Modalize
        ref={modalizeRef}
        adjustToContentHeight={true}
        modalStyle={generalStyle.modalBackground[colorScheme]}
        closeOnOverlayTap={false}
      >
        {
          !created ?
            <View style={styles.modalContent}>
              <Text style={{ fontSize: 20, fontWeight: 700, textAlign: "center", ...generalStyle.text[colorScheme] }}>Verify OTP</Text>
              <Text style={{ fontSize: 16, marginVertical: 10, fontWeight: 600, textAlign: "center", ...generalStyle.text[colorScheme] }}>An OTP was sent to your email</Text>
              <OtpTextInput
                inputCount={6}
                containerStyle={styles.otpInputContainer}
                textInputStyle={{ ...styles.otpInputBox, ...generalStyle.background[colorScheme], ...generalStyle.text[colorScheme] }}
                handleTextChange={(otp) => setOtp(otp)}
              />
              <Pressable onPress={handleSubmit} style={{ ...styles.registerButton, marginTop: 40, ...(colorScheme === "light" && generalStyle.button.active), ...(colorScheme === "dark" && generalStyle.button.dark) }}>
                {
                  load ?
                    <View><ActivityIndicator color={"white"} size="large" /></View> :
                    <Text style={{ ...styles.buttonText, ...generalStyle.text["dark"] }}>Verify</Text>
                }
              </Pressable>
            </View> :
            <View style={styles.modalContent}>
              <Text style={{ fontSize: 20, fontWeight: 700, textAlign: "center", ...generalStyle.text[colorScheme] }}>OTP Verified Successfully</Text>
              <Text style={{ fontSize: 16, marginTop: 10, fontWeight: 600, textAlign: "center", ...generalStyle.text[colorScheme] }}>Your Account Has Been Created Successfully</Text>
              <AntDesign style={{ textAlign: "center", marginVertical: 20 }} name="checkcircle" size={60} color="green" />
              <Pressable onPress={() => router.push("/(user)")} style={{ ...styles.registerButton, marginTop: 10, ...(colorScheme === "light" && generalStyle.button.active), ...(colorScheme === "dark" && generalStyle.button.dark) }}><Text style={{ ...styles.buttonText, ...generalStyle.text["dark"] }}>Go To Dashboard</Text></Pressable>
            </View>
        }
      </Modalize>
    </KeyboardAvoidingView>
  )
}

export default UserRegister

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
  registerButton: {
    width: "100%",
    height: 52,
    borderRadius: 10,
    backgroundColor: "#00000080",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 600
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
  oauthText: {
    fontSize: 18,
    fontWeight: 600
  },
  loginText: {
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 30
  },
  termsContainer: {
    position: "absolute",
    bottom: 30
  },
  termsText: {
    fontSize: 14,
    fontWeight: 500
  },
  modalContent: {
    padding: 25,
    height: 320
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
})