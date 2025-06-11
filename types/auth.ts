import { BusinessType } from "./service";

export type RegisterUserInfo = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  aboutMe: string;
  password: string;
  confirmPassword?: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  profilePicture: string;
  favoriteBusinesses: string[];
  business: Omit<BusinessType, "provider">;
  notify: boolean;
};

export type Location = {
  place_name?: string;
};

export type RegisterProvider = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  profilePicture: string;
  latitude?: string;
  longitude?: string;
  previousWorkImages: string[];
  skill_data: {
    skill: string;
    cost: string;
    time_frame: string;
  }[];
} & BusinessType;

export type AuthUser = {
  token?: string;
  user?: RegisterUserInfo;
};

export type LoginUserInfo = Pick<RegisterUserInfo, "email" | "password">;

export type NOTIFICATION = {
  id: string;
  title: string;
  message: string;
  createdAt: Date;
  isRead: boolean;
  type: string;
  sender: RegisterUserInfo;
};
