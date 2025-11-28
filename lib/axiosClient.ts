import axios from 'axios';

// Helper to get base URL for both client and server
function getBaseURL() {
  // Client-side: use relative URL
  if (typeof window !== 'undefined') {
    return '/api';
  }

  // Server-side: use absolute URL
  // Check if we have NEXTAUTH_URL or similar
  if (process.env.NEXTAUTH_URL) {
    return `${process.env.NEXTAUTH_URL}/api`;
  }

  // Fallback to localhost
  const port = process.env.PORT || 3000;
  return `http://localhost:${port}/api`;
}

const axiosClient = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Auto-attach token to every request (client-side only)
axiosClient.interceptors.request.use(
  (config) => {
    // Only attach token on client-side
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle 401 errors globally (client-side only)
axiosClient.interceptors.response.use(
  (response) => {
    // Extract data from response
    return response.data;
  },
  (error) => {
    // Handle 401 Unauthorized - clear tokens and redirect to login (client-side only)
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/account/login')) {
        window.location.href = '/account/login';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
