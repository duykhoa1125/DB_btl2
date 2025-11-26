import axios from "axios";

// Determine the base URL dynamically
// - On client-side: Use relative URL "/api" which works on any domain
// - On server-side: Use NEXT_PUBLIC_API_URL if set, otherwise fall back to relative URL
const getBaseURL = () => {
  // Client-side: Always use relative URL
  if (typeof window !== "undefined") {
    return "/api";
  }
  // Server-side: Use environment variable or relative URL
  return process.env.NEXT_PUBLIC_API_URL || "/api";
};

const axiosClient = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect on client-side
      if (typeof window !== "undefined") {
        console.error("Unauthorized! Redirecting to login...");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Request interceptor to add authorization token
axiosClient.interceptors.request.use(
  (config) => {
    // Only access localStorage on client-side
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;
