export type RegisterUserInfo = {
    fullName: string,
    email: string,
    password: string,
    confirmPassword: string
}

export type LoginUserInfo = Pick<RegisterUserInfo, "email" | "password">