import { View, Text, StyleSheet, useColorScheme } from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons'
import { generalStyle } from '@/style/generalStyle'

const ReviewCard = () => {
    const colorScheme = useColorScheme() || "light"

    return (
        <View style={styles.reviewContainer}>
            <View style={{ display: "flex", flexDirection: "row", columnGap: 5 }}>
                {
                    Array(5).fill("")?.map((_, i) => (
                        <AntDesign key={i} name="star" size={20} color="blue" />
                    ))
                }
            </View>
            <Text style={{ fontSize: 18, marginTop: 10, ...generalStyle.text[colorScheme] }}>This is what i was looking for</Text>
            <Text style={{ marginVertical: 5, color: colorScheme === "dark" ? "white" : "grey", }}>David Beckham | May 05 2024</Text>
            <Text style={{ marginTop: 5, lineHeight: 20, ...generalStyle.text[colorScheme] }}>This was my first time trying this service provider, and they did exceedingly well</Text>
        </View>
    )
}

export default ReviewCard


const styles = StyleSheet.create({
    reviewContainer: {
        width: "100%",
        marginTop: 14,
        padding: 14,
        borderRadius: 6,
        borderWidth: 0.5,
        borderColor: "#08080830",
        boxShadow: "-6px 3px 24px -12px rgba(151,144,144,0.75)"
    },
})