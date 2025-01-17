import { generalStyle } from '@/style/generalStyle'
import { AntDesign, MaterialIcons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react'
import { ActivityIndicator, Alert, Image, Keyboard, KeyboardAvoidingView, Pressable, StyleSheet, Text, TouchableWithoutFeedback, useColorScheme, View } from 'react-native'
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
        console.log(response);

        if (response?.status === 201 || response?.status === 200) {
            console.log(response?.data?.data);
            dispatch(updateRegisterProvider({ provider: { secret_key: response?.data?.data } }))
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
        let localUri = providerDetails?.profile_picture!;
        let filename = localUri.split('/').pop();

        let match = /\.(\w+)$/.exec(filename!);
        let type = match ? `image/${match[1]}` : `image`;
        // @ts-ignore
        formData.append('profile_picture', { uri: localUri, name: filename, type });
        providerDetails?.skill_data?.forEach((skillData, index) => {
            formData.append(`skill_data[${index}]skill`, skillData.skill!);
            formData.append(`skill_data[${index}]cost`, `${skillData.cost}`);
            formData.append(`skill_data[${index}]time_frame`, `${skillData.time_frame}`);
        })
        images?.forEach((image, i) => {
            let filename = image?.split('/').pop();

            let match = /\.(\w+)$/.exec(filename!);
            let type = match ? `image/${match[1]}` : `image`;
            // @ts-ignore
            formData.append(`images${i}`, { uri: image, name: filename, type });
        })
        formData.append("email", providerDetails?.email!)
        formData.append("password", providerDetails?.password!)
        formData.append("otp", otp)
        formData.append("secret_key", providerDetails?.secret_key!)
        formData.append("longitude", providerDetails?.longitude!)
        formData.append("latitude", providerDetails?.latitude!)
        formData.append("business_name", providerDetails?.business_name!)
        formData.append("phone", providerDetails?.phone!)
        formData.append("address", providerDetails?.address!)
        formData.append("about_me", providerDetails?.about_me!)
        formData.append("is_active", "true")
        console.log(formData.get("profile_picture"));
        const response = await registerProvider(formData)
        if (response?.status === 201 || response?.status === 200) {
            dispatch(updateAuth({ auth: response?.data?.data }))
            Toast.show({
                type: "success",
                text1: "Registration Successful"
            })
        } else {
            Toast.show({
                type: "error",
                text1: response?.data
            })
        }
        setLoad(false)
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
                        <Pressable onPress={handleSubmit} style={{ ...styles.registerButton, ...(colorScheme === "light" && generalStyle.button.active), ...(colorScheme === "dark" && generalStyle.button.dark) }}>
                            {
                                load ?
                                    <ActivityIndicator size={"large"} color={"white"} /> :
                                    <Text style={{ ...styles.buttonText, ...generalStyle.text["dark"] }}>Continue</Text>
                            }
                        </Pressable>
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