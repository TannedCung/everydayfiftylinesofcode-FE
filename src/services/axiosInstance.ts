// axiosInstance.ts
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Request interceptor
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
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const authTokens = localStorage.getItem('authTokens');
        if (!authTokens) {
          throw new Error('No refresh token available');
        }

        const { refresh } = JSON.parse(authTokens);
        
        // Request new access token
         const response = await axios.post(`${BASE_URL}/api/refresh-token/`, {
          refresh: refresh
        });

        const { access } = response.data;

        // Update stored tokens
        localStorage.setItem('authTokens', JSON.stringify({
          ...JSON.parse(authTokens),
          access
        }));

        // Retry original request with new token
        originalRequest.headers['Authorization'] = `Bearer ${access}`;
        return axiosInstance(originalRequest);

      } catch (refreshError) {
        // Clear tokens and redirect to login
        localStorage.removeItem('authTokens');
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;