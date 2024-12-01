import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Request interceptor: Add Bearer token to Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const authTokens = localStorage.getItem('authTokens');
    if (authTokens) {
      const { access } = JSON.parse(authTokens);
      if (access) {
        config.headers['Authorization'] = `Bearer ${access}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => response, // Return response as-is for successful requests
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear any stored tokens
      localStorage.removeItem('authTokens');

      // Redirect to login page
      const navigate = useNavigate();
      navigate('/login'); // Adjust the path as per your app's routing
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
