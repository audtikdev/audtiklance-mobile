import { View, Text, StyleSheet, TextInput, useColorScheme, Pressable, ImageBackground, Alert, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as ImagePicker from 'expo-image-picker';
import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons'
import { generalStyle } from '@/style/generalStyle'
import { router } from 'expo-router';
import { CategoryType } from '@/types/service';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ListingBody } from '@/types/listing';
import Toast from 'react-native-toast-message';
import { createListing, getAListing, updateListing } from '@/api/listing';
import { openURL } from 'expo-linking';
import { SelectCategory, SelectLocation } from '../CreateListing/ListingModal';

export type ListingLocation = {
    longitude: string,
    latitude: string,
    address: string
}

const UpdateListing: React.FC<{ id: string }> = ({ id }) => {
    const colorScheme = useColorScheme() || "light"
    const [image, setImage] = useState("")
    const [showCatModal, setShowCatModal] = useState(false)
    const [showLocModal, setShowLocModal] = useState(false)
    const [selectedCat, setSelectedCat] = useState<CategoryType>()
    const [selectedLoc, setSelectedLoc] = useState<ListingLocation>()
    const [showDate, setShowDate] = useState(Platform.OS !== 'android')
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [load, setLoad] = useState(false)
    const [jobList, setJobList] = useState<Partial<ListingBody>>()

    useEffect(() => {
        (async () => {
            const res = await getAListing(id)
            if (res?.status === 200) {
                setJobList({
                    title: res?.data?.title,
                    budget: res?.data?.budget,
                    description: res?.data?.description
                })
                setSelectedCat(res?.data?.category)
                setSelectedLoc({
                    address: res?.data?.address,
                    latitude: res?.data?.location?.coordinates?.[1],
                    longitude: res?.data?.location?.coordinates?.[0]
                })
                setImage(res?.data?.images?.[0])
                setDate(new Date(res?.data?.deadline))
            } else {
                Toast.show({
                    type: 'error',
                    text1: res?.data
                })
            }
        })()
    }, [])

    const onChange = (event: any, selectedDate: Date | undefined) => {
        if (Platform.OS === 'android') {
            setShowDate(false);
        }
        const currentDate = selectedDate || date;
        setDate(currentDate);
    };

    const handleInput = (type: string, value: string) => {
        setJobList((prevUserInfo) => ({
            ...prevUserInfo!,
            [type!]: value!,
        }));
    }

    const handleImageSelect = async () => {
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
            setImage(result.assets[0].uri)
        }
    }

    const handleSubmit = async () => {
        if (!image || !selectedCat?.name || !selectedLoc?.address) {
            Toast.show({
                type: "info",
                text1: "All Field Are Required"
            })
            return
        }
        setLoad(true)
        const body: any = { ...jobList! }
        if (selectedCat?.id) {
            body.categoryId = selectedCat?.id!
        }
        if (selectedLoc?.address) {
            body.address = selectedLoc?.address!
        }
        if (date) {
            body.deadline = date.toISOString()
        }
        if (selectedLoc?.latitude && selectedLoc?.longitude) {
            body.location = JSON.stringify({
                type: "Point",
                coordinates: [selectedLoc?.longitude, selectedLoc?.latitude]
            })
        }
        const res = await updateListing(body, id)
        if (res?.status === 201 || res?.status === 200) {
            Toast.show({
                type: 'success',
                text1: 'Job Updated, Redirecting...'
            })
            setTimeout(() => {
                router.push("/listing")
            }, 1000)
        } else {
            Toast.show({
                type: 'error',
                text1: 'An error occured, try again'
            })
        }
        setLoad(false)
    }

    return (
        <>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <View style={styles.container}>
                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <Text style={{ fontSize: 16, fontWeight: 600 }}>Edit Job Listing</Text>
                        <MaterialIcons onPress={() => router.back()} name="cancel" size={24} color="black" />
                    </View>
                    <Text style={{ fontSize: 16, fontWeight: 600, marginTop: 30, textAlign: "center", marginBottom: 10 }}>Enter Job Information</Text>
                    <View style={styles.scrollContainer}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={{ paddingBottom: 10 }}>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputText}>Job Title</Text>
                                    <TextInput value={jobList?.title} onChangeText={(text) => handleInput("title", text)} placeholderTextColor={"black"} style={{ ...styles.registerInput }} placeholder='Enter Job Title' />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputText}>Budget</Text>
                                    <TextInput value={jobList?.budget} onChangeText={(text) => handleInput("budget", text)} placeholderTextColor={"black"} style={{ ...styles.registerInput }} placeholder='Enter Budget' />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputText}>Category</Text>
                                    <TextInput readOnly value={selectedCat?.name} onPress={() => setShowCatModal(true)} placeholderTextColor={"black"} style={{ ...styles.registerInput }} placeholder='Select Category' />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputText}>Location</Text>
                                    <TextInput readOnly value={selectedLoc?.address} onPress={() => setShowLocModal(true)} placeholderTextColor={"black"} style={{ ...styles.registerInput }} placeholder='Select Location' />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputText}>Job Description</Text>
                                    <TextInput value={jobList?.description} onChangeText={(text) => handleInput("description", text)} multiline numberOfLines={5} placeholderTextColor={"black"} style={{ ...styles.registerInput, height: 120, padding: 10 }} placeholder='Give a detailed description of what this job is about...' />
                                </View>
                                <Pressable onPress={handleImageSelect} style={{ ...styles.uploadView, ...generalStyle.border[colorScheme] }}>
                                    {
                                        image ?
                                            <ImageBackground source={{ uri: image }} style={styles.background}>
                                                <AntDesign name="upload" size={30} color={"white"} />
                                                <Text style={{ fontSize: 18, ...generalStyle.text.dark }}>Upload image</Text>
                                            </ImageBackground>
                                            :
                                            <>
                                                <AntDesign name="upload" size={30} color={colorScheme === "dark" ? "white" : "black"} />
                                                <Text style={{ fontSize: 18, ...generalStyle.text[colorScheme] }}>Upload image</Text>
                                            </>
                                    }
                                </Pressable>
                                <View style={{ ...styles.inputContainer, marginBottom: 10 }}>
                                    <Text style={styles.inputText}>Deadline</Text>
                                    {Platform.OS === 'android' && <Pressable style={{ display: 'flex', flexDirection: 'row', columnGap: 5, alignItems: 'center' }} onPress={() => setShowDate(true)}>
                                        <Text>{date?.toLocaleString()}</Text>
                                        <Feather name="edit" size={14} color="black" />
                                    </Pressable>}
                                    {showDate && <DateTimePicker
                                        value={date}
                                        mode="date"
                                        display="default"
                                        onChange={onChange}
                                    />}
                                </View>
                                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", height: 60 }}>
                                    <Pressable onPress={() => router.back()} style={styles.cancelButton}><Text style={{ ...styles.buttonText, ...generalStyle.text["light"] }}>Cancel</Text></Pressable>
                                    <Pressable onPress={handleSubmit} style={styles.createButton}>
                                        {
                                            load ?
                                                <ActivityIndicator color={"white"} size={"large"} /> :
                                                <Text style={{ ...styles.buttonText, ...generalStyle.text["dark"] }}>Update Listing</Text>
                                        }
                                    </Pressable>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </KeyboardAvoidingView>
            <SelectCategory showModal={showCatModal} setShowModal={setShowCatModal} setSelectedCat={setSelectedCat} />
            <SelectLocation showModal={showLocModal} setShowModal={setShowLocModal} setSelectedLoc={setSelectedLoc} />
        </>
    )
}

export default UpdateListing

const styles = StyleSheet.create({
    container: {
        padding: 15,
        paddingTop: 80,
        height: "100%"
    },
    inputContainer: {
        width: "100%"
    },
    inputText: {
        fontSize: 13,
        fontWeight: 400,
        marginBottom: 10
    },
    registerInput: {
        height: 50,
        fontSize: 13,
        borderWidth: 1,
        flexShrink: 1,
        width: '100%',
        marginBottom: 20,
        paddingLeft: 10,
        borderRadius: 5,
    },
    scrollContainer: {
        // height: "88%",
        flex: 1
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
        gap: 10
    },
    background: {
        width: '100%',
        height: "100%",
        justifyContent: 'center',
        alignItems: 'center',
    },
    createButton: {
        width: "49%",
        height: 45,
        borderRadius: 10,
        backgroundColor: "#1B64F1",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    cancelButton: {
        width: "49%",
        height: 45,
        borderRadius: 10,
        backgroundColor: "#FFFFFF",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0.5,
        marginTop: 10
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 600
    },
})