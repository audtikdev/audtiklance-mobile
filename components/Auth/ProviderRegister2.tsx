import { View, Text, KeyboardAvoidingView, TouchableWithoutFeedback, Image, TextInput, Pressable, StyleSheet, Keyboard, Alert, ImageBackground, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
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
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux'
import { providerRegisterTwoSchema } from '@/validation/register'

const ProviderRegister2 = () => {
    const dispatch = useDispatch()
    const [query, setQuery] = useState("");
    const [image, setImage] = useState("")
    const [locations, setLocations] = useState([]);
    const { control, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(providerRegisterTwoSchema),
    });

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

    const handleLocationSelect = (location: any) => {
        setValue("address", location?.place_name, { shouldValidate: true })
        setValue("longitude", location?.geometry?.coordinates[0], { shouldValidate: true })
        setValue("latitude", location?.geometry?.coordinates[1], { shouldValidate: true })
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
            setValue("profile_picture", result.assets[0].uri, { shouldValidate: true })
        }
    }

    const onSubmit = (data: RegisterProvider) => {
        console.log(data);

        dispatch(updateRegisterProvider({ provider: data }))
        router.push("/providerRegister3")
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.registerContainer}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.registerMain}>
                    {/* <Pressable style={styles.backButton}>
                        <AntDesign name="arrowleft" size={24} color="black" />
                        <Text>Back</Text>
                    </Pressable> */}
                    <Image source={require("../../assets/images/logo.png")} />
                    <Text style={{ ...styles.profileText, marginBottom: 0 }}>Service Provider Profile Creation</Text>

                    <Text style={{ ...styles.profileText, }}>Business Information</Text>
                    <Controller
                        control={control}
                        name="business_name"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput placeholderTextColor={"black"} onChangeText={onChange} onBlur={onBlur} value={value} style={{ ...styles.registerInput }} placeholder='Business Name' />
                        )}
                    />
                    <View style={styles.errorContainer}>
                        {errors.business_name && <Text style={styles.errorText}>{errors.business_name.message}</Text>}
                    </View>

                    <Controller
                        control={control}
                        name="phone"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput placeholderTextColor={"black"} onChangeText={onChange} onBlur={onBlur} value={value} keyboardType='phone-pad' style={{ ...styles.registerInput }} placeholder='Phone Number' />
                        )}
                    />
                    <View style={styles.errorContainer}>
                        {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}
                    </View>

                    <AutoSearch
                        key={"autoSearch"}
                        data={locations}
                        placeholder='Location'
                        onChangeText={handleSearch}
                        query={query}
                        onChangeValue={handleLocationSelect}
                        objectKey='place_name'
                    />
                    <View style={{ ...styles.errorContainer, marginTop: -5 }}>
                        {errors.address && <Text style={styles.errorText}>{errors.address.message}</Text>}
                    </View>
                    <Controller
                        control={control}
                        name="about_me"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput multiline={true} numberOfLines={5} textAlignVertical='top' placeholderTextColor={"black"} onChangeText={onChange} value={value} onBlur={onBlur} style={{ ...styles.registerInput, height: 90, paddingTop: 10, marginTop: 10 }} placeholder='Business Description' />
                        )}
                    />
                    <View style={styles.errorContainer}>
                        {errors.about_me && <Text style={styles.errorText}>{errors.about_me.message}</Text>}
                    </View>

                    <Pressable onPress={handleImageSelect} style={{ ...styles.uploadView }}>
                        {
                            image ?
                                <ImageBackground source={{ uri: image }} style={styles.background}>
                                    <AntDesign name="upload" size={30} color={"white"} />
                                    <Text style={{ fontSize: 14, ...generalStyle.text.dark }}>Upload image</Text>
                                </ImageBackground>
                                :
                                <>
                                    <AntDesign name="upload" size={30} color={"black"} />
                                    <Text style={{ fontSize: 14 }}>Upload image</Text>
                                </>
                        }
                    </Pressable>
                    <View style={{ ...styles.errorContainer, marginTop: -5 }}>
                        {errors.profile_picture && <Text style={styles.errorText}>{errors.profile_picture.message}</Text>}
                    </View>
                    <Pressable onPress={handleSubmit(onSubmit)} style={{ ...styles.registerButton }}><Text style={{ ...styles.buttonText }}>Continue</Text></Pressable>
                    <Pressable onPress={()=> router.back()} style={{ ...styles.backButton }}><Text style={{ ...styles.buttonText, color: "#1B64F1" }}>Go back</Text></Pressable>
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
        padding: 20,
        backgroundColor: "white"
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
        fontSize: 16,
        fontWeight: 600,
        marginTop: 10,
        marginBottom: 20
    },
    registerInput: {
        height: 42,
        borderWidth: 1,
        width: '100%',
        marginBottom: 20,
        paddingLeft: 10,
        borderRadius: 5,
    },
    registerButton: {
        width: "100%",
        height: 45,
        borderRadius: 10,
        backgroundColor: "#1B64F1",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    backButton: {
        width: "100%",
        height: 45,
        borderRadius: 10,
        borderColor: "#1B64F1",
        borderWidth: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 600,
        color: "white"
    },
    errorContainer: {
        width: "100%",
        marginTop: -15,
        marginBottom: 5
    },
    errorText: {
        fontSize: 13,
        textAlign: "left",
        color: '#F0594C'
    },
    uploadView: {
        width: "100%",
        height: 100,
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