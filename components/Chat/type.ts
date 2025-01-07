export type CHAT_USER = {
    firstname: string;
    id: string;
    lastname: string;
    profile_picture: string
}

export type CHAT = {
    id: string;
    last_message_content: string;
    last_message_time: Date;
    updated_at: Date;
    recipient: CHAT_USER
}

export type MESSAGE = {
    id: string;
    content: string;
    conversationID: string;
    is_sender: boolean;
    receiver: CHAT_USER,
    sender: CHAT_USER,
    updated_at: Date;
}