import { AxiosError } from "axios";
import apiAxios from ".";

export const getChatList = async () => {
    try {
      const res = await apiAxios.get("/conversation/");
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

export const createConversation = async (body: {user: string}) => {
    try {
      const res = await apiAxios.post("/conversation/", body);
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

export const getPreviousConversation = async (id: string) => {
    try {
      const res = await apiAxios.get(`/conversation/${id}/messages/`);
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

export const sendMessage = async (id: string, body: {content: string}) => {
    try {
      const res = await apiAxios.post(`/conversation/${id}/send-message/`, body);
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

export const blockUser = async (id: string) => {
    try {
      const res = await apiAxios.post(`/user/${id}/block-user/`);
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

export const reportUser = async (body: {content: string}, id: string) => {
    try {
      const res = await apiAxios.post(`/user/${id}/report-user/`, body);
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

