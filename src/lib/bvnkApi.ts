import axios from "axios";

export const bvnkApi = axios.create({
  baseURL: process.env.BVNK_API_URL,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    Expires: "0",
  },
});

// Add request/response interceptors to log errors - here we can implement custom logging

bvnkApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);
