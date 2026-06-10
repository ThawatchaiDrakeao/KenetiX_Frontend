// api/axios.js
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://kinetix-qnx5.onrender.com";

const API = axios.create({
  //baseURL: import.meta.env.VITE_API_URL || "https://kinetix-qnx5.onrender.com",
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add auth token to every request
API.interceptors.request.use(
  (config) => {
    // Get token from cookie (browser automatically sends it with withCredentials)
    // Also try to get from localStorage as backup
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (import.meta.env.DEV) {
      console.log(` ${config.method?.toUpperCase()} ${config.url}`, config.data);
    }

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle common errors
API.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log(`📥 ${response.status} ${response.config.url}`, response.data);
    }
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      console.warn("Authentication expired or invalid");
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");

      // Redirect to login if not already there
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.warn("Access forbidden - insufficient permissions");
      // Optionally show a notification
    }

    // Handle 500 Server Error
    if (error.response?.status === 500) {
      console.error("Server error:", error.response.data);
    }

    // Handle network errors
    if (error.code === "ECONNABORTED" || !error.response) {
      console.error("Network error - check your connection");
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
  localStorage.removeItem("user");
  delete API.defaults.headers.common["Authorization"];
};

export default API;
