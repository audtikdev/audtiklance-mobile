import { Service } from "./service";

export type RegisterUserInfo = {
    firstname: string,
    lastname: string,
    email: string,
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
    password?: string;
    confirmPassword?: string;
    businessName?: string;
    phoneNumber?: string;
    location?: Location;
    description?: string;
    pictures?: Array<string>;
    previousWorkImages?: Array<string>
    services?: Array<Service>
}

export type AuthUser = {
    access?: string;
    refresh?: string;
} & RegisterProvider

export type LoginUserInfo = Pick<RegisterUserInfo, "email" | "password">