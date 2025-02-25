import { AxiosError } from "axios";
import apiAxios from ".";
import { ListingBody } from "@/types/listing";

export const createListing = async (body: FormData) => {
    try {
      const res = await apiAxios.post(`/job/`, body, {
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

export const updateListing = async (body: Partial<ListingBody>, id: string) => {
    try {
      const res = await apiAxios.patch(`/job/${id}/`, body, {
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
          data: error?.response?.data?.error,
        };
      } else {
        console.log(error);
      }
    }
  };

export const initiateListingPayment = async (id: string) => {
    try {
      const res = await apiAxios.post(`/job/${id}/initiate-payment/`);
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
      const res = await apiAxios.delete(`/job/${id}/`);
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

export const getMyListing = async () => {
    try {
      const res = await apiAxios.get(`/job/my-jobs/`);
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
      const res = await apiAxios.get(`/job/${id}/`);
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