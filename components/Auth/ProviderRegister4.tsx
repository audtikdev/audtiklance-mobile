import { generalStyle } from '@/style/generalStyle'
import { AntDesign, MaterialIcons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react'
import { Alert, Image, Keyboard, KeyboardAvoidingView, Pressable, StyleSheet, Text, TouchableWithoutFeedback, useColorScheme, View } from 'react-native'
import { Modalize } from 'react-native-modalize'
import OtpTextInput from 'react-native-otp-textinput';


const ProviderRegister4 = () => {
    const colorScheme = useColorScheme() || "light"
    const modalizeRef = useRef<Modalize>(null)
    const [images, setImages] = useState<Array<string>>([])
    const [otp, setOtp] = useState("")
    const [created, setCreated] = useState(false)

    const handleSubmit = () => {
        // dispatch(updateRegisterProvider({ provider: userInfo! }))
        modalizeRef.current?.open()
    }

    const handleImageSelect = async () => {
        const permissiomResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (!permissiomResult.granted) {
            Alert.alert('Permission Denied', 'You need to enable permission to select a file')
            return
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            quality: 1,
            allowsMultipleSelection: true
        })

        if (!result.canceled) {
            setImages([...images, ...result.assets?.map((res) => res?.uri)])
        }
    }

    const removeImage = (image: string) => {
        const filteredImage = images?.filter((img) => img !== image)
        setImages(filteredImage)
    }

    const verifyOTP = () => {
        setCreated(true)
    }

    return (
        <>
            <KeyboardAvoidingView style={styles.registerContainer}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.registerMain}>
                        <Image source={require("../../assets/images/logo.png")} />
                        <Text style={{ ...styles.profileText, ...generalStyle.text[colorScheme] }}>Service Provider Profile Creation</Text>
                        <Text style={{ ...styles.profileText, ...generalStyle.text[colorScheme] }}>Upload Media Of Your Previous Work</Text>
                        <Pressable onPress={handleImageSelect} style={{ ...styles.uploadView, ...generalStyle.border[colorScheme] }}>
                            <AntDesign name="upload" size={30} color={colorScheme === "dark" ? "white" : "black"} />
                            <Text style={{ fontSize: 18, ...generalStyle.text[colorScheme] }}>Upload images</Text>
                        </Pressable>
                        <View style={styles.imageList}>
                            {
                                images?.map((image, i) => (
                                    <View style={styles.imageContainer} key={i}>
                                        <Image style={styles.image} source={{ uri: image }} />
                                        <MaterialIcons onPress={() => removeImage(image)} style={styles.cancelIcon} name="cancel" size={24} color="tomato" />
                                    </View>
                                ))
                            }
                        </View>
                        <Pressable onPress={handleSubmit} style={{ ...styles.registerButton, ...(colorScheme === "light" && generalStyle.button.active), ...(colorScheme === "dark" && generalStyle.button.dark) }}><Text style={{ ...styles.buttonText, ...generalStyle.text["dark"] }}>Continue</Text></Pressable>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
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
                            <Text style={{ fontSize: 16, marginTop: 10, fontWeight: 600, textAlign: "center" }}>An OTP was sent to your email</Text>
                            <OtpTextInput
                                inputCount={6}
                                containerStyle={styles.otpInputContainer}
                                textInputStyle={{ ...styles.otpInputBox, ...generalStyle.background[colorScheme], ...generalStyle.text[colorScheme] }}
                                handleTextChange={(otp) => setOtp(otp)}
                            />
                            <Pressable onPress={verifyOTP} style={{ ...styles.registerButton, marginTop: 40, ...(colorScheme === "light" && generalStyle.button.active), ...(colorScheme === "dark" && generalStyle.button.dark) }}><Text style={{ ...styles.buttonText, ...generalStyle.text["dark"] }}>Verify</Text></Pressable>
                        </View> :
                        <View style={styles.modalContent}>
                            <Text style={{ fontSize: 20, fontWeight: 700, textAlign: "center" }}>OTP Verified Successfully</Text>
                            <Text style={{ fontSize: 16, marginTop: 10, fontWeight: 600, textAlign: "center" }}>Your Service Provider Account Has Been Created Successfully</Text>
                            <AntDesign style={{textAlign: "center", marginVertical: 20}} name="checkcircle" size={60} color="green" />
                            <Pressable onPress={()=> router.push("/(user)")} style={{ ...styles.registerButton, marginTop: 10, ...(colorScheme === "light" && generalStyle.button.active), ...(colorScheme === "dark" && generalStyle.button.dark) }}><Text style={{ ...styles.buttonText, ...generalStyle.text["dark"] }}>Go To Dashboard</Text></Pressable>
                        </View>
                }
            </Modalize>
        </>
    )
}

export default ProviderRegister4

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
    imageList: {
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 10,
        flexDirection: "row",
        marginVertical: 10,
        width: "100%"
    },
    imageContainer: {
        width: "23%",
        height: 100,
        flexGrow: 1,
        maxWidth: "25%",
        position: "relative"
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
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 4
    },
    cancelIcon: {
        position: "absolute",
        top: -10,
        right: -10
    },
    modalContent: {
        padding: 25,
        height: 320
    },
    profileText: {
        fontSize: 18,
        fontWeight: 600,
        marginTop: 10,
    },
    uploadView: {
        width: "100%",
        height: 150,
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        marginTop: 30
    },
    registerButton: {
        width: "100%",
        height: 52,
        borderRadius: 10,
        backgroundColor: "#00000080",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        flexShrink: 1
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 600
    },
})