import { Service } from "./service";

export type RegisterUserInfo = {
    fullName: string,
    email: string,
    password: string,
    confirmPassword: string
}

export type Location = {
    place_name?: string
}

export type RegisterProvider = {
    fullName?: string;
    email?: string;
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

export type LoginUserInfo = Pick<RegisterUserInfo, "email" | "password">