import { View, Text, Pressable, StyleSheet, ActivityIndicator, useColorScheme } from 'react-native'
import React, { useRef, useState } from 'react'
import { AntDesign, FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons'
import { ListingBody } from '@/types/listing'
import { deleteListing, getMyListing, initiateListingPayment } from '@/api/listing'
import Toast from 'react-native-toast-message'
import { openURL } from 'expo-linking'
import { Modalize } from 'react-native-modalize'
import { IHandles } from 'react-native-modalize/lib/options'
import { router } from 'expo-router'
import { Portal } from 'react-native-paper'

const List: React.FC<{ listing: ListingBody, setListing: any }> = ({ listing, setListing }) => {
    const [paymentLoad, setPaymentLoad] = useState(false)
    const [selectedListing, setSelectedListing] = useState<ListingBody>()
    const deleteRef = useRef<Modalize>(null)

    const makePayment = async (id: string) => {
        setPaymentLoad(true)
        const res = await initiateListingPayment(id)
        if (res?.status === 200) {
            setPaymentLoad(false)
            openURL(res?.data?.data)
        } else {
            Toast.show({
                type: 'error',
                text1: res?.data
            })
        }
        setPaymentLoad(false)
    }

    return (
        <>
            <View style={styles.container}>
                <View style={{ ...styles.flexBetw }}>
                    <Text style={{ fontWeight: 600 }}>{listing?.title}</Text>
                    <View style={{ padding: 5, backgroundColor: listing?.isPublished ? "#FCE8E7" : "#DEF7EC" }}>
                        <Text style={{ color: listing?.isPublished ? "#F05152" : "#0B9F6E" }}>{listing?.isPublished ? "Published" : "Draft"}</Text>
                    </View>
                </View>
                <Text style={{ marginVertical: 10 }} numberOfLines={2}>{listing?.description}</Text>
                <View style={{ ...styles.flexBetw }}>
                    <View style={{ ...styles.flexBetw, justifyContent: "center", columnGap: '5' }}>
                        <MaterialIcons name="access-alarms" size={20} color="black" />
                        <Text>{new Date(listing?.deadline)?.toDateString()}</Text>
                    </View>
                    <View style={{ ...styles.flexBetw, width: 150, justifyContent: "center", columnGap: '5' }}>
                        <Ionicons name="location-sharp" size={20} color="black" />
                        <Text>{listing?.address}</Text>
                    </View>
                </View>
                <View style={{ ...styles.flexBetw, marginTop: 20, columnGap: 10 }}>
                    <Pressable onPress={()=> router.push(`/updateListing/${listing?.id}`)} style={{ ...styles.iconButton, borderWidth: 0.5 }}>
                        <FontAwesome5 name="edit" size={18} color="black" />
                    </Pressable>
                    <Pressable onPress={() => { setSelectedListing(listing); deleteRef.current?.open() }} style={{ ...styles.iconButton, backgroundColor: "#FCE8E7" }}>
                        <AntDesign name="delete" size={18} color="#F05152" />
                    </Pressable>
                    <Pressable onPress={() => makePayment(listing?.id!)} style={{ ...styles.iconButton, display: listing?.isPublished ? "none" : "flex", backgroundColor: "#DEF7EC", width: "35%" }}>
                        {
                            paymentLoad ?
                                <ActivityIndicator color={"#0B9F6E"} /> :
                                <Text style={{ color: "#0B9F6E" }}>Make Payment</Text>
                        }
                    </Pressable>
                </View>
            </View>
            <DeleteModal deleteRef={deleteRef} listing={selectedListing!} setListings={setListing} />
        </>
    )
}

export default List

const DeleteModal: React.FC<{ deleteRef: React.RefObject<IHandles | null>, listing: ListingBody, setListings: any }> = ({ deleteRef, listing, setListings }) => {
    const [deleteLoad, setDeleteLoad] = useState(false)

    const handleDeleteListing = async () => {
        setDeleteLoad(true)
        const response = await deleteListing(listing?.id!)
        if (response?.status === 200) {
            const res = await getMyListing()
            if (res?.status === 200) {
                setListings(res?.data || [])
                deleteRef.current?.close()
            }
        } else {
            Toast.show({
                type: 'error',
                text1: response?.data
            })
        }
        setDeleteLoad(false)
    }

    return (
        <Portal>
            <Modalize
                ref={deleteRef}
                adjustToContentHeight={true}
            >
                <View style={styles.modalContent}>
                    <Text style={{ fontSize: 18, fontWeight: 600, textAlign: "center", marginTop: 10 }}>Are You Sure You Want To Delete This Listing</Text>
                    <Text style={{ fontSize: 14, fontWeight: 500, textAlign: "center", marginTop: 10, paddingHorizontal: 20 }}>{listing?.title}</Text>
                    <View style={{ display: "flex", width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", columnGap: 10, marginTop: 20 }}>
                        <Pressable onPress={() => deleteRef.current?.close()} style={{ ...styles.cancelButton }}><Text style={{ fontSize: 16, fontWeight: 500 }}>Cancel</Text></Pressable>
                        <Pressable onPress={handleDeleteListing} style={styles.deleteButton}>
                            {
                                deleteLoad ?
                                    <ActivityIndicator color={"white"} /> :
                                    <Text style={{ fontSize: 16, fontWeight: 500, color: "white" }}>Delete</Text>
                            }
                        </Pressable>
                    </View>
                </View>
            </Modalize>
        </Portal>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        borderWidth: 0.5,
        borderRadius: 5,
        borderColor: "#FAFAFA",
        marginTop: 10,
        backgroundColor: "#F9FCFD",
        boxShadow: '0 1px 2px 0 #0000000d'
    },
    flexBetw: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-between"
    },
    iconButton: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '28%',
        height: 40,
        borderRadius: 4,
        flexGrow: 1
    },
    modalContent: {
        padding: 20,
        height: 230,
    },
    deleteButton: {
        width: "49%",
        height: 52,
        borderRadius: 10,
        backgroundColor: "#F05152",
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