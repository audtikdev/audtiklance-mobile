import { store } from "@/components/Store/store";
import axios from "axios";
import Constants from 'expo-constants'

const baseURL = Constants.expoConfig?.extra?.BASE_API
const apiAxios = axios.create({
     baseURL,
     headers: {
          "Content-Type": "application/json",
     },
});

apiAxios.interceptors.request.use(
     (config) => {
          const rootState = store.getState();
          const authState = rootState.authProvider.auth;
          if (authState?.access) {
               config.headers.Authorization = `Bearer ${authState.access}`;
          }
          return config;
     },
     (error) => {
          return Promise.reject(error);
     },
);

export default apiAxios;
