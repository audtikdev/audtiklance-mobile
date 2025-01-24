import { View, Text, KeyboardAvoidingView, TouchableWithoutFeedback, Image, TextInput, Pressable, useColorScheme, StyleSheet, Keyboard } from 'react-native'
import React, { useContext, useState } from 'react'
import { generalStyle } from '@/style/generalStyle'
import { router } from 'expo-router'
import { RegisterProvider, RegisterUserInfo } from '@/types/auth'
import { useDispatch } from 'react-redux'
import { updateRegisterProvider } from '../Context/registerProvider'

const ProviderRegister1 = () => {
  const dispatch = useDispatch()
  const colorScheme = useColorScheme() || "light"
  const [userInfo, setUserInfo] = useState<RegisterProvider>()

  const handleInput = (type: string, value: string) => {
      setUserInfo((prevUserInfo) => ({
          ...prevUserInfo!,
          [type!]: value!,
      }));
  }

  const handleSubmit = () => {
    dispatch(updateRegisterProvider({provider: userInfo!}))
    router.push("/providerRegister2")
  }
  return (
    <KeyboardAvoidingView style={styles.registerContainer}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.registerMain}>
          <Image source={require("../../assets/images/logo.png")} />
          <Text style={{ ...styles.profileText, ...generalStyle.text[colorScheme], marginBottom: 0 }}>Service Provider Profile Creation</Text>
          <Text style={{ ...styles.profileText, ...generalStyle.text[colorScheme] }}>Personal Information</Text>
          <TextInput placeholderTextColor={generalStyle.text[colorScheme].color} onChangeText={(text) => handleInput("firstname", text)} value={userInfo?.firstname} style={{ ...styles.registerInput, ...generalStyle.border[colorScheme], ...generalStyle.text[colorScheme] }} placeholder='First Name' />
          <TextInput placeholderTextColor={generalStyle.text[colorScheme].color} onChangeText={(text) => handleInput("lastname", text)} value={userInfo?.lastname} style={{ ...styles.registerInput, ...generalStyle.border[colorScheme], ...generalStyle.text[colorScheme] }} placeholder='Last Name' />
          <TextInput placeholderTextColor={generalStyle.text[colorScheme].color} onChangeText={(text) => handleInput("email", text)} value={userInfo?.email} style={{ ...styles.registerInput, ...generalStyle.border[colorScheme], ...generalStyle.text[colorScheme] }} placeholder='Email' />
          <TextInput placeholderTextColor={generalStyle.text[colorScheme].color} onChangeText={(text) => handleInput("password", text)} value={userInfo?.password} style={{ ...styles.registerInput, ...generalStyle.border[colorScheme], ...generalStyle.text[colorScheme] }} placeholder='Password' />
          <TextInput placeholderTextColor={generalStyle.text[colorScheme].color} onChangeText={(text) => handleInput("confirmPassword", text)} value={userInfo?.confirmPassword} style={{ ...styles.registerInput, ...generalStyle.border[colorScheme], ...generalStyle.text[colorScheme] }} placeholder='Confirm Password' />
          <Pressable onPress={handleSubmit} style={{ ...styles.registerButton, ...(colorScheme === "light" && generalStyle.button.active), ...(colorScheme === "dark" && generalStyle.button.dark) }}><Text style={{ ...styles.buttonText, ...generalStyle.text["dark"] }}>Continue</Text></Pressable>
          <Text style={{ ...styles.loginText, ...generalStyle.text[colorScheme] }}>Already have an account? <Text onPress={() => router.push("/login")} style={{ color: "#F0594C" }}>Log In</Text></Text>
          <View style={styles.termsContainer}>
            <Text style={{ textAlign: "center", fontSize: 12, ...generalStyle.text[colorScheme] }}>By signing up for an account, you agree to</Text>
            <Text style={{ ...styles.termsText, fontSize: 12, ...generalStyle.text[colorScheme] }}>Audtiklance’s Terms of Service and Privacy Policy.</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default ProviderRegister1

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
      justifyContent: "flex-start",
      paddingTop: 60,
      alignItems: "center",
      flexDirection: "column",
      width: "99%",
      height: "100%"
  },
  profileText: {
      fontSize: 16,
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
      marginTop: 10
      // marginBottom: 30
  },
  termsContainer: {
      position: "absolute",
      bottom: 30
  },
  termsText: {
      fontSize: 14,
      fontWeight: 500
  }
})