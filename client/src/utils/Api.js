import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

let axiosInstance = axios.create({
  baseURL: BASE_URL
});

export default axiosInstance;
