import axios from 'axios'
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTHENTICATION_URL,
  withCredentials: true, // 👈 this sets it per-instance
});

export default axiosInstance;
