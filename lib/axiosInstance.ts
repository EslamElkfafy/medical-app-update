import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001/api/v1',
  withCredentials: true, // 👈 this sets it per-instance
});

export default axiosInstance;
