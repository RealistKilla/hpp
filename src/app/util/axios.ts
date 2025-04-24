import axios from "axios";

console.log("env stuff", process.env.API_URL);
const api = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request/response interceptors to log errors - here we can implement custom logging
api.interceptors.request.use((error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
