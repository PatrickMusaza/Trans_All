import axios from 'axios';
import { ACCESS_TOKEN } from './constants';

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/', // Django backend URL
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
})

axiosInstance.interceptors.request.use(
    (config)=>{
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization=`Bearer ${token}`
        }
        return config
    },
    (error)=>{
        return Promise.reject(error)
    }
)

axiosInstance.interceptors.response.use(
    (response) => response, // Pass through successful responses
    async (error) => {
      const originalRequest = error.config;
  
      // Handle 401 Unauthorized errors
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        // Optionally: Add a token refresh mechanism here
        // const refreshToken = localStorage.getItem('refreshToken');
        // const response = await axios.post('/auth/refresh/', { refresh: refreshToken });
        // localStorage.setItem(ACCESS_TOKEN, response.data.access);
  
        // For now, clear the token and redirect to login
        localStorage.removeItem(ACCESS_TOKEN);
        window.location.href = "/sign-in"; // Redirect to login page
        return Promise.reject(error);
      }
  
      return Promise.reject(error); // Reject other errors
    }
  );
  

export default axiosInstance;
