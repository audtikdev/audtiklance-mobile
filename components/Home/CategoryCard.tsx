import { Text, Image, ImageSourcePropType, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { router } from 'expo-router'

const CategoryCard: React.FC<{ category: { title: string, icon: string, keyWord: string } }> = ({ category }) => {

    return (
        <Pressable onPress={()=> router.push(`/(user)/search/type=category&value=${category?.keyWord}`)} style={{...styles.cardContainer}}>
            <Image style={styles.cardIcon} source={category?.icon as ImageSourcePropType} />
            <Text>{category?.title}</Text>
        </Pressable>
    )
}

export default CategoryCard

const styles = StyleSheet.create({
    cardContainer: {
        width: "25%",
        height: 100,
        backgroundColor: "#F9F9F8",
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