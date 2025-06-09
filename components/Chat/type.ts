import { RegisterUserInfo } from "@/types/auth";

export type CHAT = {
    _id: string;
    updatedAt: Date;
    lastMessage: MESSAGE;
    user: RegisterUserInfo
}

export type MESSAGE = {
    id: string;
    message: string;
    isSender: boolean;
    sender: RegisterUserInfo,
    createdAt: Date;
    updatedAt: Date;
}