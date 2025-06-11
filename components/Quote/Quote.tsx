import { View, Text, StyleSheet, Modal, Pressable, TextInput, ImageBackground, Alert, Platform, Keyboard } from 'react-native'
import React, { useState } from 'react'
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AntDesign, Feather } from '@expo/vector-icons';
import { generalStyle } from '@/style/generalStyle';
import { createQuote } from '@/api/quote';
import Toast from 'react-native-toast-message';
import { ActivityIndicator } from 'react-native-paper';

const Quote: React.FC<{ showModal: boolean, setShowModal: any, serviceID: string }> = ({ showModal, setShowModal, serviceID }) => {
    const [image, setImage] = useState("")
    const [description, setDescription] = useState("")
    const [date, setDate] = useState(new Date());
    const [load, setLoad] = useState(false)
    const [showDate, setShowDate] = useState(Platform.OS !== 'android')

    const onChange = (event: any, selectedDate: Date | undefined) => {
        if (Platform.OS === 'android') {
            setShowDate(false);
        }
        const currentDate = selectedDate || date;
        setDate(currentDate);
    };

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

    const submitQuote = async () => {
        setLoad(true)
        const body = {
            provider: serviceID,
            message: description,
            deadline: date.toISOString()?.split('T')[0],
            type: "quote"
        }
        const formData = new FormData()
        Object.entries(body).forEach(([key, value]) => {
            formData.append(key, value as string)
        })

        let filename = image.split('/').pop();

        let match = /\.(\w+)$/.exec(filename!);
        let type = match ? `image/${match[1]}` : `image`;
        if (image) {        
            // @ts-ignore
            formData.append('images0', { uri: image, name: filename, type });
        }
        
        const res = await createQuote(body)
        console.log(res);
        
        if (res?.status === 201 || res?.status === 200) {
            Toast.show({
                type: 'success',
                text1: 'Quote sent successfully'
            })
        } else {
            Toast.show({
                type: 'error',
                text1: 'An error occured, try again'
            })
        }
        setLoad(false)
        setShowModal(false);
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
                <Pressable onPress={e => {e.stopPropagation(); Keyboard.dismiss()}} style={styles.addModalContent}>
                    <Text style={{ ...styles.profileText }}>Get a free quote</Text>
                    <View style={{ ...styles.inputContainer, marginBottom: 10 }}>
                        <Text style={styles.inputText}>Deadline</Text>
                        {Platform.OS === 'android' && <Pressable style={{ display: 'flex', flexDirection: 'row', columnGap: 5, alignItems: 'center' }} onPress={() => setShowDate(true)}>
                            <Text>{date?.toLocaleString()}</Text>
                            <Feather name="edit" size={14} color="black" />
                        </Pressable>}
                        {showDate && <DateTimePicker
                            value={date}
                            mode="date"
                            display="default"
                            onChange={onChange}
                        />}
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputText}>Job Description</Text>
                        <TextInput onChangeText={(text) => setDescription(text)} multiline numberOfLines={5} placeholderTextColor={"black"} style={{ ...styles.registerInput, height: 120, padding: 10 }} placeholder='Give a detailed description of what this job is about...' />
                    </View>
                    <Pressable onPress={handleImageSelect} style={{ ...styles.uploadView }}>
                        {
                            image ?
                                <ImageBackground source={{ uri: image }} style={styles.background}>
                                    <AntDesign name="upload" size={30} color={"white"} />
                                    <Text style={{ fontSize: 18, ...generalStyle.text.dark }}>Upload image</Text>
                                </ImageBackground>
                                :
                                <>
                                    <AntDesign name="upload" size={30} color={"black"} />
                                    <Text style={{ fontSize: 18 }}>Upload image</Text>
                                </>
                        }
                    </Pressable>
                    <Pressable onPress={submitQuote} style={{ ...styles.registerButton, marginTop: 10 }}>
                        {
                            load ?
                                <ActivityIndicator color={"white"} size={"small"} /> :
                                <Text style={{ ...styles.buttonText, ...generalStyle.text["dark"] }}>Send Quote</Text>
                        }
                    </Pressable>
                </Pressable>
            </Pressable>
        </Modal>
    )
}

export default Quote

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-start',
        paddingTop: 150,
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    addModalContent: {
        width: "90%",
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalText: {
        marginBottom: 15,
        fontSize: 18,
    },
    inputContainer: {
        width: "100%"
    },
    inputText: {
        fontSize: 13,
        fontWeight: 400,
        marginBottom: 10
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
    modalContent: {
        padding: 20,
        height: 530,
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
    buttonText: {
        fontSize: 18,
        fontWeight: 600,
        color: "white"
    },
})