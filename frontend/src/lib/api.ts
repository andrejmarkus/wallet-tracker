import axios from "axios";

const apiUrl = `${import.meta.env.VITE_API_URL}api/v1`;
console.log('[DEBUG] API Base URL:', apiUrl);

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

const refreshApi = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

api.interceptors.response.use(
    res => res,
    async error => {
        if (error.response?.status === 401) {
            try {
                await refreshApi.post("/auth/refresh");
                return api(error.config);
            } catch (refreshError: any) {
                if (refreshError.response?.status === 401) {
                    return Promise.reject(new Error("Session expired. Please log in again."));
                }
                return Promise.reject(refreshError instanceof Error ? refreshError : new Error(String(refreshError)));
            }
        }
        return Promise.reject(error instanceof Error ? error : new Error(error?.message ?? String(error)));
    }
);

export default api;