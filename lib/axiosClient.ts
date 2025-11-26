import axios from "axios";

const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000
});

axiosClient.interceptors.response.use(
    response => {
        return response.data
    },
    (error) => {
        if (error.response?.status === 401) {
            // Ví dụ: Tự động logout khi token hết hạn
            console.error('Unauthorized! Redirecting to login...');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
)

// Thêm token vào header (nếu có)
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosClient;
