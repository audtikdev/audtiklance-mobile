import { LoginUserInfo, RegisterProvider, RegisterUserInfo } from "@/types/auth";
import { AxiosError } from "axios";
import apiAxios from ".";

export const loginUser = async (body: LoginUserInfo) => {
  try {
    const res = await apiAxios.post("/auth/login", body);
    return {
      status: res.status,
      data: res.data,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        status: error?.response?.status,
        data: error?.response?.data?.message,
      };
    } else {
      console.log(error);
    }
  }
};

export const sendOtp = async (body: {email: string}) => {
  try {
    const res = await apiAxios.post("/businesses/send-otp", body);
    return {
      status: res.status,
      data: res.data,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        status: error?.response?.status,
        data: error?.response?.data?.message,
      };
    } else {
      console.log(error);
    }
  }
};

export const registerUser = async (body: Partial<RegisterUserInfo>) => {
  try {
    const res = await apiAxios.post("/auth/register", body);
    return {
      status: res.status,
      data: res.data,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        status: error?.response?.status,
        data: error?.response?.data?.message,
      };
    } else {
      console.log(error);
    }
  }
};

export const googleRegisterUser = async (body: {accessToken: string}) => {
  try {
    const res = await apiAxios.post("https://api.audtiklance.com/auth/google", body);
    return {
      status: res.status,
      data: res.data,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        status: error?.response?.status,
        data: error?.response?.data?.message,
      };
    } else {
      console.log(error);
    }
  }
};

export const appleRegisterUser = async (body: {email: string, firstName: string, lastName: string, sub?: string}) => {
  try {
    const res = await apiAxios.post("/auth/apple", body);
    return {
      status: res.status,
      data: res.data,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        status: error?.response?.status,
        data: error?.response?.data?.message,
      };
    } else {
      console.log(error);
    }
  }
};

export const registerProvider = async (body: FormData) => {
  try {
    const res = await apiAxios.post("/businesses", body, {
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
        data: error?.response?.data?.message,
      };
    } else {
      console.log(error);
    }
  }
};

export const sendForgotPasswordOtp = async (body: {email: string}) => {
  try {
    const res = await apiAxios.post("/auth/forgot-password", body);
    return {
      status: res.status,
      data: res.data,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        status: error?.response?.status,
        data: error?.response?.data?.message,
      };
    } else {
      console.log(error);
    }
  }
};

export const verifyOtp = async (body: {action: string, otp: string, secret_key: string}) => {
  try {
    const res = await apiAxios.post("/auth/verify-otp", body);
    return {
      status: res.status,
      data: res.data,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        status: error?.response?.status,
        data: error?.response?.data?.message,
      };
    } else {
      console.log(error);
    }
  }
};

export const resetPassword = async (body: {password: string, otp: string, secret_key: string}) => {
  try {
    const res = await apiAxios.post("/auth/reset-password", body);
    return {
      status: res.status,
      data: res.data,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        status: error?.response?.status,
        data: error?.response?.data?.message,
      };
    } else {
      console.log(error);
    }
  }
};

export const getUser = async () => {
  try {
    const res = await apiAxios.get("/auth/profile");
    return {
      status: res.status,
      data: res.data,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        status: error?.response?.status,
        data: error?.response?.data?.message,
      };
    } else {
      console.log(error);
    }
  }
};

export const getUserByID = async (id: string) => {
  try {
    const res = await apiAxios.get(`/auth/${id}`);
    return {
      status: res.status,
      data: res.data,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        status: error?.response?.status,
        data: error?.response?.data?.message,
      };
    } else {
      console.log(error);
    }
  }
};


export const updateUser = async (body: any) => {
  try {
    const res = await apiAxios.put("/auth/profile", body, {
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

export const updatePassword = async (body: {currentPassword: string, newPassword: string}) => {
  try {
    const res = await apiAxios.put("/auth/password", body);
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

export const deleteAccount = async () => {
  try {
    const res = await apiAxios.delete("/auth/profile");
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

export const updateNotification = async (status: boolean) => {
  try {
    const res = await apiAxios.patch("/auth/profile", {
      enable_notification: status
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

export const getNotification = async () => {
  try {
    const res = await apiAxios.get("/notifications");
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

export const referUser = async (body: {email: string}) => {
  try {
    const res = await apiAxios.post("/user/refer-user/", body);
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