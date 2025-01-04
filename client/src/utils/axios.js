// src/utils/axios.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, // .env 파일에 설정된 URL 사용
  headers: {
    "Content-Type": "application/json",
  },
});

// Authorization 헤더 추가를 위한 Axios Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
