import { LoginUserInfo, RegisterUserInfo } from "@/types/auth";
import { AxiosError } from "axios";
import apiAxios from ".";

export const loginUser = async (body: LoginUserInfo) => {
  try {
    const res = await apiAxios.post("/user/login/", body);
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

export const sendOtp = async (body: {email: string}) => {
  try {
    const res = await apiAxios.post("/user/send-creation-email/", body);
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

export const registerUser = async (body: RegisterUserInfo) => {
  try {
    const res = await apiAxios.post("/user/", body);
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

export const sendForgotPasswordOtp = async (body: {email: string}) => {
  try {
    const res = await apiAxios.post("/user/reset-password/", body);
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

export const verifyOtp = async (body: {action: string, otp: string, secret_key: string}) => {
  try {
    const res = await apiAxios.post("/user/validate-otp/", body);
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

export const resetPassword = async (body: {password: string, otp: string, secret_key: string}) => {
  try {
    const res = await apiAxios.post("/user/create-password/", body);
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

export const getUser = async () => {
  try {
    const res = await apiAxios.get("/user/profile/");
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
