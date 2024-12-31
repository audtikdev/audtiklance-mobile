import { View, Text, StyleSheet, useColorScheme } from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons'
import { generalStyle } from '@/style/generalStyle'
import { GoogleReview } from '@/types/service'

const ReviewCard: React.FC<{review: GoogleReview, truncate?: boolean}> = ({review, truncate = true}) => {
    const colorScheme = useColorScheme() || "light"

    return (
        <View style={styles.reviewContainer}>
            <View style={{ display: "flex", flexDirection: "row", columnGap: 5 }}>
                {
                    Array(review?.rating || 0).fill("")?.map((_, i) => (
                        <AntDesign key={i} name="star" size={20} color="blue" />
                    ))
                }
            </View>
            {/* <Text style={{ fontSize: 18, marginTop: 10, ...generalStyle.text[colorScheme] }}>This is what i was looking for</Text> */}
            <Text style={{ marginVertical: 5, color: colorScheme === "dark" ? "white" : "grey", }}>{review?.authorAttribution?.displayName} | {review?.relativePublishTimeDescription}</Text>
            <Text numberOfLines={truncate ? 5 : undefined} style={{ marginTop: 5, lineHeight: 20, ...generalStyle.text[colorScheme] }}>{review?.originalText?.text}</Text>
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