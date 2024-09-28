import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://fakestoreapi.com',
  headers: {
    'Content-Type': 'application/json',
    'APP-KEY': 'base64:nyKmmgUk6i+HFCPTtLdT/GsbMCT+kdp4lNxPo7bk4ZU=',
  },
});

export default axiosInstance;
