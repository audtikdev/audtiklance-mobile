import { AxiosError } from "axios";
import apiAxios from ".";
import { ListingBody } from "@/types/listing";

export const createListing = async (body: FormData) => {
    try {
      const res = await apiAxios.post(`/listings`, body, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return {
        status: res.status,
        data: res.data,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        return {
          status: error?.response?.status,
          data: error?.response?.data,
        };
      } else {
        console.log(error);
      }
    }
  };

export const updateListing = async (body: any, id: string) => {
    try {
      const res = await apiAxios.put(`/listings/${id}`, body);
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

export const initiateListingPayment = async (id: string) => {
    try {
      const res = await apiAxios.post(`/listings/${id}/payment-link`);
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

export const deleteListing = async (id: string) => {
    try {
      const res = await apiAxios.delete(`/listings/${id}`);
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
      const res = await apiAxios.get(`/listings`);
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

export const getMyListing = async () => {
    try {
      const res = await apiAxios.get(`/listings`);
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
      const res = await apiAxios.get(`/listings/${id}`);
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