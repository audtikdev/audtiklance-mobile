import { View, Text, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, StyleSheet, Image, useColorScheme, Pressable, TextInput, Platform } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { generalStyle } from '@/style/generalStyle'
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../Store/store';
import AutoSearch from '../AutoComplete';
import { CategoryType, ServiceType } from '@/types/service';
import { router } from 'expo-router';
import { Modalize } from 'react-native-modalize';
import { debounce } from 'lodash';
import Constants from 'expo-constants'
import axios from 'axios';
import { updateRegisterProvider } from '../Context/registerProvider';
import { AntDesign } from '@expo/vector-icons';
import { RegisterProvider } from '@/types/auth';
const ProviderRegister3 = () => {
    const colorScheme = useColorScheme() || "light"
    const providerDetails = useSelector((state: RootState) => state.registerProvider.provider)
    const [services, setServices] = useState<ServiceType[]>([])
    const [activeService, setActiveService] = useState<ServiceType>()
    const [selectedServices, setSelectedServices] = useState<ServiceType[]>([])
    const [query, setQuery] = useState("");
    const dispatch = useDispatch()
    const modalizeRef = useRef<Modalize>(null)
    const baseUrl = Constants.expoConfig?.extra?.BASE_API

    useEffect(() => {
        // Debounce the search function to reduce API calls
        const delayedSearch = debounce(() => {
            if (query.trim() !== "") {
                const url = `${baseUrl}/categories/search?q=${query}`;
                axios.get(url)
                    .then((response: any) => {
                        setServices(response.data);
                    })
                    .catch((error: any) => {
                        console.error(error);
                    });
            } else {
                setServices([]);
            }
        }, 300);

        delayedSearch();

        // Clean up the debounce function on unmount
        return () => delayedSearch.cancel();
    }, [query])

    const handleSearch = (text: string) => {
        setQuery(text);
    };

    const handleServiceSelect = (service: CategoryType) => {
        setActiveService((prev: any) => ({ ...prev!, category: service }))
        setQuery(service?.name)
        Keyboard.dismiss()
        modalizeRef.current?.open()
    }

    const addService = () => {
        const filteredServices = selectedServices?.filter((service) => service.category?.name !== activeService?.category?.name)
        setSelectedServices([...filteredServices, activeService!])
        modalizeRef.current?.close()
        setQuery("")
    }

    const editService = (service: ServiceType) => {
        setActiveService(service)
        modalizeRef.current?.open()
    }

    const removeService = (service: ServiceType) => {
        const filteredServices = selectedServices?.filter((serv) => serv.category?.name !== service?.category?.name)
        setSelectedServices(filteredServices)
    }

    const handlePriceinput = (text: string) => {
        setActiveService((prev: any) => ({ ...prev!, price: Number(text) }))
    }

    const handleSubmit = () => {
        if (selectedServices?.length < 1) {
            return
        }
        const skill_data = selectedServices?.map((service) => {
            return {
                skill: service?.category?.id,
                cost: service?.price,
                time_frame: "HOURLY"
            }
        })

        dispatch(updateRegisterProvider({ provider: { skill_data: skill_data } as RegisterProvider }))
        router.push("/providerRegister4")
    }

    return (
        <>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.registerContainer}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.registerMain}>
                        <Image style={{ width: 100, height: 100, objectFit: "contain" }} source={require("../../assets/images/logo.png")} />
                        <Text style={{ ...styles.profileText }}>Service Provider Profile Creation</Text>
                        <Text style={{ ...styles.profileText }}>Choose Your Services</Text>
                        <Text style={{ ...styles.profileText, marginTop: 25 }}>{providerDetails?.title}</Text>
                        <View style={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'row', columnGap: 10, marginBottom: 40 }}>
                            <Ionicons name="location-sharp" size={24} color={"black"} />
                            <Text style={{ ...styles.profileText }}>{providerDetails?.address}</Text>
                        </View>
                        <AutoSearch
                            key={"autoSearch"}
                            data={services}
                            placeholder='Search for services'
                            query={query}
                            onChangeText={handleSearch}
                            onChangeValue={handleServiceSelect}
                            objectKey='name'
                        />
                        <View style={styles.selectedServiceContainer}>
                            {
                                selectedServices?.map((service, i) => (
                                    <Pressable onPress={() => editService(service)} key={i} style={styles.selectedService}>
                                        <Text>{service?.category?.name}</Text>
                                        <MaterialIcons onPress={() => removeService(service)} name="cancel" size={18} color="black" />
                                    </Pressable>
                                ))
                            }
                        </View>
                        <Pressable onPress={handleSubmit} style={{ ...styles.registerButton }}><Text style={{ ...styles.buttonText }}>Continue</Text></Pressable>
                        <Pressable onPress={() => router.back()} style={{ ...styles.backButton }}><Text style={{ ...styles.buttonText, color: "#1B64F1" }}>Go back</Text></Pressable>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
            <Modalize
                ref={modalizeRef}
                adjustToContentHeight={true}
                closeOnOverlayTap={false}
            >
                <View style={styles.modalContent}>
                    <View style={styles.activeServiceTitleContainer}>
                        <Text style={styles.activeServiceTitle}>{activeService?.category?.name}</Text>
                    </View>
                    <Text style={styles.activeServiceText}>Pros with upfront pricing get hired more on HandyTap.</Text>
                    <Text style={styles.activeServiceText}>Add a base price to help you get contacted and hired more, The price will include: Labor (excludes cost of parts).</Text>
                    <Text style={{ marginBottom: 5, marginTop: 10 }}>Enter your base price</Text>
                    <TextInput placeholderTextColor={"black"} onChangeText={(text) => handlePriceinput(text)} value={activeService?.price} keyboardType='phone-pad' style={{ ...styles.registerInput }} placeholder='$0.00' />
                    <View style={styles.buttonContainer}>
                        <Pressable onPress={() => modalizeRef.current?.close()} style={{ ...styles.registerButton, marginTop: 0, backgroundColor: "white", borderWidth: 1 }}><Text style={{ ...styles.buttonText, ...generalStyle.text["light"] }}>Cancel</Text></Pressable>
                        <Pressable onPress={addService} style={{ ...styles.registerButton, marginTop: 0 }}><Text style={{ ...styles.buttonText, ...generalStyle.text["dark"] }}>Submit</Text></Pressable>
                    </View>
                </View>
            </Modalize>
        </>
    )
}

export default ProviderRegister3

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
        paddingTop: 80,
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "column",
        width: "100%",
        height: "100%",
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
    modalContent: {
        padding: 25,
        height: 400
    },
    profileText: {
        fontSize: 15,
        fontWeight: 600,
        marginTop: 10,
    },
    selectedServiceContainer: {
        width: "100%",
        display: 'flex',
        flexDirection: 'row',
        alignItems: "center",
        flexWrap: 'wrap',
        gap: 10
    },
    selectedService: {
        height: 40,
        padding: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: "center",
        columnGap: 10,
        borderWidth: 1,
        borderRadius: 20,
    },
    activeServiceTitleContainer: {
        height: 40,
        borderBottomWidth: 1
    },
    activeServiceTitle: {
        fontSize: 22,
        fontWeight: 600
    },
    activeServiceText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 15
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        columnGap: 10
    },
    registerButton: {
        width: "100%",
        height: 52,
        borderRadius: 10,
        backgroundColor: "#1B64F1",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
        flexShrink: 1
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
})