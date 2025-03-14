import { referUser, updatePassword, updateUser } from "@/api/auth"
import { generalStyle } from "@/style/generalStyle"
import { RegisterUserInfo } from "@/types/auth"
import { FontAwesome6, Ionicons } from "@expo/vector-icons"
import { useEffect, useState } from "react"
import { ActivityIndicator, Alert, Image, Pressable, StyleSheet, Switch, Text, TextInput, useColorScheme, View } from "react-native"
import { Modalize } from "react-native-modalize"
import { IHandles } from "react-native-modalize/lib/options"
import { RootState } from "../Store/store"
import { useDispatch, useSelector } from "react-redux"
import Toast from "react-native-toast-message"
import * as ImagePicker from 'expo-image-picker';
import { updateAuth } from "../Context/authProvider"

export const AccountModal: React.FC<{ accountRef: React.RefObject<IHandles> }> = ({ accountRef }) => {
    const authUser = useSelector((state: RootState) => state.authProvider.auth)
    const colorScheme = useColorScheme() || "light"
    const [userInfo, setUserInfo] = useState<Pick<RegisterUserInfo, "firstname" | "lastname" | "phone" | "profile_picture">>()
    const [load, setLoad] = useState(false)
    const [image, setImage] = useState('')
    const dispatch = useDispatch()

    useEffect(() => {
        setUserInfo({
            firstname: authUser?.firstname!,
            lastname: authUser?.lastname!,
            phone: authUser?.phone!,
            ...(authUser?.profile_picture && {profile_picture: authUser?.profile_picture})
        })
    }, [])

    const handleInput = (type: string, value: string) => {
        setUserInfo((prevUserInfo) => ({
            ...prevUserInfo!,
            [type!]: value!,
        }));
    }

    const updateUserDetails = async () => {
        if (userInfo) {
            setLoad(true)

            let formData = new FormData();

            formData.append('firstname', userInfo?.firstname)
            formData.append('lastname', userInfo?.lastname)
            formData.append('phone', userInfo?.phone!)

            if (image) {
                let localUri = image;
                let filename = localUri.split('/').pop();

                let match = /\.(\w+)$/.exec(filename!);
                let type = match ? `image/${match[1]}` : `image`;

                // @ts-ignore
                formData.append('profile_picture', { uri: localUri, name: filename, type })
            }
            formData.append('country_code', '1')
            
            const response = await updateUser(formData)
            
            if (response?.status === 200 || response?.status === 201) {
                const data = response?.data?.data
                dispatch(updateAuth({ auth: data }))
                Toast.show({
                    type: "success",
                    text1: "Details Updated Successfully"
                })
                accountRef.current?.close()
            } else {
                Toast.show({
                    type: "error",
                    text1: response?.data
                })
            }
            setLoad(false)
        }
    }

    const handleImageUpload = async () => {
        const permissiomResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (!permissiomResult.granted) {
            Alert.alert('Permission Denied', 'You need to enable permission to select a file')
            return
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            quality: 1
        })
        if (!result.canceled) {
            setImage(result.assets[0].uri!)
        }
    }

    return (
        <Modalize
            ref={accountRef}
            adjustToContentHeight={true}
        >
            <View style={styles.modalContent}>
                <Text style={{ ...styles.profileText }}>Update Your Account Details</Text>
                <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, marginBottom: 20}}>
                    <Image style={{width: 100, height: 100, borderRadius: 100, borderWidth: 1, borderColor: '#1B64F1'}} source={image ? {uri: image} : userInfo?.profile_picture ? {uri: userInfo?.profile_picture} : require('../../assets/images/placeholder.png')} />
                    <Ionicons onPress={handleImageUpload} name="cloud-upload-outline" size={24} color="black" />
                </View>
                <TextInput placeholderTextColor={"black"} onChangeText={(text) => handleInput("firstname", text)} value={userInfo?.firstname} style={{ ...styles.registerInput }} placeholder='First Name' />
                <TextInput placeholderTextColor={"black"} onChangeText={(text) => handleInput("lastname", text)} value={userInfo?.lastname} style={{ ...styles.registerInput }} placeholder='Last Name' />

                <TextInput placeholderTextColor={"black"} onChangeText={(text) => handleInput("phone", text)} value={userInfo?.phone} keyboardType='phone-pad' style={{ ...styles.registerInput }} placeholder='Phone Number' />
                <Pressable onPress={updateUserDetails} style={{ ...styles.registerButton, marginTop: 10 }}>
                    {
                        load ?
                            <ActivityIndicator color={'white'} /> :
                            <Text style={{ ...styles.buttonText }}>Update</Text>
                    }
                </Pressable>
            </View>
        </Modalize>
    )
}

export const PasswordModal: React.FC<{ passwordRef: React.RefObject<IHandles> }> = ({ passwordRef }) => {
    const colorScheme = useColorScheme() || "light"
    const [userInfo, setUserInfo] = useState<{old_password: string, new_password: string}>()
    const [showPass, setShowPass] = useState(true)
    const [load, setLoad] = useState(false)

    const handleInput = (type: string, value: string) => {
        setUserInfo((prevUserInfo) => ({
            ...prevUserInfo!,
            [type!]: value!,
        }));
    }

    const updateUserPassword = async () => {
        if (userInfo) {
            setLoad(true)
            const response = await updatePassword(userInfo)
            if (response?.status === 200 || response?.status === 201) {
                const data = response?.data?.data
                console.log(data);
                
                Toast.show({
                    type: "success",
                    text1: "Password Updated Successfully"
                })
                passwordRef.current?.close()
            } else {
                Toast.show({
                    type: "error",
                    text1: response?.data
                })
            }
            setLoad(false)
        }
    }

    return (
        <Modalize
            ref={passwordRef}
            adjustToContentHeight={true}
        >
            <View style={{ ...styles.modalContent, height: 320 }}>
                <Text style={{ ...styles.profileText }}>Update Your Password</Text>
                <View style={{ ...styles.passwordContainer }}>
                    <TextInput placeholderTextColor={"black"} secureTextEntry={showPass} onChangeText={(text) => handleInput("old_password", text)} value={userInfo?.old_password} style={{ ...styles.passwordInput }} placeholder='Current Password' />
                    <Pressable onPress={() => setShowPass(!showPass)}>
                        <FontAwesome6 name={showPass ? "eye" : "eye-slash"} size={15} color="black" />
                    </Pressable>
                </View>
                <View style={{ ...styles.passwordContainer }}>
                    <TextInput placeholderTextColor={"black"} secureTextEntry={showPass} onChangeText={(text) => handleInput("new_password", text)} value={userInfo?.new_password} style={{ ...styles.passwordInput }} placeholder='New Password' />
                    <Pressable onPress={() => setShowPass(!showPass)}>
                        <FontAwesome6 name={showPass ? "eye" : "eye-slash"} size={15} color="black" />
                    </Pressable>
                </View>
                <Pressable onPress={updateUserPassword} style={{ ...styles.registerButton, marginTop: 10 }}>
                    {
                        load ?
                        <ActivityIndicator /> :
                        <Text style={{ ...styles.buttonText }}>Update</Text>
                    }
                </Pressable>
            </View>
        </Modalize>
    )
}

export const NotifyModal: React.FC<{ notifyRef: React.RefObject<IHandles> }> = ({ notifyRef }) => {
    const authUser = useSelector((state: RootState) => state.authProvider.auth)
    const [notify, setNotify] = useState(authUser?.notify)
    const dispatch = useDispatch()

    const updateUserNotification = async () => {
        dispatch(updateAuth({auth: {notify: notify}}))
    }

    return (
        <Modalize
            ref={notifyRef}
            adjustToContentHeight={true}
        >
            <View style={{ ...styles.modalContent, height: 250 }}>
                <Text style={{ ...styles.profileText, fontSize: 16 }}>Update Your Notification Setting</Text>
                <View style={styles.switchView}>
                    <Text style={{ ...styles.profileText, fontSize: 14 }}>Allow Notification</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#1B64F1" }}
                        thumbColor={notify ? "#f4f3f4" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={(value) => setNotify(value)}
                        value={notify}
                    />
                </View>
                <Pressable onPress={updateUserNotification} style={{ ...styles.registerButton, marginTop: 30 }}><Text style={{ ...styles.buttonText, ...generalStyle.text["dark"] }}>Update</Text></Pressable>
            </View>
        </Modalize>
    )
}

export const ReferModal: React.FC<{referRef: React.RefObject<IHandles> }> = ({referRef}) => {
    const [load, setLoad] = useState(false)
    const [email, setEmail] = useState('')

    const handleRefer = async () => {
        if (!email) {
            return
        }
        setLoad(true)
        const res = await referUser({email: email})
        if (res?.status === 200 || res?.status === 201) {
            Toast.show({
                type: 'success',
                text1: 'Refer invite sent successfully'
            })
            referRef.current?.close()
        } else {
            Toast.show({
                type: 'error',
                text1: res?.data
            })
        }
        setLoad(false)
    }

    return (
        <Modalize
            ref={referRef}
            adjustToContentHeight={true}
        >
            <View style={{...styles.modalContent, height: 300}}>
                <Text style={styles.profileText}>Refer And Earn</Text>
                <Text style={{textAlign: 'center', marginBottom: 15}}>Enter the email of the person you want to refer and earn a reward when they sign up</Text>
                <TextInput placeholder="email" style={styles.registerInput} onChangeText={(text)=> setEmail(text)} />
                <Pressable onPress={handleRefer} style={styles.registerButton}>
                    {
                        load ?
                        <ActivityIndicator color={'white'} /> :
                        <Text style={styles.buttonText}>Refer</Text>
                    }
                </Pressable>
            </View>
        </Modalize>
    )
}

const styles = StyleSheet.create({
    modalContent: {
        padding: 20,
        height: 550,
    },
    profileText: {
        fontSize: 18,
        fontWeight: 600,
        marginTop: 10,
        marginBottom: 20,
        textAlign: "center"
    },
    passwordContainer: {
        width: "100%",
        height: 50,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
        columnGap: 10,
        borderWidth: 1,
        borderRadius: 5,
    },
    passwordInput: {
        width: "90%",
        height: "100%",
        paddingLeft: 10,
        borderWidth: 0
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
    switchView: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: "row",
        marginTop: 8
    }
})