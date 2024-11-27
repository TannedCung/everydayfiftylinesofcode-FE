import axios from 'axios';

// Create an axios instance with the base URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Set up an Axios request interceptor to include the Bearer token in the headers
axiosInstance.interceptors.request.use(
    (config) => {
      // Get the auth token from localStorage (or sessionStorage)
      const authTokens = localStorage.getItem('authTokens');
      if (authTokens) {
        const { access } = JSON.parse(authTokens);
        // Add Bearer token to Authorization header
        if (access) {
          config.headers['Authorization'] = `Bearer ${access}`;
        }
      }
      return config;
    },
    (error) => {
      // Handle any errors in the request
      return Promise.reject(error);
    }
  );

export default axiosInstance;