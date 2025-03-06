import { AxiosError } from "axios";
import apiAxios from ".";

export const createQuote = async (body: FormData) => {
  try {
    const res = await apiAxios.post(`/quote/`, body, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    
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
