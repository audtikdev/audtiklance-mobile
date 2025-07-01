import { View, Text, KeyboardAvoidingView, TouchableWithoutFeedback, Image, TextInput, Pressable, useColorScheme, StyleSheet, Keyboard, ActivityIndicator, Alert, Platform } from 'react-native'
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
import { userRegisterSchema } from '@/validation/register'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';

const UserRegister = () => {
  const colorScheme = useColorScheme() || "light"
  const [userInfo, setUserInfo] = useState<RegisterUserInfo>()
  const modalizeRef = useRef<Modalize>(null)
  const dispatch = useDispatch()
  const [otp, setOtp] = useState("")
  const [secret, setSecret] = useState("")
  const [load, setLoad] = useState(false)
  const [created, setCreated] = useState(false)
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(userRegisterSchema),
  });

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

  const onSubmit = async (data: Partial<RegisterUserInfo>) => {
    if (data?.password !== data?.confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Password and confirm password do not match"
      })
      return
    }
    setLoad(true)
    const { confirmPassword, ...body } = data
    const response = await registerUser(body)

    if (response?.status === 201 || response?.status === 200) {
      console.log("success");
      const data = response?.data
      dispatch(updateAuth({ auth: data }))
      router.replace("/(user)")
    } else {
      Toast.show({
        type: "error",
        text1: response?.data
      })
    }
    setLoad(false)
  }

  // const handleSendOtp = async (data: RegisterUserInfo) => {
  //   if (userInfo?.password !== userInfo?.confirmPassword) {
  //     Toast.show({
  //       type: "error",
  //       text1: "Password and confirm password do not match"
  //     })
  //     return
  //   }
  //   setUserInfo(data)
  //   setLoad(true)
  //   const response = await sendOtp({ email: data?.email })
  //   if (response?.status === 201 || response?.status === 200) {
  //     setSecret(response?.data?.data)
  //     Keyboard.dismiss()
  //     Toast.show({
  //       type: "success",
  //       text1: "OTP Code Sent To Your Email"
  //     })
  //     modalizeRef.current?.open()
  //   } else {
  //     Toast.show({
  //       type: "error",
  //       text1: response?.data
  //     })
  //   }
  //   setLoad(false)
  // }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.registerContainer}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.registerMain}>
          <Image source={require("../../assets/images/logo.png")} />
          <Text style={{ ...styles.profileText }}>Create a profile</Text>
          <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput placeholderTextColor={"black"} onChangeText={onChange} onBlur={onBlur} value={value} style={{ ...styles.registerInput }} placeholder='First Name' />
            )}
          />
          <View style={styles.errorContainer}>
            {errors.firstName && <Text style={styles.errorText}>{errors.firstName.message}</Text>}
          </View>
          <Controller
            control={control}
            name="lastName"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput placeholderTextColor={"black"} onChangeText={onChange} onBlur={onBlur} value={value} style={{ ...styles.registerInput }} placeholder='Last Name' />
            )}
          />
          <View style={styles.errorContainer}>
            {errors.lastName && <Text style={styles.errorText}>{errors.lastName.message}</Text>}
          </View>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput autoCapitalize='none' autoCorrect={false} keyboardType='email-address' placeholderTextColor={"black"} onChangeText={onChange} onBlur={onBlur} value={value?.toLowerCase()} style={{ ...styles.registerInput }} placeholder='Email' />
            )}
          />
          <View style={styles.errorContainer}>
            {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
          </View>
          <Controller
            control={control}
            name="phoneNumber"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput placeholderTextColor={"black"} onChangeText={onChange} value={value} onBlur={onBlur} keyboardType='phone-pad' style={{ ...styles.registerInput }} placeholder='Phone Number' />
            )}
          />
          <View style={styles.errorContainer}>
            {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber.message}</Text>}
          </View>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput placeholderTextColor={"black"} onChangeText={onChange} onBlur={onBlur} value={value} style={{ ...styles.registerInput }} placeholder='Password' />
            )}
          />
          <View style={styles.errorContainer}>
            {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
          </View>
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput placeholderTextColor={"black"} onChangeText={onChange} onBlur={onBlur} value={value} style={{ ...styles.registerInput }} placeholder='Confirm Password' />
            )}
          />
          <View style={styles.errorContainer}>
            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}
          </View>
          <Pressable onPress={handleSubmit(onSubmit)} style={{ ...styles.registerButton }}>
            {
              load ?
                <View><ActivityIndicator color={"white"} size="large" /></View> :
                <Text style={{ ...styles.buttonText }}>Register</Text>
            }
          </Pressable>
          <View style={styles.registerDivider}>
            <View style={{ ...styles.dividerLine }}></View>
            <Text style={{ ...styles.dividerText }}>OR</Text>
            <View style={{ ...styles.dividerLine }}></View>
          </View>
          <Pressable style={{ ...styles.oauthButton }}>
            <Image source={require("../../assets/images/google.png")} />
            <Text style={{ ...styles.oauthText }}>Continue with Google</Text>
          </Pressable>
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={10}
            style={{ width: '100%', height: 45, marginBottom: 15 }}
            onPress={handleAppleLogin}
          />
          <Text style={{ ...styles.loginText }}>Already have an account? <Text onPress={() => router.push("/login")} style={{ color: "#F0594C" }}>Log In</Text></Text>
          {/* <View style={styles.termsContainer}>
            <Text style={{ textAlign: "center", fontSize: 12 }}>By signing up for an account, you agree to</Text>
            <Text style={{ ...styles.termsText, fontSize: 12 }}>ChaimBase’s Terms of Service and Privacy Policy.</Text>
          </View> */}
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
              <Text style={{ fontSize: 20, fontWeight: 700, textAlign: "center" }}>Verify OTP</Text>
              <Text style={{ fontSize: 16, marginVertical: 10, fontWeight: 600, textAlign: "center" }}>An OTP was sent to your email</Text>
              <OtpTextInput
                inputCount={6}
                containerStyle={styles.otpInputContainer}
                textInputStyle={{ ...styles.otpInputBox, ...generalStyle.background[colorScheme] }}
                handleTextChange={(otp) => setOtp(otp)}
              />
              <Pressable onPress={handleSubmit(onSubmit)} style={{ ...styles.registerButton, marginTop: 40 }}>
                {
                  load ?
                    <View><ActivityIndicator color={"white"} size="large" /></View> :
                    <Text style={{ ...styles.buttonText }}>Verify</Text>
                }
              </Pressable>
            </View> :
            <View style={styles.modalContent}>
              <Text style={{ fontSize: 20, fontWeight: 700, textAlign: "center" }}>OTP Verified Successfully</Text>
              <Text style={{ fontSize: 16, marginTop: 10, fontWeight: 600, textAlign: "center" }}>Your Account Has Been Created Successfully</Text>
              <AntDesign style={{ textAlign: "center", marginVertical: 20 }} name="checkcircle" size={60} color="green" />
              <Pressable onPress={() => router.push("/(user)")} style={{ ...styles.registerButton, marginTop: 10 }}><Text style={{ ...styles.buttonText }}>Go To Dashboard</Text></Pressable>
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
    fontSize: 18,
    fontWeight: 600,
    marginTop: 10,
    marginBottom: 20
  },
  errorContainer: {
    width: "100%",
    marginTop: -10,
    marginBottom: 5
  },
  errorText: {
    fontSize: 13,
    textAlign: "left",
    color: '#F0594C'
  },
  registerInput: {
    height: 40,
    borderWidth: 1,
    width: '100%',
    marginBottom: 15,
    marginTop: 7,
    paddingLeft: 10,
    borderRadius: 5,
  },
  registerButton: {
    width: "100%",
    height: 45,
    borderRadius: 10,
    backgroundColor: "#1B64F1",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 600,
    color: "white"
  },
  registerDivider: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    columnGap: 5,
    marginTop: 10,
    marginBottom: 10,
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
    height: 45,
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