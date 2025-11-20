import axios from 'axios';
import { ACCESS_TOKEN } from './constants';

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/', // Django backend URL
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response, // Pass through successful responses
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized errors
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');
            try {
                // Send a request to refresh the token
                const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
                    refresh: refreshToken,
                });
                const { access } = response.data;
                localStorage.setItem(ACCESS_TOKEN, access); // Save the new access token

                // Retry the original request with the new access token
                originalRequest.headers['Authorization'] = `Bearer ${access}`;
                return axiosInstance(originalRequest); // Retry the original request with the new token
            } catch (error) {
                localStorage.removeItem(ACCESS_TOKEN); // Remove the access token on failure
                localStorage.removeItem('refreshToken'); // Remove the refresh token if any
                window.location.href = '/sign-in'; // Redirect to login
                return Promise.reject(error);
            }
        }

        return Promise.reject(error); // Reject other errors
    }
);

export default axiosInstance;
