import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { getCookie } from "cookies-next";

// Base URL and API key for the API, fetched from environment variables
const apiUrl = process.env.NEXT_PUBLIC_API_URL as string;
const apiKey = process.env.NEXT_PUBLIC_API_KEY as string;

/**
 * Axios instan configured for API requests.
 * 
 * This instance is set up with the base URL and headers required for
 * communicating with the API. It includes the API key in the headers.
 * 
 * @constant {axios.AxiosInstance} api - The configured Axios instance for API requests.
 */
export const api = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
    Api_Key: apiKey,
  },
});

/**
 * Request interceptor for the Axios instance.
 * 
 * This interceptor adds the Authorization header to each request if
 * an access token is available in the cookies.
 * 
 * @param {InternalAxiosRequestConfig} config - The Axios request configuration.
 * @returns {Promise<InternalAxiosRequestConfig>} The modified request configuration.
 * @throws {AxiosError} Throws an error if the request fails.
 */
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => { 
    const accessToken = getCookie('token');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for the Axios instance.
 * 
 * This interceptor processes responses and modifies the error message
 * for specific HTTP status codes.
 * 
 * @param {AxiosResponse} response - The Axios response.
 * @returns {AxiosResponse} The original response if successful.
 * @throws {AxiosError} Throws an error if the response indicates a failure.
 */
api.interceptors.response.use(
  (response: AxiosResponse) => {
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
