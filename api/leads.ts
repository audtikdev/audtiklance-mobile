import { AxiosError } from "axios";
import apiAxios from ".";

export const getLeads = async () => {
    try {
      const res = await apiAxios.get(`/leads/provider`);
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

export const sendLead = async (body: {provider: string, message: string}) => {
    try {
      const res = await apiAxios.post(`/leads`, body);
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

export const payLead = async (id: string, body: {amount: number}) => {
    try {
      const res = await apiAxios.post(`/leads/${id}/payment-link`, body);
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