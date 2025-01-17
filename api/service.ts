import { AxiosError } from "axios";
import apiAxios from ".";
import { RegisterProvider } from "@/types/auth";

export const getServiceProfile = async (id: string) => {
  try {
    const res = await apiAxios.get(`/service/${id}/`);
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

export const getCategory = async (id: string) => {
  try {
    const res = await apiAxios.get(`/category/${id}/`);
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

export const updateServiceProfile = async (body: any) => {
  try {
    const res = await apiAxios.patch(`/service/update-service-profile/`, body);
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

export const updateServiceImage = async (body: any) => {
  try {
    const res = await apiAxios.patch(`/service/update-service-profile/`, body, {
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
