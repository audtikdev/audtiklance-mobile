
export type Service = {
    id?: string,
    name: string,
    profile_picture?: string,
    business_name?: string,
    about_me?: string,
    sub_category?: Array<{
        cost: number,
        sub_category: string,
        id: string,
        time_frame: string
    }>,
    address?: string
}