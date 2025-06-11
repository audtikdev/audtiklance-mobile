import { View, Text, ScrollView, StyleSheet, useColorScheme, FlatList, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import AutoSearch from '../AutoComplete'
import { debounce } from 'lodash';
import axios from 'axios';
import Constants from 'expo-constants'
import { BusinessType, CategoryType } from '@/types/service';
import ServiceCard from '../Home/ServiceCard';
import { useSelector } from 'react-redux';
import { RootState } from '../Store/store';
import { LocationData } from '../Context/types';
import LottieView from 'lottie-react-native';

const Search: React.FC<{ query: string }> = ({ query }) => {
    const colorScheme = useColorScheme() || "light"
    const userLocation = useSelector((state: RootState) => state.locationProvider.location)
    const [locationQuery, setLocationQuery] = useState("");
    const [serviceQuery, setServiceQuery] = useState("");
    const [locations, setLocations] = useState([]);
    const [location, setLocation] = useState<LocationData>();
    const [services, setServices] = useState<BusinessType[]>([])
    const [serviceSearch, setServiceSearch] = useState<BusinessType[]>([])
    const [service, setService] = useState<{ name: string }>()
    const [load, setLoad] = useState(false)
    const [isLoading, setisLoading] = useState(false)
    const [topService, setTopService] = useState(false)
    const [page, setPage] = useState(1)
    

    const mapKey = Constants.expoConfig?.extra?.MAPBOX_KEY
    const baseUrl = Constants.expoConfig?.extra?.BASE_API
    useEffect(() => {
        if (userLocation) {
            // setLocationQuery("Your Location")
            // setLocation(userLocation)
        }
    }, [userLocation])

    useEffect(() => {
        if (query) {
            const getQuery = query?.split("&")
            const getType = getQuery?.[0]?.split("=")
            const getValue = getQuery?.[1]?.split("=")
            if (getType?.[1] === "category") {
                setService({ name: getValue[1] })
                setServiceQuery(getValue[1])
                setTopService(false)
            }
            if (getType?.[1] === "location") {
                setLocation(userLocation!)
                setService({ name: "a" })
                setServiceQuery("")
                setTopService(false)
            }
            if (getType?.[1] === "top") {
                setTopService(true)
                setServiceQuery("")
                setService({ name: "" })
            }
        } else {
            setService({ name: "a" })
        }
    }, [query])

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
                const url = `${baseUrl}/categories/search?q=${serviceQuery}`;
                axios.get(url)
                    .then((response: any) => {
                        setServiceSearch(response.data);
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
        setPage(1)
        axios.get(`${baseUrl}/businesses/search`, {
            params: {
                q: serviceQuery,
                lng: location?.coords?.longitude || "",
                lat: location?.coords?.latitude || ""
            }
        })
            .then((response: any) => {
                setServices(response.data);
                setLoad(false)
            })
            .catch((error: any) => {
                console.error("getServices", error);
                setLoad(false)
            });
    }, [location, serviceQuery])

    useEffect(() => {
        if (page > 1) {
            setisLoading(true)
            axios.get(`${baseUrl}/businesses/search`, {
                params: {
                    q: serviceQuery,
                    lng: location?.coords?.longitude || "",
                    lat: location?.coords?.latitude || ""
                }
            })
                .then((response: any) => {
                    setServices([...services, ...response.data]);
                    setLoad(false)
                })
                .catch((error: any) => {
                    console.error("getServices", error);
                    setLoad(false)
                });
            setisLoading(false)
        }

    }, [page])

    const handleLocationSearch = (text: string) => {
        setLocationQuery(text);
        if (text === "") {
            setLocation(undefined)
        }
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

    const handleServiceSelect = (service: CategoryType) => {
        setService(service)
        setServiceQuery(service?.name)
    }


    const renderFooter = () => {
        if (!isLoading) return null;
        return <ActivityIndicator size="large" color="#0000ff" />;
    };

    return (
        <View>
            <View style={styles.searchContainer}>
                <Text style={{ ...styles.searchTitle }}>Search For Any Service</Text>
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
                        <View style={{ marginBottom: 200, paddingBottom: 200 }}>
                            <View style={styles.serviceTitleContainer}>
                                <Text style={{ ...styles.title }}>Search Result({services?.length})</Text>
                                <Text style={{ textDecorationLine: "underline" }}>See All</Text>
                            </View>
                            <FlatList
                                data={services}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => <ServiceCard service={item} width={"48%"} />}
                                onEndReached={() => setPage(page + 1)}
                                onEndReachedThreshold={0.2}
                                ListFooterComponent={renderFooter}
                                numColumns={2}
                                contentContainerStyle={styles.listContainer}
                                showsVerticalScrollIndicator={false}
                            />
                        </View>
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
    listContainer: {
        // padding: 10
        // height: "138%"
        paddingBottom: 500
    },
    searchContainer: {
        padding: 20,
        paddingTop: 90,
        backgroundColor: "white"
    },
    searchTitle: {
        fontSize: 16,
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
        fontSize: 17,
        fontWeight: 700
    },
    serviceTitleContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10
    },
})