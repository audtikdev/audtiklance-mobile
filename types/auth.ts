import { SubCategory } from "./service";

export type RegisterUserInfo = {
    firstname: string,
    lastname: string,
    email: string,
    gender?: string,
    about_me?: string;
    dob?: string;
    password: string,
    confirmPassword: string,
    otp?: string,
    phone?: string,
    country_code?: string,
    post_code?: string,
    secret_key?: string
}

export type Location = {
    place_name?: string
}

export type RegisterProvider = {
    firstname?: string;
    lastname?: string;
    email?: string;
    phone?: string,
    gender?: string;
    password?: string;
    confirmPassword?: string;
    business_name?: string;
    address?: string;
    longitude?: string;
    latitude?: string;
    otp?: string;
    dob?: string;
    secret_key?: string;
    about_me?: string;
    images?: Array<{image_url: string}>;
    profile_picture?: string;
    skill_data?: Array<{
        skill?: string;
        cost?: number;
        time_frame?: string;
    }>
}

export type AuthUser = {
    access?: string;
    refresh?: string;
    notify?: boolean;
    service_profile?: string;
    sub_category?: Array<SubCategory>
} & RegisterProvider

export type LoginUserInfo = Pick<RegisterUserInfo, "email" | "password">

export type NOTIFICATION = {
    id: string;
    notification_message: string;
    created_at: Date;
    is_read: string;
    notification_type: string;
    owner: string;
}