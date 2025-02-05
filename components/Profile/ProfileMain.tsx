import { View, Text, StyleSheet, useColorScheme, Pressable, ScrollView } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { AntDesign, Feather, Fontisto, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { generalStyle } from '@/style/generalStyle'
import { Modalize } from 'react-native-modalize'
import { AccountModal, NotifyModal, PasswordModal } from './ProfileModal'
import { openLink } from '@/utils/helper'
import { useDispatch, useSelector } from 'react-redux'
import { resetAuth } from '../Context/authProvider'
import { router } from 'expo-router'
import { RootState } from '../Store/store'
import DeleteModal from './DeleteModal'

const ProfileMain = () => {
    const authUser = useSelector((state: RootState) => state.authProvider.auth)
    const colorScheme = useColorScheme() || "light"
    const dispatch = useDispatch()
    const accountRef = useRef<Modalize>(null)
    const passwordRef = useRef<Modalize>(null)
    const notifyRef = useRef<Modalize>(null)
    const deleteRef = useRef<Modalize>(null)

    useEffect(() => {
        if (!authUser?.access) {
            logOutUser()
        }
    }, [])

    const logOutUser = () => {
        dispatch(resetAuth())
        router.push("/login")
    }

    return (
        <>
            <View style={styles.container}>
                <Text style={{ fontSize: 18, fontWeight: 600, textAlign: "center" }}>My Profile</Text>
                <View style={{ marginTop: 30 }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ paddingBottom: 130 }}>
                            <Pressable onPress={() => accountRef.current?.open()} style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "baseline" }}>
                                <View style={styles.box}>
                                    <View style={{ ...styles.iconView }}>
                                        <MaterialCommunityIcons name="account-outline" size={20} color="black" />
                                    </View>
                                    <Text style={{ fontSize: 16, fontWeight: 600 }}>Account</Text>
                                </View>
                                <AntDesign name="right" size={20} color={colorScheme === "light" ? "black" : "white"} />
                            </Pressable>
                            <Pressable onPress={() => passwordRef.current?.open()} style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "baseline" }}>
                                <View style={styles.box}>
                                    <View style={{ ...styles.iconView }}>
                                        <MaterialCommunityIcons name="form-textbox-password" size={20} color="black" />
                                    </View>
                                    <Text style={{ fontSize: 16, fontWeight: 600 }}>Password</Text>
                                </View>
                                <AntDesign name="right" size={20} color={colorScheme === "light" ? "black" : "white"} />
                            </Pressable>
                            <Pressable onPress={() => router.push("/history")} style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "baseline" }}>
                                <View style={styles.box}>
                                    <View style={{ ...styles.iconView }}>
                                        <MaterialCommunityIcons name="history" size={20} color="black" />
                                    </View>
                                    <Text style={{ fontSize: 16, fontWeight: 600 }}>History</Text>
                                </View>
                                <AntDesign name="right" size={20} color={colorScheme === "light" ? "black" : "white"} />
                            </Pressable>
                            <Pressable onPress={() => router.push("/favorite")} style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "baseline" }}>
                                <View style={styles.box}>
                                    <View style={{ ...styles.iconView }}>
                                        <Fontisto name="favorite" size={24} color="black" />
                                    </View>
                                    <Text style={{ fontSize: 16, fontWeight: 600 }}>Favorite</Text>
                                </View>
                                <AntDesign name="right" size={20} color={colorScheme === "light" ? "black" : "white"} />
                            </Pressable>
                            <Pressable onPress={() => router.push("/listing")} style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "baseline" }}>
                                <View style={styles.box}>
                                    <View style={{ ...styles.iconView }}>
                                        <Feather name="list" size={24} color="black" />
                                    </View>
                                    <Text style={{ fontSize: 16, fontWeight: 600 }}>Listings</Text>
                                </View>
                                <AntDesign name="right" size={20} color={colorScheme === "light" ? "black" : "white"} />
                            </Pressable>
                            <Pressable onPress={() => notifyRef.current?.open()} style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "baseline" }}>
                                <View style={styles.box}>
                                    <View style={{ ...styles.iconView }}>
                                        <Ionicons name="notifications-outline" size={20} color="black" />
                                    </View>
                                    <Text style={{ fontSize: 16, fontWeight: 600 }}>Notification</Text>
                                </View>
                                <AntDesign name="right" size={20} color={colorScheme === "light" ? "black" : "white"} />
                            </Pressable>
                            <Pressable onPress={() => openLink("mailto:support@audtiklance.com")} style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "baseline" }}>
                                <View style={styles.box}>
                                    <View style={{ ...styles.iconView }}>
                                        <Ionicons name="help-circle-outline" size={20} color="black" />
                                    </View>
                                    <Text style={{ fontSize: 16, fontWeight: 600 }}>Help</Text>
                                </View>
                                <AntDesign name="right" size={20} color={colorScheme === "light" ? "black" : "white"} />
                            </Pressable>
                            <Pressable onPress={() => openLink("https://app.audtiklance.com/terms")} style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "baseline" }}>
                                <View style={styles.box}>
                                    <View style={{ ...styles.iconView }}>
                                        <Feather name="file-text" size={20} color="black" />
                                    </View>
                                    <Text style={{ fontSize: 16, fontWeight: 600 }}>Terms & Condition</Text>
                                </View>
                                <AntDesign name="right" size={20} color={colorScheme === "light" ? "black" : "white"} />
                            </Pressable>
                            <Pressable onPress={() => router.push("/providerRegister1")} style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "baseline" }}>
                                <View style={styles.box}>
                                    <View style={{ ...styles.iconView }}>
                                        <MaterialIcons name="home-repair-service" size={20} color="black" />
                                    </View>
                                    <Text style={{ fontSize: 16, fontWeight: 600 }}>Become a provider</Text>
                                </View>
                                <AntDesign name="right" size={20} color={colorScheme === "light" ? "black" : "white"} />
                            </Pressable>
                            <Pressable onPress={() => deleteRef.current?.open()} style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "baseline" }}>
                                <View style={styles.box}>
                                    <View style={{ ...styles.iconView, backgroundColor: "red" }}>
                                        <AntDesign name="delete" size={20} color="white" />
                                    </View>
                                    <Text style={{ fontSize: 16, fontWeight: 600 }}>Delete Account</Text>
                                </View>
                                <AntDesign name="right" size={20} color={colorScheme === "light" ? "black" : "white"} />
                            </Pressable>
                            <Pressable onPress={() => logOutUser()} style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "baseline" }}>
                                <View style={styles.box}>
                                    <View style={{ ...styles.iconView }}>
                                        <MaterialIcons name="logout" size={20} color="black" />
                                    </View>
                                    <Text style={{ fontSize: 16, fontWeight: 600 }}>Logout</Text>
                                </View>
                                <AntDesign name="right" size={20} color={colorScheme === "light" ? "black" : "white"} />
                            </Pressable>
                        </View>
                    </ScrollView>
                </View>
            </View>
            <AccountModal accountRef={accountRef} />
            <PasswordModal passwordRef={passwordRef} />
            <NotifyModal notifyRef={notifyRef} />
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
        width: 42,
        height: 42,
        borderRadius: 50,
        backgroundColor: "#00000030",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    }
})