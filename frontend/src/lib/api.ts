import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}api/v1`,
  withCredentials: true,
});

api.interceptors.response.use(
    res => res,
    async error => {
        if (error.response?.status === 401) {
            const hasRefreshToken = document.cookie.includes('refreshToken=');
            if (hasRefreshToken) {
                try {
                    await api.post("/auth/refresh");
                    return api(error.config);
                } catch (refreshError) {
                    return Promise.reject(refreshError instanceof Error ? refreshError : new Error(String(refreshError)));
                }
            }
        }
        return Promise.reject(error instanceof Error ? error : new Error(error?.message ?? String(error)));
    }
);

export default api;