import { View, Text, Image, ImageSourcePropType, StyleSheet, Pressable, useColorScheme } from 'react-native'
import React from 'react'
import { generalStyle } from '@/style/generalStyle'
import { router } from 'expo-router'

const CategoryCard: React.FC<{ category: { title: string, icon: string, keyWord: string } }> = ({ category }) => {
    const colorScheme = useColorScheme() || "light"

    return (
        <Pressable onPress={()=> router.push(`/(user)/search/type=category&value=${category?.keyWord}`)} style={{...styles.cardContainer, ...generalStyle.background[colorScheme]}}>
            <Image style={styles.cardIcon} source={category?.icon as ImageSourcePropType} />
            <Text style={{ ...generalStyle.text[colorScheme]}}>{category?.title}</Text>
        </Pressable>
    )
}

export default CategoryCard

const styles = StyleSheet.create({
    cardContainer: {
        width: "25%",
        height: 100,
        backgroundColor: "white",
        borderRadius: 8,
        display: "flex",
        justifyContent: "space-between",
        padding: 8
    },
    cardIcon: {
        width: 40,
        height: 40
    }
})