import { View, Text, KeyboardAvoidingView, TouchableWithoutFeedback, Image, TextInput, Pressable, StyleSheet, Keyboard, Platform } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import { RegisterProvider, RegisterUserInfo } from '@/types/auth'
import { useDispatch } from 'react-redux'
import { updateRegisterProvider } from '../Context/registerProvider'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import { providerRegisterOneSchema } from '@/validation/register'

const ProviderRegister1 = () => {
  const dispatch = useDispatch()
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(providerRegisterOneSchema),
  });

  const onSubmit = (data: Partial<RegisterProvider>) => {
    dispatch(updateRegisterProvider({ provider: data as RegisterProvider }))
    router.push("/providerRegister2")
  }
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.registerContainer}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{width: '100%'}}>
          <View style={styles.registerMain}>
            <Image style={{ width: 100, height: 100, objectFit: "contain" }} source={require("../../assets/images/logo.png")} />
            <Text style={{ ...styles.profileText, marginBottom: 0 }}>Service Provider Profile Creation</Text>
            <Text style={{ ...styles.profileText }}>Personal Information</Text>
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
                <TextInput placeholderTextColor={"black"} onChangeText={onChange} value={value} onBlur={onBlur} style={{ ...styles.registerInput }} placeholder='Last Name' />
              )}
            />
            <View style={styles.errorContainer}>
                {errors.lastName && <Text style={styles.errorText}>{errors.lastName.message}</Text>}
            </View>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput placeholderTextColor={"black"} onChangeText={onChange} value={value?.toLowerCase()} onBlur={onBlur} style={{ ...styles.registerInput }} placeholder='Email' />
              )}
            />
            <View style={styles.errorContainer}>
              {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
            </View>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput placeholderTextColor={"black"} onChangeText={onChange} value={value} onBlur={onBlur} style={{ ...styles.registerInput }} placeholder='Password' />
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
            <Pressable onPress={handleSubmit(onSubmit)} style={{ ...styles.registerButton, }}><Text style={{ ...styles.buttonText }}>Continue</Text></Pressable>
            <Text style={{ ...styles.loginText }}>Already have an account? <Text onPress={() => router.push("/login")} style={{ color: "#F0594C" }}>Log In</Text></Text>
          </View>
          <View style={styles.termsContainer}>
            <Text style={{ textAlign: "center", fontSize: 12 }}>By signing up for an account, you agree to</Text>
            <Text style={{ ...styles.termsText, textAlign: 'center', fontSize: 12 }}>Audtiklance’s Terms of Service and Privacy Policy.</Text>
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
    padding: 20,
    backgroundColor: "white"
  },
  registerMain: {
    display: "flex",
    justifyContent: "flex-start",
    paddingTop: 60,
    alignItems: "center",
    flexDirection: "column",
    width: "100%",
    height: "93%"
  },
  profileText: {
    fontSize: 16,
    fontWeight: 600,
    marginTop: 10,
    marginBottom: 20
  },
  registerInput: {
    height: 45,
    borderWidth: 1,
    width: '100%',
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 5,
  },
  registerButton: {
    width: "100%",
    height: 47,
    borderRadius: 10,
    backgroundColor: "#1B64F1",
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
  errorContainer: {
    width: "100%",
    marginTop: -15,
    marginBottom: 5
  },
  errorText: {
    fontSize: 13,
    textAlign: "left",
    color: '#F0594C'
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
  oauthText: {
    fontSize: 18,
    fontWeight: 600
  },
  loginText: {
    fontSize: 14,
    fontWeight: 600,
    marginTop: 10
  },
  termsContainer: {
    marginTop: 5,
    height: 50
  },
  termsText: {
    fontSize: 14,
    fontWeight: 500
  }
})