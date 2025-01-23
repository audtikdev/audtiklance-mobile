import { View, Text, StyleSheet, TextInput, useColorScheme, Pressable, ImageBackground, Alert, ScrollView, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import * as ImagePicker from 'expo-image-picker';
import { AntDesign, MaterialIcons } from '@expo/vector-icons'
import { generalStyle } from '@/style/generalStyle'
import { router } from 'expo-router';

const CreateListing = () => {
    const colorScheme = useColorScheme() || "light"
    const [image, setImage] = useState("")

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

    return (
        <KeyboardAvoidingView>
            <View style={styles.container}>
                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={{ fontSize: 18, fontWeight: 600 }}>Add New Listing</Text>
                    <MaterialIcons onPress={()=> router.back()} name="cancel" size={24} color="black" />
                </View>
                <Text style={{ fontSize: 18, fontWeight: 600, marginTop: 30, textAlign: "center", marginBottom: 10 }}>Enter Job Information</Text>
                <View style={styles.scrollContainer}>
                    <ScrollView contentContainerStyle={{height: "105%"}} showsVerticalScrollIndicator={false}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputText}>Job Title</Text>
                            <TextInput placeholderTextColor={generalStyle.text[colorScheme].color} style={{ ...styles.registerInput, ...generalStyle.border[colorScheme], ...generalStyle.text[colorScheme] }} placeholder='Enter Job Title' />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputText}>Budget</Text>
                            <TextInput placeholderTextColor={generalStyle.text[colorScheme].color} style={{ ...styles.registerInput, ...generalStyle.border[colorScheme], ...generalStyle.text[colorScheme] }} placeholder='Enter Budget' />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputText}>Job Description</Text>
                            <TextInput multiline numberOfLines={5} placeholderTextColor={generalStyle.text[colorScheme].color} style={{ ...styles.registerInput, height: 120, padding: 10, ...generalStyle.border[colorScheme], ...generalStyle.text[colorScheme] }} placeholder='Give a detailed description of what this job is about...' />
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
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputText}>Deadline</Text>
                            <TextInput placeholderTextColor={generalStyle.text[colorScheme].color} style={{ ...styles.registerInput, ...generalStyle.border[colorScheme], ...generalStyle.text[colorScheme] }} placeholder='Deadline' />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputText}>Location</Text>
                            <TextInput placeholderTextColor={generalStyle.text[colorScheme].color} style={{ ...styles.registerInput, ...generalStyle.border[colorScheme], ...generalStyle.text[colorScheme] }} placeholder='Enter Location' />
                        </View>
                        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <Pressable onPress={()=> router.back()} style={styles.cancelButton}><Text style={{ ...styles.buttonText, ...generalStyle.text["light"] }}>Cancel</Text></Pressable>
                            <Pressable style={styles.createButton}><Text style={{ ...styles.buttonText, ...generalStyle.text["dark"] }}>Create Listing</Text></Pressable>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </KeyboardAvoidingView>
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