import { generalStyle } from '@/style/generalStyle'
import { AntDesign, MaterialIcons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react'
import { ActivityIndicator, Alert, Image, Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TouchableWithoutFeedback, useColorScheme, View } from 'react-native'
import { Modalize } from 'react-native-modalize'
import OtpTextInput from 'react-native-otp-textinput';
import { RootState } from '../Store/store';
import { useDispatch, useSelector } from 'react-redux';
import { registerProvider, sendOtp } from '@/api/auth';
import Toast from 'react-native-toast-message';
import { updateRegisterProvider } from '../Context/registerProvider';
import { updateAuth } from '../Context/authProvider';


const ProviderRegister4 = () => {
    const providerDetails = useSelector((state: RootState) => state.registerProvider.provider)

    const [load, setLoad] = useState(false)
    const colorScheme = useColorScheme() || "light"
    const modalizeRef = useRef<Modalize>(null)
    const [images, setImages] = useState<Array<string>>([])
    const [otp, setOtp] = useState("")
    const [created, setCreated] = useState(false)
    const dispatch = useDispatch()

    const handleSubmit = async () => {
        setLoad(true)
        const response = await sendOtp({ email: providerDetails?.email! })

        if (response?.status === 201 || response?.status === 200) {
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

    const createAccount = async () => {
        setLoad(true)
        const formData = new FormData()
        providerDetails?.skill_data?.forEach((skillData) => {
            formData.append("services", JSON.stringify({ category: skillData?.skill, price: skillData?.cost }));
        });
        images.unshift(providerDetails?.profilePicture!)
        images?.forEach((image, i) => {
            let filename = image?.split('/').pop();

            let match = /\.(\w+)$/.exec(filename!);
            let type = match ? `image/${match[1]}` : `image`;
            // @ts-ignore
            formData.append(`images`, { uri: image, name: filename, type });
        })
        formData.append("title", providerDetails?.title!);
        formData.append("address", providerDetails?.address!);
        formData.append("phoneNumber", `+${providerDetails?.phoneNumber}`);
        formData.append("email", providerDetails?.email!);
        formData.append("password", providerDetails?.password!);
        formData.append("firstName", providerDetails?.firstName!);
        formData.append("lastName", providerDetails?.lastName!);
        formData.append("location", JSON.stringify({ lat: providerDetails?.latitude, lng: providerDetails?.longitude }))
        formData.append("description", providerDetails?.description!);
        formData.append("otp", otp);
        const response = await registerProvider(formData)
        if (response?.status === 201 || response?.status === 200) {
            dispatch(updateAuth({ auth: { token: response?.data } }))
            Toast.show({
                type: "success",
                text1: "Registration Successful"
            })
            setCreated(true)
        } else {
            Toast.show({
                type: "error",
                text1: response?.data
            })
        }
        setLoad(false)
    }

    return (
        <>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.registerContainer}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.registerMain}>
                        <Image source={require("../../assets/images/logo.png")} />
                        <Text style={{ ...styles.profileText, }}>Service Provider Profile Creation</Text>
                        <Text style={{ ...styles.profileText, }}>Upload Media Of Your Previous Work</Text>
                        <Pressable onPress={handleImageSelect} style={{ ...styles.uploadView }}>
                            <AntDesign name="upload" size={30} color={"black"} />
                            <Text style={{ fontSize: 18, }}>Upload images</Text>
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
                        <Pressable onPress={handleSubmit} style={{ ...styles.registerButton }}>
                            {
                                load ?
                                    <ActivityIndicator size={"large"} color={"white"} /> :
                                    <Text style={{ ...styles.buttonText, ...generalStyle.text["dark"] }}>Continue</Text>
                            }
                        </Pressable>
                        <Pressable onPress={() => router.back()} style={{ ...styles.backButton }}><Text style={{ ...styles.buttonText, color: "#1B64F1" }}>Go back</Text></Pressable>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
            <Modalize
                ref={modalizeRef}
                adjustToContentHeight={true}
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
                                textInputStyle={{ ...styles.otpInputBox, ...generalStyle.background[colorScheme], }}
                                handleTextChange={(otp) => setOtp(otp)}
                            />
                            <Pressable onPress={createAccount} style={{ ...styles.registerButton, marginTop: 40, ...(colorScheme === "light" && generalStyle.button.active), ...(colorScheme === "dark" && generalStyle.button.dark) }}>
                                {
                                    load ?
                                        <ActivityIndicator size={"large"} color={"white"} /> :
                                        <Text style={{ ...styles.buttonText, ...generalStyle.text["dark"] }}>Verify</Text>
                                }
                            </Pressable>
                        </View> :
                        <View style={styles.modalContent}>
                            <Text style={{ fontSize: 20, fontWeight: 700, textAlign: "center" }}>OTP Verified Successfully</Text>
                            <Text style={{ fontSize: 16, marginTop: 10, fontWeight: 600, textAlign: "center" }}>Your Service Provider Account Has Been Created Successfully</Text>
                            <AntDesign style={{ textAlign: "center", marginVertical: 20 }} name="checkcircle" size={60} color="green" />
                            <Pressable onPress={() => router.push("/(provider)")} style={{ ...styles.registerButton, marginTop: 10, ...(colorScheme === "light" && generalStyle.button.active), ...(colorScheme === "dark" && generalStyle.button.dark) }}><Text style={{ ...styles.buttonText, ...generalStyle.text["dark"] }}>Go To Dashboard</Text></Pressable>
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
        fontSize: 15,
        fontWeight: 600,
        marginTop: 10,
    },
    uploadView: {
        width: "100%",
        height: 120,
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
        backgroundColor: "#1B64F1",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        flexShrink: 1
    },
    backButton: {
        width: "100%",
        height: 45,
        borderRadius: 10,
        borderColor: "#1B64F1",
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
})