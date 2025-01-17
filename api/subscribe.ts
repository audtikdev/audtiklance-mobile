import { AxiosError } from "axios";
import apiAxios from ".";


export const getSubscriptionPlan = async () => {
    try {
      const res = await apiAxios.get(`/subscription-plan/`);
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


export const subscribePlan = async (id: string, body: {amount: string}) => {
    try {
      const res = await apiAxios.post(`/subscription-plan/${id}/subscribe/`, body);
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