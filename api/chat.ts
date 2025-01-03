import { AxiosError } from "axios";
import apiAxios from ".";

export const getChatList = async () => {
    try {
      const res = await apiAxios.get("/conversation/");
      return {
        status: res.status,
        data: res.data,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        return {
          status: error?.response?.status,
          data: error?.response?.data?.error,
        };
      } else {
        console.log(error);
      }
    }
  };