import { View, Text, useColorScheme, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { Modalize } from 'react-native-modalize'
import { IHandles } from 'react-native-modalize/lib/options'
import { generalStyle } from '@/style/generalStyle'
import { deleteAccount } from '@/api/auth'
import { router } from 'expo-router'
import { resetAuth } from '../Context/authProvider'
import { useDispatch } from 'react-redux'
import Toast from 'react-native-toast-message'

const DeleteModal: React.FC<{ deleteRef: React.RefObject<IHandles> }> = ({ deleteRef }) => {
    const colorScheme = useColorScheme() || "light"
    const dispatch = useDispatch()

    const logOutUser = () => {
        dispatch(resetAuth())
        router.push("/login")
    }

    const deleteUser = async () => {
        const res = await deleteAccount()
        if (res?.status === 204 || res?.status === 200) {
            logOutUser()
        } else {
            Toast.show({
                type: "error",
                text1: res?.data
            })
        }
    }

    return (
        <Modalize
            ref={deleteRef}
            adjustToContentHeight={true}
        >
            <View style={styles.modalContent}>
                <Text style={{fontSize: 18, fontWeight: 600, textAlign: "center", marginTop: 10}}>Are You Sure You Want To Delete Your Account</Text>
                <Text style={{fontSize: 14, fontWeight: 500, textAlign: "center", marginTop: 10, paddingHorizontal: 20}}>All Your Account Information Will Be Gone Permanently, This Action Is Irreversible</Text>
                <View style={{display: "flex", width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", columnGap: 10, marginTop: 20}}>
                    <Pressable onPress={()=> deleteRef.current?.close()} style={{...styles.cancelButton}}><Text style={{fontSize: 16, fontWeight: 500 }}>Cancel</Text></Pressable>
                    <Pressable onPress={deleteUser} style={styles.deleteButton}><Text style={{fontSize: 16, fontWeight: 500, color: "white"}}>Delete</Text></Pressable>
                </View>
            </View>
        </Modalize>
    )
}

export default DeleteModal

const styles = StyleSheet.create({
    modalContent: {
        padding: 20,
        height: 240,
    },
    deleteButton: {
        width: "49%",
        height: 52,
        borderRadius: 10,
        backgroundColor: "red",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    cancelButton: {
        width: "49%",
        height: 52,
        borderRadius: 10,
        backgroundColor: "white",
        borderWidth: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
})