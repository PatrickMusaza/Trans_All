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

export default axiosInstance;
