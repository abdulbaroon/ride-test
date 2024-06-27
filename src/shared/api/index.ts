import axios, { AxiosError } from "axios";
import { getCookie } from "cookies-next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL as string;
const apiKey = process.env.NEXT_PUBLIC_API_KEY as string;


export const api = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
    Api_Key: apiKey
  },
});

api.interceptors.request.use(
  async (config) => {
    const accessToken = getCookie('token');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(   
  (response) => { 
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 403) {
      error.response.data = {
        message: "You are not authorized to perform this action",
      };
    }

    if (error.response?.status === 502) {
      error.response.data = {
        message: "Could not complete the request. Please try again.",
      };
    }

    return Promise.reject(error);
  }
);
