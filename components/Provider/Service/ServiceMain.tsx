import { View, Text, StyleSheet, useColorScheme, Image, ScrollView, Pressable, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { generalStyle } from '@/style/generalStyle'
import { RootState } from '@/components/Store/store'
import { useDispatch, useSelector } from 'react-redux'
import * as ImagePicker from 'expo-image-picker';
import { AntDesign, Entypo, Feather, Ionicons, MaterialIcons } from '@expo/vector-icons'
import { formatCurrency } from '@/utils/helper'
import { Modalize } from 'react-native-modalize'
import { AddServiceModal, DeleteModal, ModifyPriceModal, UpdateDetailModal } from './ServiceModal'
import { updateAuth } from '@/components/Context/authProvider'
import { Service, SubCategory } from '@/types/service'
import { getCategory, updateServiceImage, updateServiceProfile } from '@/api/service'

const ServiceMain = () => {
    const authUser = useSelector((state: RootState) => state.authProvider.auth)
    console.log(authUser?.images);
    
    const colorScheme = useColorScheme() || "light"
    const [showAddModal, setShowAddModal] = useState(false)
    const [showUpdateModal, setShowUpdateModal] = useState(false)
    const [activeService, setActiveService] = useState<Service>()
    const priceRef = useRef<Modalize>(null)
    const deleteRef = useRef<Modalize>(null)
    const dispatch = useDispatch()

    const handleImageSelect = async (type: string, num?: number) => {
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
            if (type === "profile_picture") {
                let localUri = result.assets[0].uri!;
                let filename = localUri.split('/').pop();
              
                let match = /\.(\w+)$/.exec(filename!);
                let type = match ? `image/${match[1]}` : `image`;
              
                let formData = new FormData();
                
                // @ts-ignore
                formData.append('profile_picture', { uri: localUri, name: filename, type });
                const response = await updateServiceImage(formData)
                console.log(response);
                
                if (response?.status === 200) {
                    dispatch(updateAuth({ auth: response?.data?.data }))
                }
            } else {
                const arr = authUser?.images ? [...authUser?.images] : []
                arr[num || 0] = { image_url: result.assets[0].uri! }

                let formData = new FormData();

                arr?.slice(0,2)?.forEach((image, i)=> {
                    let filename = image?.image_url?.split('/').pop();
              
                    let match = /\.(\w+)$/.exec(filename!);
                    let type = match ? `image/${match[1]}` : `image`;
                    // @ts-ignore
                    formData.append(`images${i}`, { uri: image?.image_url, name: filename, type });
                    
                })

                const response = await updateServiceImage(formData)
                console.log(response);

                if (response?.status === 200) {
                    dispatch(updateAuth({ auth: response?.data?.data }))
                }
            }
        }
    }

    const editService = (service: SubCategory) => {
        setActiveService({
            id: service?.sub_category_id,
            name: service?.sub_category,
            price: Number(service?.cost)
        })
        priceRef.current?.open()
    }

    const deleteService = (service: SubCategory) => {
        setActiveService({
            id: service?.sub_category_id,
            name: service?.sub_category,
            price: Number(service?.cost)
        })
        deleteRef.current?.open()
    }

    return (
        <>
            <View style={styles.container}>
                <Text style={{ fontSize: 18, fontWeight: 600, textAlign: "center", ...generalStyle.text[colorScheme] }}>My Business</Text>
                <View style={styles.box}>
                    <View style={{ ...styles.iconView, ...(colorScheme === "dark" && generalStyle.background.light) }}>
                        <MaterialIcons name="home-repair-service" size={24} color={"black"} />
                    </View>
                    <Text style={{ fontSize: 24, fontWeight: 600, ...generalStyle.text[colorScheme] }}>{authUser?.business_name}</Text>
                    <Feather onPress={() => setShowUpdateModal(true)} style={{ marginTop: 5 }} name="edit" size={18} color="black" />
                </View>
                <View style={styles.box}>
                    <View style={{ ...styles.iconView, ...(colorScheme === "dark" && generalStyle.background.light) }}>
                        <Ionicons name="location-sharp" size={24} color="black" />
                    </View>
                    <Text style={{ fontSize: 16, fontWeight: 600, ...generalStyle.text[colorScheme], maxWidth: "75%" }}>Based in {authUser?.address}</Text>
                    <Feather onPress={() => setShowUpdateModal(true)} style={{ marginTop: 5 }} name="edit" size={18} color="black" />
                </View>
                <View>
                    <ScrollView contentContainerStyle={{ height: "102%" }} showsVerticalScrollIndicator={false}>
                        <View style={{ position: "relative" }}>
                            <Image style={{ width: "100%", height: 170, marginTop: 20, borderRadius: 10 }} source={{ uri: authUser?.profile_picture as unknown as string }} />
                            <Pressable onPress={() => handleImageSelect("profile_picture")} style={{ position: "absolute", top: 30, right: 10, ...styles.iconView, width: 35, height: 35, ...(colorScheme === "dark" && generalStyle.background.light) }}>
                                <Feather name="edit" size={18} color="white" />
                            </Pressable>
                        </View>
                        <View style={{ marginTop: 15 }}>
                            <Text style={{ fontSize: 18, fontWeight: 600, ...generalStyle.text[colorScheme] }}>Previous Work Images</Text>
                            <View style={{ display: "flex", flexDirection: "row", columnGap: 10, marginTop: 10, alignItems: "flex-end" }}>
                                {
                                    authUser?.images?.map((image, i) => (
                                        <View key={i} style={{ position: "relative", width: "48%" }}>
                                            <Image style={{ width: "100%", height: 170, borderRadius: 10 }} source={{ uri: image?.image_url }} />
                                            <Pressable onPress={() => handleImageSelect("images", i)} style={{ position: "absolute", top: 10, right: 10, ...styles.iconView, width: 35, height: 35, ...(colorScheme === "dark" && generalStyle.background.light) }}>
                                                <Feather name="edit" size={18} color="white" />
                                            </Pressable>
                                        </View>
                                    ))
                                }
                                {
                                    authUser?.images?.length! < 2 &&
                                    <Pressable onPress={() => handleImageSelect("images", authUser?.images?.length!)} style={{ width: "48%", height: 170, borderWidth: 0.6, display: "flex", borderRadius: 10, justifyContent: "center", alignItems: "center" }}>
                                        <Entypo name="upload-to-cloud" size={50} color="black" />
                                    </Pressable>
                                }
                            </View>
                        </View>
                        <View style={{ marginTop: 20 }}>
                            <View style={{ ...styles.serviceContainer }}>
                                <Text style={{ fontSize: 18, fontWeight: 600, ...generalStyle.text[colorScheme] }}>My Services</Text>
                                <Pressable onPress={() => setShowAddModal(true)} style={styles.addButton}><Text style={{ color: "white" }}>Add Service</Text></Pressable>
                            </View>
                            <View style={{ marginTop: 10 }}>
                                {
                                    authUser?.sub_category?.map((serv) => (
                                        <View key={serv?.id} style={{ ...styles.serviceContainer, marginTop: 15, paddingTop: 15, borderTopWidth: 0.6 }}>
                                            <View>
                                                <Text style={{ fontSize: 18, fontWeight: 600, ...generalStyle.text[colorScheme] }}>{serv?.sub_category}</Text>
                                                <Text style={{ fontSize: 16, fontWeight: 500, ...generalStyle.text[colorScheme], marginTop: 3 }}>{formatCurrency("en-US", "USD", Number(serv?.cost))} - {serv?.time_frame}</Text>
                                            </View>
                                            <View style={{ display: "flex", flexDirection: "row", columnGap: 10, alignItems: "center" }}>
                                                <Feather onPress={() => editService(serv)} name="edit" size={24} color="black" />
                                                <AntDesign onPress={() => deleteService(serv)} name="delete" size={24} color="red" />
                                            </View>
                                        </View>
                                    ))
                                }
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
            <UpdateDetailModal showUpdateModal={showUpdateModal} setShowUpdateModal={setShowUpdateModal} />
            <AddServiceModal priceRef={priceRef} setActiveService={setActiveService} showAddModal={showAddModal} setShowAddModal={setShowAddModal} />
            <ModifyPriceModal priceRef={priceRef} activeService={activeService!} setActiveService={setActiveService} />
            <DeleteModal deleteRef={deleteRef} activeService={activeService!} />
        </>
    )
}

export default ServiceMain

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
    },
    serviceContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    addButton: {
        width: 100,
        height: 40,
        borderRadius: 6,
        backgroundColor: "#1B64F1",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }
})