import { AxiosError } from "axios";
import apiAxios from ".";

export const addFavorite = async (id: string) => {
    try {
      const res = await apiAxios.post(`/service/${id}/add-favorite/`);
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

export const removeFavorite = async (id: string) => {
    try {
      const res = await apiAxios.post(`/service/${id}/remove-favorite/`);
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

export const getFavorites = async () => {
    try {
      const res = await apiAxios.get(`/service/favorites/`);
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