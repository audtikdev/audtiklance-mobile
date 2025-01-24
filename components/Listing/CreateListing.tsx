import { View, Text, StyleSheet, TextInput, useColorScheme, Pressable, ImageBackground, Alert, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import * as ImagePicker from 'expo-image-picker';
import { AntDesign, MaterialIcons } from '@expo/vector-icons'
import { generalStyle } from '@/style/generalStyle'
import { router } from 'expo-router';
import { SelectCategory, SelectLocation } from './ListingModal';
import { Service } from '@/types/service';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ListingBody } from '@/types/listing';
import Toast from 'react-native-toast-message';
import { createListing } from '@/api/listing';

export type ListingLocation = {
    longitude: string,
    latitude: string,
    address: string
}

const CreateListing = () => {
    const colorScheme = useColorScheme() || "light"
    const [image, setImage] = useState("")
    const [showCatModal, setShowCatModal] = useState(false)
    const [showLocModal, setShowLocModal] = useState(false)
    const [selectedCat, setSelectedCat] = useState<Service>()
    const [selectedLoc, setSelectedLoc] = useState<ListingLocation>()
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [load, setLoad] = useState(false)
    const [jobList, setJobList] = useState<ListingBody>()

    const onChange = (event: any, selectedDate: Date | undefined) => {
        const currentDate = selectedDate || date;
        setShow(false);
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
        body.category = selectedCat?.id!
        body.longitude = selectedLoc?.longitude!,
        body.latitude = selectedLoc?.latitude!,
        body.address = selectedLoc?.address!,
        body.preferred_date = date.toISOString()
        const formData = new FormData()
        Object.entries(body).forEach(([key, value])=> {
            formData.append(key, value as string)
        })

        let filename = image.split('/').pop();
      
        let match = /\.(\w+)$/.exec(filename!);
        let type = match ? `image/${match[1]}` : `image`;
                
        // @ts-ignore
        formData.append('images[0]', { uri: image, name: filename, type });

        console.log(formData.get("budget"));
        console.log(formData.get("title"));
        console.log(formData.get("category"));
        console.log(formData.get("description"));
        console.log(formData.get("longitude"));
        console.log(formData.get("latitude"));
        console.log(formData.get("address"));
        console.log(formData.get("preferred_date"));
        console.log(formData.get("images[0]"));

        const res = await createListing(body)
        console.log(res);
        
        setLoad(false)
    }

    return (
        <>
            <KeyboardAvoidingView>
                <View style={styles.container}>
                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <Text style={{ fontSize: 18, fontWeight: 600 }}>Add New Listing</Text>
                        <MaterialIcons onPress={() => router.back()} name="cancel" size={24} color="black" />
                    </View>
                    <Text style={{ fontSize: 18, fontWeight: 600, marginTop: 30, textAlign: "center", marginBottom: 10 }}>Enter Job Information</Text>
                    <View style={styles.scrollContainer}>
                        <ScrollView contentContainerStyle={{ height: "115%" }} showsVerticalScrollIndicator={false}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputText}>Job Title</Text>
                                <TextInput onChangeText={(text) => handleInput("title", text)} placeholderTextColor={generalStyle.text[colorScheme].color} style={{ ...styles.registerInput, ...generalStyle.border[colorScheme], ...generalStyle.text[colorScheme] }} placeholder='Enter Job Title' />
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputText}>Budget</Text>
                                <TextInput onChangeText={(text) => handleInput("budget", text)} placeholderTextColor={generalStyle.text[colorScheme].color} style={{ ...styles.registerInput, ...generalStyle.border[colorScheme], ...generalStyle.text[colorScheme] }} placeholder='Enter Budget' />
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputText}>Category</Text>
                                <TextInput readOnly value={selectedCat?.name} onPress={() => setShowCatModal(true)} placeholderTextColor={generalStyle.text[colorScheme].color} style={{ ...styles.registerInput, ...generalStyle.border[colorScheme], ...generalStyle.text[colorScheme] }} placeholder='Select Category' />
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputText}>Location</Text>
                                <TextInput readOnly value={selectedLoc?.address} onPress={() => setShowLocModal(true)} placeholderTextColor={generalStyle.text[colorScheme].color} style={{ ...styles.registerInput, ...generalStyle.border[colorScheme], ...generalStyle.text[colorScheme] }} placeholder='Select Location' />
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputText}>Job Description</Text>
                                <TextInput onChangeText={(text) => handleInput("description", text)} multiline numberOfLines={5} placeholderTextColor={generalStyle.text[colorScheme].color} style={{ ...styles.registerInput, height: 120, padding: 10, ...generalStyle.border[colorScheme], ...generalStyle.text[colorScheme] }} placeholder='Give a detailed description of what this job is about...' />
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
                                <DateTimePicker
                                    value={date}
                                    mode="datetime"
                                    display="default"
                                    onChange={onChange}
                                />

                            </View>

                            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <Pressable onPress={() => router.back()} style={styles.cancelButton}><Text style={{ ...styles.buttonText, ...generalStyle.text["light"] }}>Cancel</Text></Pressable>
                                <Pressable onPress={handleSubmit} style={styles.createButton}>
                                    {
                                        load ?
                                        <ActivityIndicator color={"white"} size={"large"} /> :
                                        <Text style={{ ...styles.buttonText, ...generalStyle.text["dark"] }}>Create Listing</Text>
                                    }
                                </Pressable>
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
        fontSize: 16,
        fontWeight: 400,
        marginBottom: 10
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
    scrollContainer: {
        height: "88%"
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