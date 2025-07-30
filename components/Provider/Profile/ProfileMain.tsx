import { View, Text, StyleSheet, useColorScheme, Pressable, ScrollView } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { AntDesign, Feather, FontAwesome, FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { generalStyle } from '@/style/generalStyle'
import { Modalize } from 'react-native-modalize'
import * as Linking from 'expo-linking';
import { AccountModal, NotifyModal, PasswordModal, ReferModal } from './ProfileModal'
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
    const referRef = useRef<Modalize>(null)

    useEffect(() => {
        if (!authUser?.token) {
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
                <Text style={{ fontSize: 18, fontWeight: 600, textAlign: "center" }}>My Profile</Text>
                <View style={{ marginTop: 30 }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{paddingBottom: 50}}>
                            <Pressable onPress={() => accountRef.current?.open()} style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "baseline" }}>
                                <View style={styles.box}>
                                    <View style={{ ...styles.iconView }}>
                                        <MaterialCommunityIcons name="account-outline" size={24} color="black" />
                                    </View>
                                    <Text style={{ fontSize: 18, fontWeight: 600 }}>Account</Text>
                                </View>
                                <AntDesign name="right" size={20} color={"black"} />
                            </Pressable>
                            <Pressable onPress={() => passwordRef.current?.open()} style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "baseline" }}>
                                <View style={styles.box}>
                                    <View style={{ ...styles.iconView }}>
                                        <MaterialCommunityIcons name="form-textbox-password" size={24} color="black" />
                                    </View>
                                    <Text style={{ fontSize: 18, fontWeight: 600 }}>Password</Text>
                                </View>
                                <AntDesign name="right" size={20} color={"black"} />
                            </Pressable>
                            <Pressable onPress={() => openLink('https://handitap.com')} style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "baseline" }}>
                                <View style={styles.box}>
                                    <View style={{ ...styles.iconView }}>
                                        <MaterialIcons name="upgrade" size={24} color="black" />
                                    </View>
                                    <Text style={{ fontSize: 18, fontWeight: 600 }}>Manage account</Text>
                                </View>
                                <AntDesign name="right" size={20} color={"black"} />
                            </Pressable>
                            <Pressable onPress={() => router.push("/leads")} style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "baseline" }}>
                                <View style={styles.box}>
                                    <View style={{ ...styles.iconView }}>
                                        <FontAwesome name="users" size={24} color="black" />
                                    </View>
                                    <Text style={{ fontSize: 18, fontWeight: 600 }}>Leads</Text>
                                </View>
                                <AntDesign name="right" size={20} color={"black"} />
                            </Pressable>
                            <Pressable onPress={() => notifyRef.current?.open()} style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "baseline" }}>
                                <View style={styles.box}>
                                    <View style={{ ...styles.iconView }}>
                                        <Ionicons name="notifications-outline" size={24} color="black" />
                                    </View>
                                    <Text style={{ fontSize: 18, fontWeight: 600 }}>Notification</Text>
                                </View>
                                <AntDesign name="right" size={20} color={"black"} />
                            </Pressable>
                            <Pressable onPress={() => referRef.current?.open()} style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "baseline" }}>
                                <View style={styles.box}>
                                    <View style={{ ...styles.iconView }}>
                                        <FontAwesome5 name="coins" size={20} color="black" />
                                    </View>
                                    <Text style={{ fontSize: 16, fontWeight: 600 }}>Refer & Earn</Text>
                                </View>
                                <AntDesign name="right" size={20} color={colorScheme === "light" ? "black" : "white"} />
                            </Pressable>
                            <Pressable onPress={() => openLink("mailto:support@audtiklance.com")} style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "baseline" }}>
                                <View style={styles.box}>
                                    <View style={{ ...styles.iconView }}>
                                        <Ionicons name="help-circle-outline" size={24} color="black" />
                                    </View>
                                    <Text style={{ fontSize: 18, fontWeight: 600 }}>Help</Text>
                                </View>
                                <AntDesign name="right" size={20} color={"black"} />
                            </Pressable>
                            <Pressable onPress={() => deleteRef.current?.open()} style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "baseline" }}>
                                <View style={styles.box}>
                                    <View style={{ ...styles.iconView, backgroundColor: "red" }}>
                                        <AntDesign name="delete" size={24} color="white" />
                                    </View>
                                    <Text style={{ fontSize: 18, fontWeight: 600 }}>Delete Account</Text>
                                </View>
                                <AntDesign name="right" size={20} color={"black"} />
                            </Pressable>
                            <Pressable onPress={() => logOutUser()} style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", alignItems: "baseline" }}>
                                <View style={styles.box}>
                                    <View style={{ ...styles.iconView }}>
                                        <MaterialIcons name="logout" size={24} color="black" />
                                    </View>
                                    <Text style={{ fontSize: 18, fontWeight: 600 }}>Logout</Text>
                                </View>
                                <AntDesign name="right" size={20} color={"black"} />
                            </Pressable>
                        </View>
                    </ScrollView>
                </View>
            </View>
            <AccountModal accountRef={accountRef} />
            <PasswordModal passwordRef={passwordRef} />
            <NotifyModal notifyRef={notifyRef} />
            <Plan planRef={planRef} />
            <DeleteModal deleteRef={deleteRef} />
            <ReferModal referRef={referRef} />
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