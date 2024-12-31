import { View, Text, StyleSheet, ScrollView, TextInput, useColorScheme, Image } from 'react-native'
import React, { useState } from 'react'
import { generalStyle } from '@/style/generalStyle'

const Chat = () => {
    const colorScheme = useColorScheme() || "light"
    const [searchValue, setSearchValue] = useState("")
    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 24, fontWeight: 600 }}>Chat</Text>
            <TextInput placeholderTextColor={generalStyle.text[colorScheme].color} onChangeText={(text) => setSearchValue(text)} value={searchValue} style={{ ...styles.registerInput, ...generalStyle.border[colorScheme], ...generalStyle.text[colorScheme] }} placeholder='Search...' />
            <ScrollView showsVerticalScrollIndicator={false} style={{ width: "100%" }}>
                {
                    Array(10).fill("")?.map((_, i) => (
                        <View key={i} style={styles.chatContainer}>
                            <Image style={styles.image} source={require("../../assets/images/react-logo.png")} />
                            <View style={{ width: "100%" }}>
                                <View style={styles.nameView}>
                                    <Text>Rejoice Uahomo</Text>
                                    <Text>{new Date().getHours()}:{new Date().getMinutes()}</Text>
                                </View>
                                <Text style={styles.text} numberOfLines={1}>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ad, dolore delectus deleniti</Text>
                            </View>
                        </View>
                    ))
                }
            </ScrollView>
        </View>
    )
}

export default Chat

const styles = StyleSheet.create({
    container: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        height: "100%",
        width: "100%",
        padding: 15,
        paddingTop: 80,
        paddingBottom: 100
    },
    registerInput: {
        height: 50,
        borderWidth: 1,
        flexShrink: 1,
        width: '100%',
        marginBottom: 20,
        paddingLeft: 10,
        borderRadius: 5,
        marginTop: 20
    },
    chatContainer: {
        display: "flex",
        flexDirection: "row",
        columnGap: 10,
        alignItems: "center",
        width: "100%",
        padding: 10
    },
    nameView: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "86%"
    },
    image: {
        borderRadius: "100%",
        width: 50,
        height: 50,
    },
    text: {
        width: "86%",
        fontSize: 14,
        fontWeight: 600,
        marginTop: 7
    }
})