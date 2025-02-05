import { View, Text, StyleSheet, useColorScheme } from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons'
import { Review } from '@/types/service'

const OurReview: React.FC<{review: Review, truncate?: boolean}> = ({review, truncate = true}) => {
    
    return (
        <View style={styles.reviewContainer}>
            <View style={{ display: "flex", flexDirection: "row", columnGap: 5, marginBottom: 5 }}>
                {
                    Array(review?.rating || 0).fill("")?.map((_, i) => (
                        <AntDesign key={i} name="star" size={20} color="blue" />
                    ))
                }
            </View>
            <Text style={{ marginVertical: 5, color: "grey", }}>{review?.reviewer?.firstname} {review?.reviewer?.lastname} | {new Date(review?.created_at)?.toLocaleDateString()}</Text>
            <Text numberOfLines={truncate ? 5 : undefined} style={{ marginTop: 5, lineHeight: 20 }}>{review?.comment}</Text>
        </View>
    )
}

export default OurReview


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