import { AxiosError } from "axios";
import apiAxios from ".";
import { RegisterProvider } from "@/types/auth";

export const getServiceProfile = async (id: string) => {
  try {
    const res = await apiAxios.get(`/businesses/${id}`);
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
    const res = await apiAxios.get(`/categories/${id}`);
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

export const updateServiceProfile = async (body: any, id: string) => {
  try {
    const res = await apiAxios.put(`/businesses/${id}`, body, {
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

export const createService = async (body: {categoryID?: string, price: string, businessID?: string}) => {
  try {
    const res = await apiAxios.post(`/services`, body);
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

export const updateService = async (body: {price: string}, id: string) => {
  try {
    const res = await apiAxios.put(`/services/${id}`, body);
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

export const deleteService = async (id: string, businessId: string) => {
  try {
    const res = await apiAxios.delete(`/services/${id}`, {
      params: {
        businessID: businessId,
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

export const deleteServiceImage = async (id: string, body: {imageUrl: string}) => {
  try {
    const res = await apiAxios.delete(`/businesses/${id}/previous-work-image`, {
      data: {
        imageUrl: body?.imageUrl,
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

export const reportService = async (body: {content: string}, id: string) => {
  try {
    const res = await apiAxios.post(`/service/${id}/report-service/`, body);
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

export const reviewService = async (body: {message: string, businessID: string, userID: string, rating: number}) => {
  try {
    const res = await apiAxios.post(`/reviews`, body);
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

export const getServiceReview = async (id: string) => {
  try {
    const res = await apiAxios.get(`/reviews/business/${id}`);
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
