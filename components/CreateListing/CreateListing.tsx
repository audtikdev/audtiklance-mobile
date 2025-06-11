import { View, Text, StyleSheet, TextInput, Pressable, ImageBackground, Alert, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import * as ImagePicker from 'expo-image-picker';
import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons'
import { generalStyle } from '@/style/generalStyle'
import { router } from 'expo-router';
import { SelectCategory, SelectLocation } from './ListingModal';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ListingBody } from '@/types/listing';
import Toast from 'react-native-toast-message';
import { createListing } from '@/api/listing';
import { openURL } from 'expo-linking';
import { RootState } from '../Store/store';
import { useSelector } from 'react-redux';
import { CategoryType } from '@/types/service';
export type ListingLocation = {
    longitude: string,
    latitude: string,
    address: string
}

const CreateListing = () => {
    const [image, setImage] = useState("")
    const [showCatModal, setShowCatModal] = useState(false)
    const [showLocModal, setShowLocModal] = useState(false)
    const [selectedCat, setSelectedCat] = useState<CategoryType>()
    const [selectedLoc, setSelectedLoc] = useState<ListingLocation>()
    const [date, setDate] = useState(new Date());
    const [load, setLoad] = useState(false)
    const [showDate, setShowDate] = useState(Platform.OS !== 'android')
    const [jobList, setJobList] = useState<ListingBody>()

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
        if (!image || !selectedCat?.id || !selectedLoc?.address) {
            Toast.show({
                type: "info",
                text1: "All Field Are Required"
            })
            return
        }
        setLoad(true)
        const body: ListingBody = { ...jobList! }
        body.categoryId = selectedCat?.id!
            body.address = selectedLoc?.address!,
            body.deadline = date.toISOString()?.split('T')[0]
        const formData = new FormData()
        Object.entries(body).forEach(([key, value]) => {
            formData.append(key, value as string)
        })
        formData.append("location", JSON.stringify({ lat: selectedLoc?.latitude, lng: selectedLoc?.longitude }))
        let filename = image.split('/').pop();

        let match = /\.(\w+)$/.exec(filename!);
        let type = match ? `image/${match[1]}` : `image`;

        // @ts-ignore
        formData.append('images', { uri: image, name: filename, type });
        const res = await createListing(formData)

        if (res?.status === 201 || res?.status === 200) {
            Toast.show({
                type: 'success',
                text1: 'Job Created, Redirecting...'
            })
            router.push('/listing')
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
                        <Text style={{ fontSize: 16, fontWeight: 600 }}>Add New Listing</Text>
                        <MaterialIcons onPress={() => router.back()} name="cancel" size={24} color="black" />
                    </View>
                    <Text style={{ fontSize: 16, fontWeight: 600, marginTop: 30, textAlign: "center", marginBottom: 10 }}>Enter Job Information</Text>
                    <View style={styles.scrollContainer}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={{ paddingBottom: 10 }}>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputText}>Job Title</Text>
                                    <TextInput onChangeText={(text) => handleInput("title", text)} placeholderTextColor={"black"} style={{ ...styles.registerInput }} placeholder='Enter Job Title' />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputText}>Budget</Text>
                                    <TextInput onChangeText={(text) => handleInput("budget", text)} placeholderTextColor={"black"} style={{ ...styles.registerInput }} placeholder='Enter Budget' />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputText}>Category</Text>
                                    <Pressable style={{ ...styles.registerInput, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingRight: 10 }} onPress={() => setShowCatModal(true)}><Text>{selectedCat?.name || "Select Category"}</Text><Feather name="chevron-down" size={14} color="black" /></Pressable>
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputText}>Location</Text>
                                    <Pressable style={{ ...styles.registerInput, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingRight: 10 }} onPress={() => setShowLocModal(true)}><Text>{selectedLoc?.address || "Select Location"}</Text><Feather name="chevron-down" size={14} color="black" /></Pressable>
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputText}>Job Description</Text>
                                    <TextInput onChangeText={(text) => handleInput("description", text)} multiline numberOfLines={5} placeholderTextColor={"black"} style={{ ...styles.registerInput, height: 120, padding: 10 }} placeholder='Give a detailed description of what this job is about...' />
                                </View>
                                <Pressable onPress={handleImageSelect} style={{ ...styles.uploadView }}>
                                    {
                                        image ?
                                            <ImageBackground source={{ uri: image }} style={styles.background}>
                                                <AntDesign name="upload" size={30} color={"white"} />
                                                <Text style={{ fontSize: 18, ...generalStyle.text.dark }}>Upload image</Text>
                                            </ImageBackground>
                                            :
                                            <>
                                                <AntDesign name="upload" size={30} color={"black"} />
                                                <Text style={{ fontSize: 18 }}>Upload image</Text>
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
                                                <Text style={{ ...styles.buttonText, ...generalStyle.text["dark"] }}>Create Listing</Text>
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

export default CreateListing

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