import { View, Text, KeyboardAvoidingView, TouchableWithoutFeedback, Image, TextInput, Pressable, useColorScheme, StyleSheet, Keyboard, Alert, ImageBackground } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { generalStyle } from '@/style/generalStyle'
import { router } from 'expo-router'
import axios from "axios"
import * as ImagePicker from 'expo-image-picker';
import { debounce } from "lodash";
import Constants from 'expo-constants'
import { RegisterProvider } from '@/types/auth'
import AntDesign from '@expo/vector-icons/AntDesign';
import AutoSearch from '../AutoComplete'
import { updateRegisterProvider } from '../Context/registerProvider'
import { useDispatch } from 'react-redux'

const ProviderRegister2 = () => {
    const dispatch = useDispatch()
    const colorScheme = useColorScheme() || "light"
    const [userInfo, setUserInfo] = useState<RegisterProvider>()
    const [query, setQuery] = useState("");
    const [image, setImage] = useState("")
    const [locations, setLocations] = useState([]);
    const mapKey = Constants.expoConfig?.extra?.MAPBOX_KEY
    useEffect(() => {
        // Debounce the search function to reduce API calls
        const delayedSearch = debounce(() => {
            if (query.trim() !== "") {
                const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                    query,
                )}.json?access_token=${mapKey}`;

                axios.get(url)
                    .then((response: any) => {
                        setLocations(response.data.features);
                    })
                    .catch((error: any) => {
                        console.error(error);
                    });
            } else {
                setLocations([]);
            }
        }, 300);

        delayedSearch();

        // Clean up the debounce function on unmount
        return () => delayedSearch.cancel();
    }, [query])

    const handleSearch = (text: string) => {
        setQuery(text);
    };

    const handleInput = (type: string, value: string) => {
        setUserInfo((prevUserInfo) => ({
            ...prevUserInfo!,
            [type!]: value!,
        }));
    }

    const handleLocationSelect = (location: any) => {
        setUserInfo((prevUserInfo) => ({
            ...prevUserInfo!,
            location: location!,
        }));
        setQuery(location?.place_name)
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
            setUserInfo((prevUserInfo) => ({
                ...prevUserInfo!,
                pictures: [image!],
            }));
        }
    }

    const handleSubmit = () => {
        console.log(userInfo);
        
        dispatch(updateRegisterProvider({ provider: userInfo! }))
        router.push("/providerRegister3")
    }

    return (
        <KeyboardAvoidingView style={styles.registerContainer}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.registerMain}>
                    <Image source={require("../../assets/images/logo.png")} />
                    <Text style={{ ...styles.profileText, ...generalStyle.text[colorScheme] }}>Service Provider Profile Creation</Text>

                    <Text style={{ ...styles.profileText, ...generalStyle.text[colorScheme] }}>Business Information</Text>

                    <TextInput placeholderTextColor={generalStyle.text[colorScheme].color} onChangeText={(text) => handleInput("businessName", text)} value={userInfo?.fullName} style={{ ...styles.registerInput, ...generalStyle.border[colorScheme], ...generalStyle.text[colorScheme] }} placeholder='Business Name' />

                    <TextInput placeholderTextColor={generalStyle.text[colorScheme].color} onChangeText={(text) => handleInput("phoneNumber", text)} value={userInfo?.phoneNumber} keyboardType='phone-pad' style={{ ...styles.registerInput, ...generalStyle.border[colorScheme], ...generalStyle.text[colorScheme] }} placeholder='Phone Number' />

                    <AutoSearch
                        key={"autoSearch"}
                        data={locations}
                        placeholder='Location'
                        onChangeText={handleSearch}
                        query={query}
                        onChangeValue={handleLocationSelect}
                        objectKey='place_name'
                    />

                    <TextInput multiline={true} numberOfLines={5} textAlignVertical='top' placeholderTextColor={generalStyle.text[colorScheme].color} onChangeText={(text) => handleInput("description", text)} value={userInfo?.email} style={{ ...styles.registerInput, height: 100, paddingTop: 10, ...generalStyle.border[colorScheme], ...generalStyle.text[colorScheme] }} placeholder='Business Description' />

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
                    <Pressable onPress={handleSubmit} style={{ ...styles.registerButton, ...(colorScheme === "light" && generalStyle.button.active), ...(colorScheme === "dark" && generalStyle.button.dark) }}><Text style={{ ...styles.buttonText, ...generalStyle.text["dark"] }}>Continue</Text></Pressable>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

export default ProviderRegister2

const styles = StyleSheet.create({
    registerContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
        padding: 20
    },
    registerMain: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        width: "100%",
        height: "100%"
    },
    profileText: {
        fontSize: 18,
        fontWeight: 600,
        marginTop: 10,
        marginBottom: 20
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
    registerButton: {
        width: "100%",
        height: 52,
        borderRadius: 10,
        backgroundColor: "#00000080",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 600
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

    loginText: {
        fontSize: 14,
        fontWeight: 600,
        marginBottom: 30
    },
    termsContainer: {
        position: "absolute",
        bottom: 30
    },
    termsText: {
        fontSize: 14,
        fontWeight: 500
    }
})