
export type LEAD = {
    id?: string,
    message: string,
    paid: boolean,
    service_profile: string,
    user: {
        firstname: string,
        lastname: string,
        id: string,
        profile_picture: string
    },
    created_at?: string
    updated_at?: string
}