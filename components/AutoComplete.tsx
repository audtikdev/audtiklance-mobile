import { View, Text, TouchableOpacity, StyleSheet, TextInput, useColorScheme, FlatList, Pressable, Keyboard } from 'react-native'
import React, { useState } from 'react'
import { generalStyle } from '@/style/generalStyle';

const AutoSearch: React.FC<{ data: any, query: string, onChangeText: any, objectKey: string, onChangeValue: any, placeholder: string }> = ({ data, query, onChangeText, objectKey, onChangeValue, placeholder }) => {
    const colorScheme = useColorScheme() || "light"
    const [showList, setShowList] = useState(false)

    const renderItem = ({ item }: { item: any }) => (
        <Pressable onPress={()=> {Keyboard.dismiss; setShowList(false); onChangeValue(item)}} style={styles.item}>
            <Text>{item?.[objectKey]}</Text>
        </Pressable>
    );

    return (
        <View style={styles.container}>
            <TextInput onFocus={()=> setShowList(true)} onBlur={()=> setShowList(false)} placeholderTextColor={generalStyle.text[colorScheme].color} onChangeText={(text) => {showList === false && setShowList(true); onChangeText(text)}} value={query} style={{ ...styles.registerInput, ...generalStyle.border[colorScheme], ...generalStyle.text[colorScheme] }} placeholder={placeholder} />
           {showList && <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item, i) => `${item}-${i}`}
                style={styles.flatList}
                scrollEnabled={true}
                contentContainerStyle={{paddingBottom: 2}}
                keyboardShouldPersistTaps="always"
            />}
        </View>
    )
}

export default AutoSearch

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        width: "100%",
        position: "relative"
    },
    item: {
        backgroundColor: '#f8f8f8',
        padding: 15,
        marginVertical: 5,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    flatList: {
        height: "auto",
        maxHeight: 200,
        backgroundColor: "white",
        padding: 10,
        position: "absolute",
        top: 55,
        width: "100%",
        zIndex: 10
    },
    textField: {
        paddingLeft: 10,
        borderRadius: 5,
    },
    registerInput: {
        height: 45,
        borderWidth: 1,
        flexShrink: 1,
        width: '100%',
        marginBottom: 12,
        paddingLeft: 10,
        borderRadius: 5,
    },
});