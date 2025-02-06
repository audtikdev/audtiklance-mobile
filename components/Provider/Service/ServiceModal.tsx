import AutoSearch from "@/components/AutoComplete"
import { generalStyle } from "@/style/generalStyle"
import axios from "axios"
import { debounce } from "lodash"
import Constants from 'expo-constants'
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { ActivityIndicator, Button, Keyboard, Modal, Pressable, StyleSheet, Text, TextInput, useColorScheme, View } from "react-native"
import { Modalize } from "react-native-modalize"
import { IHandles } from "react-native-modalize/lib/options"
import { RegisterProvider } from "@/types/auth"
import { Service } from "@/types/service"
import { RootState } from "@/components/Store/store"
import { useDispatch, useSelector } from "react-redux"
import { updateServiceProfile } from "@/api/service"
import { updateAuth } from "@/components/Context/authProvider"

export const UpdateDetailModal: React.FC<{ showUpdateModal: boolean, setShowUpdateModal: any }> = ({ showUpdateModal, setShowUpdateModal }) => {
    const authUser = useSelector((state: RootState) => state.authProvider.auth)
    const colorScheme = useColorScheme() || "light"
    const [userInfo, setUserInfo] = useState<RegisterProvider>()
    const [query, setQuery] = useState("");
    const [locations, setLocations] = useState([]);
    const dispatch = useDispatch()
    const [load, setLoad] = useState(false)
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

    useEffect(() => {
        setUserInfo({
            business_name: authUser?.business_name
        })
    }, [])

    const handleInput = (type: string, value: string) => {
        setUserInfo((prevUserInfo) => ({
            ...prevUserInfo!,
            [type!]: value!,
        }));
    }

    const handleSearch = (text: string) => {
        setQuery(text);
    };

    const handleLocationSelect = (location: any) => {
        setUserInfo((prevUserInfo) => ({
            ...prevUserInfo!,
            address: location?.place_name!,
            longitude: location?.geometry?.coordinates[0],
            latitude: location?.geometry?.coordinates[1]
        }));
        setQuery(location?.place_name)
    }

    const updateBusinessDetail = async () => {
        setLoad(true)
        const response = await updateServiceProfile(userInfo!)
        dispatch(updateAuth({ auth: response?.data?.data }))
        setLoad(false)
        setShowUpdateModal(false)
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={showUpdateModal}
            onRequestClose={() => {
                setShowUpdateModal(false);
            }}
        >
            <Pressable onPress={()=> setShowUpdateModal(false)} style={styles.modalOverlay}>
                <View style={{ ...styles.addModalContent, height: 300 }}>
                    <Text style={{ ...styles.profileText }}>Update Your Business Details</Text>
                    <TextInput placeholderTextColor={"black"} onChangeText={(text) => handleInput("business_name", text)} value={userInfo?.business_name} style={{ ...styles.registerInput }} placeholder='Business Name' />
                    <AutoSearch
                        key={"autoSearch"}
                        data={locations}
                        placeholder='Location'
                        onChangeText={handleSearch}
                        query={query}
                        onChangeValue={handleLocationSelect}
                        objectKey='place_name'
                    />
                    <Pressable onPress={updateBusinessDetail} style={{ ...styles.registerButton, marginTop: 10 }}>
                        {
                            load ?
                                <ActivityIndicator size={"large"} color={"white"} /> :
                                <Text style={{ ...styles.buttonText, ...generalStyle.text["dark"] }}>Update</Text>
                        }
                    </Pressable>
                </View>
            </Pressable>
        </Modal>
    )
}

export const AddServiceModal: React.FC<{ priceRef: React.RefObject<IHandles>, setActiveService: Dispatch<SetStateAction<Service | undefined>>, showAddModal: boolean, setShowAddModal: any }> = ({ showAddModal, priceRef, setActiveService, setShowAddModal }) => {
    const colorScheme = useColorScheme() || "light"
    const [query, setQuery] = useState("");
    const [services, setServices] = useState<Service[]>([])
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
    }

    const selectService = () => {
        setShowAddModal(false)
        priceRef.current?.open()
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={showAddModal}
            onRequestClose={() => {
                setShowAddModal(false);
            }}
        >
            <Pressable onPress={()=> setShowAddModal(false)} style={styles.modalOverlay}>
                <View style={styles.addModalContent}>
                    <Text style={{ ...styles.profileText }}>Select A New Skill To Add</Text>
                    <AutoSearch
                        key={"autoSearch"}
                        data={services}
                        placeholder='Search for services'
                        query={query}
                        onChangeText={handleSearch}
                        onChangeValue={handleServiceSelect}
                        objectKey='name'
                    />
                    <Pressable onPress={selectService} style={{ ...styles.registerButton, marginTop: 10 }}>
                        <Text style={{ ...styles.buttonText, ...generalStyle.text["dark"] }}>Continue</Text>
                    </Pressable>
                </View>
            </Pressable>
        </Modal>
    )
}

export const ModifyPriceModal: React.FC<{ priceRef: React.RefObject<IHandles>, activeService: Service, setActiveService: Dispatch<SetStateAction<Service | undefined>> }> = ({ priceRef, activeService, setActiveService }) => {
    const colorScheme = useColorScheme() || "light"
    const authUser = useSelector((state: RootState) => state.authProvider.auth)
    const dispatch = useDispatch()
    const [load, setLoad] = useState(false)
    const handlePriceinput = (text: string) => {
        setActiveService((prev) => ({ ...prev!, price: Number(text) }))
    }

    const addService = async () => {
        setLoad(true)
        let arr;
        const previousService = authUser?.sub_category?.map((serv) => {
            if (serv?.sub_category_id === activeService?.id) {
                return {
                    skill: activeService?.id,
                    cost: activeService?.price,
                    time_frame: "HOURLY"
                }
            } else {
                return {
                    skill: serv?.sub_category_id,
                    cost: serv?.cost,
                    time_frame: "HOURLY"
                }
            }
        })
        if (previousService) {
            const skillExists = authUser?.sub_category?.some((skill) => skill.sub_category_id === activeService?.id);
            if (skillExists) {
                arr = [
                    ...previousService
                ]
            } else {
                arr = [
                    ...previousService,
                    {
                        skill: activeService?.id,
                        cost: activeService?.price,
                        time_frame: "HOURLY"
                    }
                ]
            }
        } else {
            arr = [
                {
                    skill: activeService?.id,
                    cost: activeService?.price,
                    time_frame: "HOURLY"
                }
            ]
        }
        const body = {
            skill_data: arr
        }
        const response = await updateServiceProfile(body)
        dispatch(updateAuth({ auth: response?.data?.data }))
        setLoad(false)
        priceRef.current?.close()
    }

    return (
        <Modalize
            ref={priceRef}
            adjustToContentHeight={true}
        >
            <View style={{ ...styles.modalContent, height: 550 }}>
                <View style={styles.activeServiceTitleContainer}>
                    <Text style={styles.activeServiceTitle}>{activeService?.name}</Text>
                </View>
                <Text style={styles.activeServiceText}>Pros with upfront pricing get hired more on Audtiklance.</Text>
                <Text style={styles.activeServiceText}>Add a base price to help you get contacted and hired more, The price will include: Labor (excludes cost of parts).</Text>
                <Text style={{ marginBottom: 5, marginTop: 10 }}>Enter your base price</Text>
                <TextInput placeholderTextColor={"black"} onChangeText={(text) => handlePriceinput(text)} value={String(activeService?.price || 0)} keyboardType='phone-pad' style={{ ...styles.registerInput }} placeholder='$0.00' />
                <View style={styles.buttonContainer}>
                    <Pressable onPress={() => priceRef.current?.close()} style={{ ...styles.cancelButton, width: "49%", marginTop: 0, backgroundColor: "white" }}><Text style={{ ...styles.buttonText, color: '#1B64F1' }}>Cancel</Text></Pressable>
                    <Pressable onPress={addService} style={{ ...styles.registerButton, width: "49%", marginTop: 0 }}>
                        {
                            load ?
                                <ActivityIndicator size={"large"} color={"white"} /> :
                                <Text style={{ ...styles.buttonText, ...generalStyle.text["dark"] }}>Continue</Text>
                        }
                    </Pressable>
                </View>
            </View>
        </Modalize>
    )
}

export const DeleteModal: React.FC<{ deleteRef: React.RefObject<IHandles>, activeService: Service }> = ({ deleteRef, activeService }) => {
    const colorScheme = useColorScheme() || "light"
    const authUser = useSelector((state: RootState) => state.authProvider.auth)
    const dispatch = useDispatch()
    const [load, setLoad] = useState(false)


    const deleteService = async () => {
        setLoad(true)
        const services = authUser?.sub_category?.map((serv)=> {
            return {
                skill: serv?.sub_category_id,
                cost: serv?.cost,
                time_frame: "HOURLY"
            }
        })?.filter((serv)=> serv?.skill !== activeService?.id)
        const body = {
            skill_data: services
        }
        const response = await updateServiceProfile(body)
        dispatch(updateAuth({ auth: response?.data?.data }))
        setLoad(false)
        deleteRef.current?.close()
    }

    return (
        <Modalize
            ref={deleteRef}
            adjustToContentHeight={true}
        >
            <View style={{ ...styles.modalContent, height: 410 }}>
                <View style={styles.activeServiceTitleContainer}>
                    <Text style={styles.activeServiceTitle}>{activeService?.name}</Text>
                </View>
                <Text style={{fontSize: 16, fontWeight: 600, textAlign: "center", marginTop: 25}}>Are you sure you want to delete this service?</Text>
                <Text style={{fontSize: 16, fontWeight: 600, textAlign: "center", marginTop: 10, marginBottom: 25}}>This action cannot be undone.</Text>
                <View style={styles.buttonContainer}>
                    <Pressable onPress={() => deleteRef.current?.close()} style={{ ...styles.cancelButton, width: "49%", marginTop: 0, backgroundColor: "white" }}><Text style={{ ...styles.buttonText, color: '#1B64F1' }}>Cancel</Text></Pressable>
                    <Pressable onPress={deleteService} style={{ ...styles.registerButton, width: "49%", marginTop: 0, backgroundColor: "#D0190A" }}>
                        {
                            load ?
                                <ActivityIndicator size={"large"} color={"white"} /> :
                                <Text style={{ ...styles.buttonText, ...generalStyle.text["dark"] }}>Delete</Text>
                        }
                    </Pressable>
                </View>
            </View>
        </Modalize>
    )
}

const styles = StyleSheet.create({
    modalContent: {
        padding: 20,
        height: 550,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
        backgroundColor: "#1B64F1",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    cancelButton: {
        width: "100%",
        height: 52,
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
        fontWeight: 600
    },
})