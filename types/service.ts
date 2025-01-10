export type GoogleReview = {
    authorAttribution?: {
        displayName: string
    },
    originalText?: {
        text: string
    },
    rating?: number,
    relativePublishTimeDescription?: string
}

export type Service = {
    id?: string,
    name: string,
    profile_picture?: string,
    business_name?: string,
    about_me?: string,
    phone?: string,
    price?: number,
    owner_id: string,
    sub_category?: Array<{
        cost: string,
        sub_category: string,
        id: string,
        time_frame: string
    }>,
    address?: string,
    is_google_place?: boolean,
    external_rating?: string,
    external_reviews?: Array<GoogleReview>
}