import { AxiosError } from "axios";
import apiAxios from ".";
import { ListingBody } from "@/types/listing";

export const createListing = async (body: ListingBody) => {
    try {
      const res = await apiAxios.post(`/job/`, body, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(res);
      
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

export const getAllListing = async () => {
    try {
      const res = await apiAxios.get(`/job/`);
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

export const getAListing = async (id: string) => {
    try {
      const res = await apiAxios.get(`/job/${id}`);
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