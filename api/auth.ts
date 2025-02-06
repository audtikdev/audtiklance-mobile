import { LoginUserInfo, RegisterProvider, RegisterUserInfo } from "@/types/auth";
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

export const googleRegisterUser = async (body: {access_token: string}) => {
  try {
    const res = await apiAxios.post("https://api.audtiklance.com/google/", body);
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

export const appleRegisterUser = async (body: {email: string, firstname: string, lastname: string}) => {
  try {
    const res = await apiAxios.post("/apple/sign_in/", body, {
      headers: {
        'X-HMAC-Signature': 'eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM4Nzk1NzkwLCJpYXQiOjE3Mzg3MDkzOTAsImp0aSI6ImUxY2RhZ',
        'X-HMAC-Timestamp': Date.now()
    }
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

export const registerProvider = async (body: FormData) => {
  try {
    const res = await apiAxios.post("/service/", body, {
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

export const getUserByID = async (id: string) => {
  try {
    const res = await apiAxios.get(`/user/${id}/`);
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


export const updateUser = async (body: Pick<RegisterUserInfo, "firstname" | "lastname" | "phone" | "country_code">) => {
  try {
    const res = await apiAxios.put("/user/update-profile/", body);
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

export const updatePassword = async (body: {old_password: string, new_password: string}) => {
  try {
    const res = await apiAxios.post("/user/update-password/", body);
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
    const res = await apiAxios.delete("/user/delete-profile/");
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
    const res = await apiAxios.patch("/user/update-notification-setting/", {
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