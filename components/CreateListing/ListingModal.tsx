
import { View, Text, Modal, Pressable, Keyboard, TouchableWithoutFeedback, StyleSheet, useColorScheme } from 'react-native'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import AutoSearch from '../AutoComplete';
import { generalStyle } from '@/style/generalStyle';
import { Service } from '@/types/service';
import axios from 'axios';
import { debounce } from 'lodash';
import Constants from 'expo-constants'
import { ListingLocation } from './CreateListing';

export const SelectCategory: React.FC<{ showModal: boolean, setShowModal: Dispatch<SetStateAction<boolean>>, setSelectedCat: Dispatch<SetStateAction<Service>> }> = ({ showModal, setShowModal, setSelectedCat }) => {
    const [query, setQuery] = useState("");
    const [services, setServices] = useState<Service[]>([])
    const baseUrl = Constants.expoConfig?.extra?.BASE_API
    const colorScheme = useColorScheme() || "light"

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
        setSelectedCat(service)
        setQuery(service?.name)
        Keyboard.dismiss()
    }

    const selectService = () => {
        setShowModal(false)
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={showModal}
            onRequestClose={() => {
                setShowModal(false);
            }}
        >
            <Pressable onPress={() => setShowModal(false)} style={styles.modalOverlay}>
                <View style={styles.addModalContent}>
                    <Text style={{ ...styles.profileText, ...generalStyle.text[colorScheme] }}>Select A New Skill To Add</Text>
                    <AutoSearch
                        key={"autoSearch"}
                        data={services}
                        placeholder='Search for services'
                        query={query}
                        onChangeText={handleSearch}
                        onChangeValue={handleServiceSelect}
                        objectKey='name'
                    />
                    <Pressable onPress={selectService} style={{ ...styles.registerButton, marginTop: 10, ...(colorScheme === "light" && generalStyle.button.active), ...(colorScheme === "dark" && generalStyle.button.dark) }}>
                        <Text style={{ ...styles.buttonText, ...generalStyle.text["dark"] }}>Continue</Text>
                    </Pressable>
                </View>
            </Pressable>
        </Modal>
    )
}

export const SelectLocation: React.FC<{ showModal: boolean, setShowModal: Dispatch<SetStateAction<boolean>>, setSelectedLoc: Dispatch<SetStateAction<ListingLocation | undefined>> }> = ({ showModal, setShowModal, setSelectedLoc }) => {
    const [query, setQuery] = useState("");
    const [locations, setLocations] = useState([]);
    const mapKey = Constants.expoConfig?.extra?.MAPBOX_KEY
    const colorScheme = useColorScheme() || "light"

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
        setSelectedLoc({
            address: location?.place_name!,
            longitude: location?.geometry?.coordinates?.[0],
            latitude: location?.geometry?.coordinates?.[1]
        })
        setQuery(location?.place_name)
    }

    const selectLocation = () => {
        setShowModal(false)
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={showModal}
            onRequestClose={() => {
                setShowModal(false);
            }}
        >
            <Pressable onPress={() => setShowModal(false)} style={styles.modalOverlay}>
                <View style={styles.addModalContent}>
                    <Text style={{ ...styles.profileText, ...generalStyle.text[colorScheme] }}>Enter Your Location</Text>
                    <AutoSearch
                        key={"autoSearch"}
                        data={locations}
                        placeholder='Location'
                        onChangeText={handleSearch}
                        query={query}
                        onChangeValue={handleLocationSelect}
                        objectKey='place_name'
                    />
                    <Pressable onPress={selectLocation} style={{ ...styles.registerButton, marginTop: 10, ...(colorScheme === "light" && generalStyle.button.active), ...(colorScheme === "dark" && generalStyle.button.dark) }}>
                        <Text style={{ ...styles.buttonText, ...generalStyle.text["dark"] }}>Continue</Text>
                    </Pressable>
                </View>
            </Pressable>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    addModalContent: {
        width: "90%",
        height: 250,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalText: {
        marginBottom: 15,
        fontSize: 18,
    },
    profileText: {
        fontSize: 18,
        fontWeight: 600,
        marginTop: 10,
        marginBottom: 20,
        textAlign: "center"
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
})