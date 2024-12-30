import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native'
import React from 'react'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import ReviewCard from '@/components/Review/ReviewCard'

const Reviews = () => {
    return (
        <ScrollView style={styles.container}>
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                <Pressable onPress={() => router.back()} style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Ionicons name="chevron-back-outline" size={24} color="black" />
                    <Text style={{ fontSize: 18 }}>Back</Text>
                </Pressable>
                <Text style={{fontSize: 18, fontWeight: 600}}>Rejoice Plumbing Service</Text>
            </View>
            <View style={{marginTop: 20}}>
                {
                    Array(5).fill("")?.map((_, i) => (
                        <ReviewCard key={i} />
                    ))
                }
            </View>
        </ScrollView>
    )
}

export default Reviews

const styles = StyleSheet.create({
    container: {
        paddingTop: 90,
        paddingHorizontal: 20,
        marginBottom: 30,
        height: "95%"
    },
})