// api/axios.js
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://kinetix-qnx5.onrender.com";

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add auth token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// On 401 (expired/invalid token), clear session and send the user back to login
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("kinetix_user");
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Helper method to set auth token after login
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("authToken", token);
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    localStorage.removeItem("authToken");
    delete API.defaults.headers.common["Authorization"];
  }
};

// Helper method to clear auth on logout
export const clearAuth = () => {
  localStorage.removeItem("authToken");
  delete API.defaults.headers.common["Authorization"];
};

export default API;
