import { View, Text, StyleSheet, useColorScheme, Pressable } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { AntDesign, Feather, FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { generalStyle } from '@/style/generalStyle'
import { Modalize } from 'react-native-modalize'
import * as Linking from 'expo-linking';
import { AccountModal, NotifyModal, PasswordModal } from './ProfileModal'
import { openLink } from '@/utils/helper'
import { useDispatch, useSelector } from 'react-redux'
import { resetAuth } from '../../Context/authProvider'
import { router } from 'expo-router'
import { RootState } from '../../Store/store'
import Plan from './Plan'
import DeleteModal from '@/components/Profile/DeleteModal'

const ProfileMain = () => {
    const authUser = useSelector((state: RootState) => state.authProvider.auth)
    const colorScheme = useColorScheme() || "light"
    const dispatch = useDispatch()
    const accountRef = useRef<Modalize>(null)
    const passwordRef = useRef<Modalize>(null)
    const notifyRef = useRef<Modalize>(null)
    const planRef = useRef<Modalize>(null)
    const deleteRef = useRef<Modalize>(null)

    useEffect(() => {
        if (!authUser?.access) {
            logOutUser()
        }

        const handleDeepLink = (event: any) => {
            const { url } = event;
            console.log('Redirected to:', url);
            // You can perform logic based on the deep link here
        };

        Linking.addEventListener('url', handleDeepLink);

    }, [])

    const logOutUser = () => {
        dispatch(resetAuth())
        router.push("/login")
    }

    Linking.addEventListener('url', (event) => {
        const { url } = event;
        console.log('Redirected to:', url);
        // Handle the URL logic
    });

    return (
        <>
            <View style={styles.container}>
                <Text style={{ fontSize: 18, fontWeight: 600, textAlign: "center", ...generalStyle.text[colorScheme] }}>My Profile</Text>
                <View style={{ marginTop: 30 }}>
                    <Pressable onPress={() => accountRef.current?.open()} style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "baseline" }}>
                        <View style={styles.box}>
                            <View style={{ ...styles.iconView, ...(colorScheme === "dark" && generalStyle.background.light) }}>
                                <MaterialCommunityIcons name="account-outline" size={24} color="black" />
                            </View>
                            <Text style={{ fontSize: 18, fontWeight: 600, ...generalStyle.text[colorScheme] }}>Account</Text>
                        </View>
                        <AntDesign name="right" size={20} color={colorScheme === "light" ? "black" : "white"} />
                    </Pressable>
                    <Pressable onPress={() => passwordRef.current?.open()} style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "baseline" }}>
                        <View style={styles.box}>
                            <View style={{ ...styles.iconView, ...(colorScheme === "dark" && generalStyle.background.light) }}>
                                <MaterialCommunityIcons name="form-textbox-password" size={24} color="black" />
                            </View>
                            <Text style={{ fontSize: 18, fontWeight: 600, ...generalStyle.text[colorScheme] }}>Password</Text>
                        </View>
                        <AntDesign name="right" size={20} color={colorScheme === "light" ? "black" : "white"} />
                    </Pressable>
                    <Pressable onPress={() => planRef.current?.open()} style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "baseline" }}>
                        <View style={styles.box}>
                            <View style={{ ...styles.iconView, ...(colorScheme === "dark" && generalStyle.background.light) }}>
                                <MaterialIcons name="upgrade" size={24} color="black" />
                            </View>
                            <Text style={{ fontSize: 18, fontWeight: 600, ...generalStyle.text[colorScheme] }}>Upgrade Plan</Text>
                        </View>
                        <AntDesign name="right" size={20} color={colorScheme === "light" ? "black" : "white"} />
                    </Pressable>
                    <Pressable onPress={() => router.push("/providerHistory")} style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "baseline" }}>
                        <View style={styles.box}>
                            <View style={{ ...styles.iconView, ...(colorScheme === "dark" && generalStyle.background.light) }}>
                                <MaterialCommunityIcons name="history" size={24} color="black" />
                            </View>
                            <Text style={{ fontSize: 18, fontWeight: 600, ...generalStyle.text[colorScheme] }}>History</Text>
                        </View>
                        <AntDesign name="right" size={20} color={colorScheme === "light" ? "black" : "white"} />
                    </Pressable>
                    <Pressable onPress={() => router.push("/leads")} style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "baseline" }}>
                        <View style={styles.box}>
                            <View style={{ ...styles.iconView, ...(colorScheme === "dark" && generalStyle.background.light) }}>
                                <FontAwesome name="users" size={24} color="black" />
                            </View>
                            <Text style={{ fontSize: 18, fontWeight: 600, ...generalStyle.text[colorScheme] }}>Leads</Text>
                        </View>
                        <AntDesign name="right" size={20} color={colorScheme === "light" ? "black" : "white"} />
                    </Pressable>
                    <Pressable onPress={() => notifyRef.current?.open()} style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "baseline" }}>
                        <View style={styles.box}>
                            <View style={{ ...styles.iconView, ...(colorScheme === "dark" && generalStyle.background.light) }}>
                                <Ionicons name="notifications-outline" size={24} color="black" />
                            </View>
                            <Text style={{ fontSize: 18, fontWeight: 600, ...generalStyle.text[colorScheme] }}>Notification</Text>
                        </View>
                        <AntDesign name="right" size={20} color={colorScheme === "light" ? "black" : "white"} />
                    </Pressable>
                    <Pressable onPress={() => openLink("mailto:support@audtiklance.com")} style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "baseline" }}>
                        <View style={styles.box}>
                            <View style={{ ...styles.iconView, ...(colorScheme === "dark" && generalStyle.background.light) }}>
                                <Ionicons name="help-circle-outline" size={24} color="black" />
                            </View>
                            <Text style={{ fontSize: 18, fontWeight: 600, ...generalStyle.text[colorScheme] }}>Help</Text>
                        </View>
                        <AntDesign name="right" size={20} color={colorScheme === "light" ? "black" : "white"} />
                    </Pressable>
                    <Pressable onPress={() => logOutUser()} style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "baseline" }}>
                        <View style={styles.box}>
                            <View style={{ ...styles.iconView, backgroundColor: "red" }}>
                            <AntDesign name="delete" size={24} color="white" />
                            </View>
                            <Text style={{ fontSize: 18, fontWeight: 600, ...generalStyle.text[colorScheme] }}>Delete Account</Text>
                        </View>
                        <AntDesign name="right" size={20} color={colorScheme === "light" ? "black" : "white"} />
                    </Pressable>
                    <Pressable onPress={() => logOutUser()} style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "baseline" }}>
                        <View style={styles.box}>
                            <View style={{ ...styles.iconView, ...(colorScheme === "dark" && generalStyle.background.light) }}>
                                <MaterialIcons name="logout" size={24} color="black" />
                            </View>
                            <Text style={{ fontSize: 18, fontWeight: 600, ...generalStyle.text[colorScheme] }}>Logout</Text>
                        </View>
                        <AntDesign name="right" size={20} color={colorScheme === "light" ? "black" : "white"} />
                    </Pressable>
                </View>
            </View>
            <AccountModal accountRef={accountRef} />
            <PasswordModal passwordRef={passwordRef} />
            <NotifyModal notifyRef={notifyRef} />
            <Plan planRef={planRef} />
            <DeleteModal deleteRef={deleteRef} />
        </>
    )
}

export default ProfileMain

const styles = StyleSheet.create({
    container: {
        padding: 15,
        paddingTop: 80,
    },
    box: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        columnGap: 10,
        marginTop: 20
    },
    iconView: {
        width: 50,
        height: 50,
        borderRadius: 50,
        backgroundColor: "#00000030",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    }
})