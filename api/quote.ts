import { AxiosError } from "axios";
import apiAxios from ".";

export const createQuote = async (body: {provider: string, message: string, deadline: string, type: string}) => {
  try {
    const res = await apiAxios.post(`/leads`, body);
    
    return {
      status: res.status,
      data: res.data
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        status: error?.response?.status,
        data: error?.response?.data
      };
    } else {
      console.log(error);
    }
  }
};
