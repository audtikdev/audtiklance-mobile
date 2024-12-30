import { View, Text, ScrollView, StyleSheet, useColorScheme } from 'react-native'
import React, { useEffect, useState } from 'react'
import AutoSearch from '../AutoComplete'
import { debounce } from 'lodash';
import axios from 'axios';
import Constants from 'expo-constants'
import { Service } from '@/types/service';
import { generalStyle } from '@/style/generalStyle';
import { fakeServices } from '@/data/home';
import ServiceCard from '../Home/ServiceCard';
import { useSelector } from 'react-redux';
import { RootState } from '../Store/store';
import { LocationData } from '../Context/types';
import LottieView from 'lottie-react-native';

const Search = () => {
    const colorScheme = useColorScheme() || "light"
    const userLocation = useSelector((state: RootState) => state.locationProvider.location)
    const [locationQuery, setLocationQuery] = useState("");
    const [serviceQuery, setServiceQuery] = useState("");
    const [locations, setLocations] = useState([]);
    const [location, setLocation] = useState<LocationData>();
    const [services, setServices] = useState<Service[]>([])
    const [serviceSearch, setServiceSearch] = useState<Service[]>([])
    const [service, setService] = useState<{ name: string }>()
    const [load, setLoad] = useState(false)

    const mapKey = Constants.expoConfig?.extra?.MAPBOX_KEY
    const baseUrl = Constants.expoConfig?.extra?.BASE_API

    useEffect(() => {
        if (userLocation) {
            setLocationQuery("Your Location")
            setLocation(userLocation)
        }
    }, [userLocation])

    useEffect(() => {
        // Debounce the search function to reduce API calls
        const delayedSearch = debounce(() => {
            if (locationQuery.trim() !== "") {
                const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                    locationQuery,
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
    }, [locationQuery])

    useEffect(() => {
        // Debounce the search function to reduce API calls
        const delayedSearch = debounce(() => {
            if (serviceQuery.trim() !== "") {
                const url = `${baseUrl}/category/?search=${serviceQuery}`;
                axios.get(url)
                    .then((response: any) => {
                        setServiceSearch(response.data.results);
                    })
                    .catch((error: any) => {
                        console.error(error);
                    });
            } else {
                setServiceSearch([]);
                setService({ name: "" })
            }
        }, 300);

        delayedSearch();

        // Clean up the debounce function on unmount
        return () => delayedSearch.cancel();
    }, [serviceQuery])

    useEffect(() => {
        setLoad(true)
        const url = `${baseUrl}/service/`;
        axios.get(url)
            .then((response: any) => {
                setServices(response.data.results);
                setLoad(false)
            })
            .catch((error: any) => {
                console.error("getServices", error);
                setLoad(false)
            });
    }, [location, service])

    const handleLocationSearch = (text: string) => {
        setLocationQuery(text);
    };

    const handleLocationSelect = (location: any) => {
        setLocation({
            coords: {
                longitude: location?.geometry?.coordinates?.[0],
                latitude: location?.geometry?.coordinates?.[1]
            }
        })
        setLocationQuery(location?.place_name)
    }

    const handleServiceSearch = (text: string) => {
        setServiceQuery(text);
    };

    const handleServiceSelect = (service: Service) => {
        setService(service)
        setServiceQuery(service?.name)
    }

    return (
        <View>
            <View style={styles.searchContainer}>
                <Text style={{ ...styles.searchTitle, ...generalStyle.text[colorScheme] }}>Search For Any Service</Text>
                <AutoSearch
                    key={"autoSearchLocation"}
                    data={locations}
                    placeholder='Enter Your Location'
                    onChangeText={handleLocationSearch}
                    query={locationQuery}
                    onChangeValue={handleLocationSelect}
                    objectKey='place_name'
                />
                <AutoSearch
                    key={"autoSearchService"}
                    data={serviceSearch}
                    placeholder='Search for services'
                    query={serviceQuery}
                    onChangeText={handleServiceSearch}
                    onChangeValue={handleServiceSelect}
                    objectKey='name'
                />
                {
                    load ?
                        <View style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 750, width: "100%" }}>
                            <LottieView source={require("../../assets/images/service2.json")} loop={true} autoPlay style={{ width: 300, height: 350 }} />
                        </View> :
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
                            <View style={styles.serviceTitleContainer}>
                                <Text style={{ ...styles.title, ...generalStyle.text[colorScheme] }}>Search Result({services?.length})</Text>
                                <Text style={{ textDecorationLine: "underline", ...generalStyle.text[colorScheme] }}>See All</Text>
                            </View>
                            <View style={styles.serviceList}>
                                {
                                    load ? <Text>Loading...</Text> :
                                        services?.map((service, i) => (
                                            <ServiceCard service={service} key={i} width={"47%"} />
                                        ))
                                }
                            </View>
                        </ScrollView>
                }
            </View>
        </View>
    )
}

export default Search

const styles = StyleSheet.create({
    scrollViewContent: {
        paddingBottom: 320
    },
    searchContainer: {
        padding: 20,
        paddingTop: 90,
    },
    searchTitle: {
        fontSize: 18,
        fontWeight: 600,
        marginBottom: 20
    },
    serviceList: {
        marginTop: 20,
        display: "flex",
        gap: 10,
        flexDirection: "row",
        width: "100%",
        flexWrap: "wrap",
        paddingBottom: 300
    },
    title: {
        fontSize: 20,
        fontWeight: 700
    },
    serviceTitleContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
})