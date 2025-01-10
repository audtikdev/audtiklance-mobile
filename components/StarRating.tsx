import { View, Text, StyleSheet, useColorScheme } from 'react-native'
import React, { Dispatch, SetStateAction } from 'react'
import { Entypo, EvilIcons, FontAwesome } from '@expo/vector-icons'

const StarRating: React.FC<{rating: number, setRating: Dispatch<SetStateAction<number>>}> = ({rating, setRating}) => {
    const colorScheme = useColorScheme() || "light"

    return (
        <View style={{ ...styles.columnDisplay }}>
            {
                Array(5).fill("").map((_, i) => (
                    <View style={{width: 30}} key={i}>
                        {
                            i < rating ?
                                <FontAwesome onPress={() => setRating(i + 1)} name="star" size={30} color={colorScheme === "dark" ? "#1B64F1" : "black"} /> :
                                <FontAwesome onPress={() => setRating(i + 1)} name="star-o" size={30} color={colorScheme === "dark" ? "white" : "black"} />
                        }
                    </View>
                ))
            }
        </View>
    )
}

export default StarRating

const styles = StyleSheet.create({
    columnDisplay: {
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        columnGap: 10
    },
})