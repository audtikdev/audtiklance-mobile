import { RegisterProvider, RegisterUserInfo } from "./auth";

export type LEAD = {
  id?: string;
  message: string;
  isPaid: boolean;
  user: RegisterUserInfo;
  provider: RegisterProvider;
}