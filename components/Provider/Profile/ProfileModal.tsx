import { updatePassword, updateUser } from "@/api/auth"
import { generalStyle } from "@/style/generalStyle"
import { RegisterUserInfo } from "@/types/auth"
import { FontAwesome6 } from "@expo/vector-icons"
import { useEffect, useState } from "react"
import { ActivityIndicator, Pressable, StyleSheet, Switch, Text, TextInput, useColorScheme, View } from "react-native"
import { Modalize } from "react-native-modalize"
import { IHandles } from "react-native-modalize/lib/options"
import { RootState } from "../../Store/store"
import { useDispatch, useSelector } from "react-redux"
import Toast from "react-native-toast-message"
import { updateAuth } from "../../Context/authProvider"

export const AccountModal: React.FC<{ accountRef: React.RefObject<IHandles> }> = ({ accountRef }) => {
    const authUser = useSelector((state: RootState) => state.authProvider.auth)
    const colorScheme = useColorScheme() || "light"
    const [userInfo, setUserInfo] = useState<Pick<RegisterUserInfo, "firstname" | "lastname" | "phone" | "gender" | "dob" | "about_me">>()
    const [load, setLoad] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        setUserInfo({
            firstname: authUser?.firstname!,
            lastname: authUser?.lastname!,
            phone: authUser?.phone!,
            gender: authUser?.gender,
            dob: authUser?.dob,
            about_me: authUser?.about_me
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
            const response = await updateUser({ ...userInfo, country_code: "1" })
            console.log(response);
            
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

    return (
        <Modalize
            ref={accountRef}
            adjustToContentHeight={true}
            modalStyle={generalStyle.modalBackground[colorScheme]}
        >
            <View style={styles.modalContent}>
                <Text style={{ ...styles.profileText, ...generalStyle.text[colorScheme] }}>Update Your Account Details</Text>
                <TextInput placeholderTextColor={generalStyle.text[colorScheme].color} onChangeText={(text) => handleInput("firstname", text)} value={userInfo?.firstname} style={{ ...styles.registerInput, ...generalStyle.border[colorScheme], ...generalStyle.text[colorScheme] }} placeholder='First Name' />
                <TextInput placeholderTextColor={generalStyle.text[colorScheme].color} onChangeText={(text) => handleInput("lastname", text)} value={userInfo?.lastname} style={{ ...styles.registerInput, ...generalStyle.border[colorScheme], ...generalStyle.text[colorScheme] }} placeholder='Last Name' />

                <TextInput placeholderTextColor={generalStyle.text[colorScheme].color} onChangeText={(text) => handleInput("phone", text)} value={userInfo?.phone} keyboardType='phone-pad' style={{ ...styles.registerInput, ...generalStyle.border[colorScheme], ...generalStyle.text[colorScheme] }} placeholder='Phone Number' />
                <TextInput placeholderTextColor={generalStyle.text[colorScheme].color} onChangeText={(text) => handleInput("gender", text.toUpperCase())} value={userInfo?.gender} style={{ ...styles.registerInput, ...generalStyle.border[colorScheme], ...generalStyle.text[colorScheme] }} placeholder='Gender' />
                <TextInput placeholderTextColor={generalStyle.text[colorScheme].color} onChangeText={(text) => handleInput("dob", text)} value={userInfo?.dob} style={{ ...styles.registerInput, ...generalStyle.border[colorScheme], ...generalStyle.text[colorScheme] }} keyboardType="numeric" placeholder='Enter date (YYYY-MM-DD)' />
                <TextInput numberOfLines={5} multiline placeholderTextColor={generalStyle.text[colorScheme].color} onChangeText={(text) => handleInput("about_me", text)} value={userInfo?.about_me} style={{ ...styles.registerInput, ...generalStyle.border[colorScheme], ...generalStyle.text[colorScheme], height: 140 }} placeholder='About Me' />
                <Pressable onPress={updateUserDetails} style={{ ...styles.registerButton, marginTop: 10, ...(colorScheme === "light" && generalStyle.button.active), ...(colorScheme === "dark" && generalStyle.button.dark) }}>
                    {
                        load ?
                            <ActivityIndicator /> :
                            <Text style={{ ...styles.buttonText, ...generalStyle.text["dark"] }}>Update</Text>
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
            modalStyle={generalStyle.modalBackground[colorScheme]}
        >
            <View style={{ ...styles.modalContent, height: 400 }}>
                <Text style={{ ...styles.profileText, ...generalStyle.text[colorScheme] }}>Update Your Password</Text>
                <View style={{ ...styles.passwordContainer, ...generalStyle.border[colorScheme] }}>
                    <TextInput placeholderTextColor={generalStyle.text[colorScheme].color} secureTextEntry={showPass} onChangeText={(text) => handleInput("old_password", text)} value={userInfo?.old_password} style={{ ...styles.passwordInput, ...generalStyle.text[colorScheme] }} placeholder='Current Password' />
                    <Pressable onPress={() => setShowPass(!showPass)}>
                        <FontAwesome6 name={showPass ? "eye" : "eye-slash"} size={15} color="black" />
                    </Pressable>
                </View>
                <View style={{ ...styles.passwordContainer, ...generalStyle.border[colorScheme] }}>
                    <TextInput placeholderTextColor={generalStyle.text[colorScheme].color} secureTextEntry={showPass} onChangeText={(text) => handleInput("new_password", text)} value={userInfo?.new_password} style={{ ...styles.passwordInput, ...generalStyle.text[colorScheme] }} placeholder='New Password' />
                    <Pressable onPress={() => setShowPass(!showPass)}>
                        <FontAwesome6 name={showPass ? "eye" : "eye-slash"} size={15} color="black" />
                    </Pressable>
                </View>
                <Pressable onPress={updateUserPassword} style={{ ...styles.registerButton, marginTop: 10, ...(colorScheme === "light" && generalStyle.button.active), ...(colorScheme === "dark" && generalStyle.button.dark) }}>
                    {
                        load ?
                        <ActivityIndicator /> :
                        <Text style={{ ...styles.buttonText, ...generalStyle.text["dark"] }}>Update</Text>
                    }
                </Pressable>
            </View>
        </Modalize>
    )
}

export const NotifyModal: React.FC<{ notifyRef: React.RefObject<IHandles> }> = ({ notifyRef }) => {
    const colorScheme = useColorScheme() || "light"
    const [notify, setNotify] = useState({ email: false, app: true })

    const updateNotification = () => {

    }

    return (
        <Modalize
            ref={notifyRef}
            adjustToContentHeight={true}
            modalStyle={generalStyle.modalBackground[colorScheme]}
        >
            <View style={{ ...styles.modalContent, height: 380 }}>
                <Text style={{ ...styles.profileText, ...generalStyle.text[colorScheme] }}>Update Your Notification Setting</Text>
                <View style={styles.switchView}>
                    <Text style={{ ...styles.profileText, ...generalStyle.text[colorScheme] }}>Email Notification</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#1B64F1" }}
                        thumbColor={notify?.email ? "#f4f3f4" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => setNotify({ ...notify, email: !notify.email })}
                        value={notify?.email}
                    />
                </View>
                <View style={styles.switchView}>
                    <Text style={{ ...styles.profileText, ...generalStyle.text[colorScheme] }}>App Notification</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#1B64F1" }}
                        thumbColor={notify?.app ? "#f4f3f4" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => setNotify({ ...notify, app: !notify.app })}
                        value={notify?.app}
                    />
                </View>
                <Pressable onPress={updateNotification} style={{ ...styles.registerButton, marginTop: 30, ...(colorScheme === "light" && generalStyle.button.active), ...(colorScheme === "dark" && generalStyle.button.dark) }}><Text style={{ ...styles.buttonText, ...generalStyle.text["dark"] }}>Update</Text></Pressable>
            </View>
        </Modalize>
    )
}

const styles = StyleSheet.create({
    modalContent: {
        padding: 20,
        height: 750,
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
    switchView: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: "row",
        marginTop: 8
    }
})