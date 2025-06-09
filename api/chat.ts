import { AxiosError } from "axios";
import apiAxios from ".";

export const getChatList = async () => {
    try {
      const res = await apiAxios.get("/chat/conversations");
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

export const createConversation = async (body: {receiverId: string}) => {
    try {
      const res = await apiAxios.post("/chat/initiate-chat", body);
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
      const res = await apiAxios.get(`/chat/${id}/history`);
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
      const res = await apiAxios.post(`/chat/${id}/send-message`, body);
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
      const res = await apiAxios.post(`/chat/${id}/block-user`);
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
      const res = await apiAxios.post(`/chat/${id}/report-user`, body);
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

