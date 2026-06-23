
import axios from "axios";
import Cookies from "js-cookie";
import { apiBaseUrl } from "@/utils/config";

const API_URL = apiBaseUrl;
const isProd = process.env.NODE_ENV === "production";

export const $api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});


let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

$api.interceptors.request.use((config) => {
  const token = Cookies.get("accessToken");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

$api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      
      if (isRefreshing) {
        
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return $api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      
      isRefreshing = true;

      try {
        const refreshToken = Cookies.get("refreshToken");
        if (!refreshToken) throw new Error("Нет рефреш токена в куках");
        
        const res = await axios.post(`${API_URL}/auth/refresh`, { 
          refreshToken: refreshToken.trim() 
        });
        
        const accessToken = res.data.accessToken || res.data.AccessToken;
        const newRefreshToken = res.data.refreshToken || res.data.RefreshToken;

        if (!accessToken || !newRefreshToken) {
          throw new Error("Пустые токены от сервера");
        }

        Cookies.set("accessToken", accessToken, { expires: 1, secure: isProd, sameSite: "strict", path: "/" });
        Cookies.set("refreshToken", newRefreshToken, { expires: 7, secure: isProd, sameSite: "strict", path: "/" });
        
        processQueue(null, accessToken);
        
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return $api(originalRequest);

      } catch (refreshError) {
        
        processQueue(refreshError, null);
        
        console.warn("[Axios] Рефреш полностью провалился на бэкенде. Сброс сессии.");
        Cookies.remove("accessToken", { path: "/" });
        Cookies.remove("refreshToken", { path: "/" });
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      } finally {
        isRefreshing = false; 
      }
    }
    return Promise.reject(error);
  }
);





