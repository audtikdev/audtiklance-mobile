import { View, Text, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, StyleSheet, Image, useColorScheme, Pressable, TextInput } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { generalStyle } from '@/style/generalStyle'
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../Store/store';
import AutoSearch from '../AutoComplete';
import { Service } from '@/types/service';
import { router } from 'expo-router';
import { Modalize } from 'react-native-modalize';
import { debounce } from 'lodash';
import Constants from 'expo-constants'
import axios from 'axios';
import { updateRegisterProvider } from '../Context/registerProvider';

const ProviderRegister3 = () => {
    const colorScheme = useColorScheme() || "light"
    const providerDetails = useSelector((state: RootState) => state.registerProvider.provider)
    const [services, setServices] = useState<Service[]>([])
    const [activeService, setActiveService] = useState<Service>()
    const [selectedServices, setSelectedServices] = useState<Service[]>([])
    const [query, setQuery] = useState("");
    const dispatch = useDispatch()
    const modalizeRef = useRef<Modalize>(null)
    const baseUrl = Constants.expoConfig?.extra?.BASE_API

    useEffect(() => {
        // Debounce the search function to reduce API calls
        const delayedSearch = debounce(() => {
            if (query.trim() !== "") {
                const url = `${baseUrl}/category/?search=${query}&is_subcategory=true`;
                axios.get(url)
                    .then((response: any) => {
                        setServices(response.data.results);
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

    const handleServiceSelect = (service: Service) => {
        setActiveService(service)
        setQuery(service?.name)
        Keyboard.dismiss()
        modalizeRef.current?.open()
    }

    const addService = () => {
        const filteredServices = selectedServices?.filter((service) => service.name !== activeService?.name)
        setSelectedServices([...filteredServices, activeService!])
        modalizeRef.current?.close()
        setQuery("")
    }

    const editService = (service: Service) => {
        setActiveService(service)
        modalizeRef.current?.open()
    }

    const removeService = (service: Service) => {
        const filteredServices = selectedServices?.filter((serv) => serv.name !== service?.name)
        setSelectedServices(filteredServices)
    }

    const handlePriceinput = (text: string) => {
        setActiveService((prev) => ({ ...prev!, price: Number(text) }))
    }

    const handleSubmit = () => {
        if (selectedServices?.length < 1) {
            return
        }
        const skill_data = selectedServices?.map((service) => {
            return {
                skill: service?.id,
                cost: service?.price,
                time_frame: "HOURLY"
            }
        })

        dispatch(updateRegisterProvider({ provider: { skill_data: skill_data } }))
        router.push("/providerRegister4")
    }

    return (
        <>
            <KeyboardAvoidingView style={styles.registerContainer}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.registerMain}>
                        <Image source={require("../../assets/images/logo.png")} />
                        <Text style={{ ...styles.profileText, ...generalStyle.text[colorScheme] }}>Service Provider Profile Creation</Text>
                        <Text style={{ ...styles.profileText, ...generalStyle.text[colorScheme] }}>Choose Your Services</Text>
                        <Text style={{ ...styles.profileText, ...generalStyle.text[colorScheme], marginTop: 25 }}>{providerDetails?.business_name}</Text>
                        <View style={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'row', columnGap: 10, marginBottom: 40 }}>
                            <Ionicons name="location-sharp" size={24} color="black" />
                            <Text style={{ ...styles.profileText, ...generalStyle.text[colorScheme] }}>{providerDetails?.address}</Text>
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
                                        <Text>{service?.name}</Text>
                                        <MaterialIcons onPress={() => removeService(service)} name="cancel" size={18} color="black" />
                                    </Pressable>
                                ))
                            }
                        </View>
                        <Pressable onPress={handleSubmit} style={{ ...styles.registerButton, ...(colorScheme === "light" && generalStyle.button.active), ...(colorScheme === "dark" && generalStyle.button.dark) }}><Text style={{ ...styles.buttonText, ...generalStyle.text["dark"] }}>Continue</Text></Pressable>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
            <Modalize
                ref={modalizeRef}
                adjustToContentHeight={true}
                modalStyle={generalStyle.modalBackground[colorScheme]}
                closeOnOverlayTap={false}
            >
                <View style={styles.modalContent}>
                    <View style={styles.activeServiceTitleContainer}>
                        <Text style={styles.activeServiceTitle}>{activeService?.name}</Text>
                    </View>
                    <Text style={styles.activeServiceText}>Pros with upfront pricing get hired more on Audtiklance.</Text>
                    <Text style={styles.activeServiceText}>Add a base price to help you get contacted and hired more, The price will include: Labor (excludes cost of parts).</Text>
                    <Text style={{ marginBottom: 5, marginTop: 10 }}>Enter your base price</Text>
                    <TextInput placeholderTextColor={generalStyle.text[colorScheme].color} onChangeText={(text) => handlePriceinput(text)} value={activeService?.sub_category?.[0]?.cost} keyboardType='phone-pad' style={{ ...styles.registerInput, ...generalStyle.border[colorScheme], ...generalStyle.text[colorScheme] }} placeholder='$0.00' />
                    <View style={styles.buttonContainer}>
                        <Pressable onPress={() => modalizeRef.current?.close()} style={{ ...styles.registerButton, marginTop: 0, backgroundColor: "white", borderWidth: 1, ...generalStyle.border[colorScheme] }}><Text style={{ ...styles.buttonText, ...generalStyle.text["light"] }}>Cancel</Text></Pressable>
                        <Pressable onPress={addService} style={{ ...styles.registerButton, marginTop: 0, ...(colorScheme === "light" && generalStyle.button.active), ...(colorScheme === "dark" && generalStyle.button.dark) }}><Text style={{ ...styles.buttonText, ...generalStyle.text["dark"] }}>Submit</Text></Pressable>
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
        fontSize: 18,
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
        backgroundColor: "#00000080",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
        flexShrink: 1
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 600
    },
})