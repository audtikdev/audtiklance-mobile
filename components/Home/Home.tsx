import { View, Text, StyleSheet, useColorScheme } from 'react-native'
import React from 'react'
import { generalStyle } from '@/style/generalStyle'
import { popularCategories } from '@/data/home'
import CategoryCard from './CategoryCard'

const Home = () => {
    const colorScheme = useColorScheme() || "light"
    return (
        <View style={styles.container}>
            <View style={styles.heroText}>
                <Text style={{ ...styles.title, ...generalStyle.text.light }}>Hi Rejoice</Text>
                <Text style={{ ...styles.greeting, ...generalStyle.text.light }}>What services do you need?</Text>
            </View>
            <View style={{ paddingHorizontal: 20, marginTop: 20}}>
                <Text style={{ ...styles.title, ...generalStyle.text.light }}>Popular Category</Text>
                <View style={styles.categoryList}>
                    {
                        popularCategories?.map((category, i)=> (
                            <CategoryCard key={i} category={category} />
                        ))
                    }
                </View>
            </View>
        </View>
    )
}

export default Home

const styles = StyleSheet.create({
    container: {
    },
    heroText: {
        paddingTop: 90,
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: "#bde0fe"
    },
    title: {
        fontSize: 20,
        fontWeight: 700
    },
    greeting: {
        fontSize: 18,
        fontWeight: 500,
        marginTop: 10
    },
    categoryList: {
        display: "flex",
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
        marginTop: 20,
        width: "100%",
        overflowX: "scroll"
    }
});