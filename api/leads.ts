import { AxiosError } from "axios";
import apiAxios from ".";

export const getLeads = async () => {
    try {
      const res = await apiAxios.get(`/lead/`);
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

export const sendLead = async (body: {service_profile: string, message: string}) => {
    try {
      const res = await apiAxios.post(`/lead/`, body);
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