import axios, { type AxiosInstance } from "axios";

const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.DEV ? "http://localhost:5000" : "");

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  timeout: 15000,
});

let isRefreshing = false;
let refreshWaiters: Array<(value: void) => void> = [];

async function refreshAccessToken(): Promise<void> {
  const refreshUrl = "/api/auth/refresh";
  await axios.post(
    refreshUrl,
    {},
    {
      baseURL: api.defaults.baseURL,
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
      timeout: 15000,
    },
  );
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error?.response?.status;
    const originalRequest = error?.config;

    if (!originalRequest) return Promise.reject(error);

    const isAuthRefreshCall =
      typeof originalRequest?.url === "string" &&
      originalRequest.url.includes("/api/auth/refresh");

    if (status === 401 && !isAuthRefreshCall && !originalRequest.__isRetry) {
      originalRequest.__isRetry = true;

      if (isRefreshing) {
        await new Promise<void>((resolve) => refreshWaiters.push(resolve));
        return api(originalRequest);
      }

      isRefreshing = true;
      try {
        await refreshAccessToken();
        refreshWaiters.forEach((w) => w());
        refreshWaiters = [];
        return api(originalRequest);
      } catch (refreshError) {
        refreshWaiters.forEach((w) => w());
        refreshWaiters = [];
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export const apiBaseUrl = API_BASE_URL;
