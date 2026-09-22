import axios from "axios";

export const API_URL = "/api";
export const FALLBACK_BACKEND_URL =
  "https://ai-resume-analyzer-eta-umber.vercel.app";
export const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  FALLBACK_BACKEND_URL;

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});



// --- REQUEST INTERCEPTOR START ---
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token =
        localStorage.getItem("token") || localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);
// --- REQUEST INTERCEPTOR END ---

// --- RESPONSE INTERCEPTOR START ---
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check karein ke ye request logout to nahi hai?
    const isLogoutRequest = originalRequest.url?.includes("/logout");

    if (error.response?.status === 401 && !originalRequest._retry && !isLogoutRequest) {
      originalRequest._retry = true;
      try {
        const refreshToken =
          typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;

        const res = await axios.post(
          `${API_URL}/user/refreshAccessToken`,
          { refreshToken },
          { withCredentials: true }
        );

        const newAccessToken = res.data?.data?.accessToken;
        const newRefreshToken = res.data?.data?.refreshToken;

        if (newAccessToken && typeof window !== "undefined") {
          localStorage.setItem("token", newAccessToken);
          localStorage.setItem("accessToken", newAccessToken);
          document.cookie = `token=${newAccessToken}; path=/; max-age=604800; SameSite=Lax`;
          document.cookie = `accessToken=${newAccessToken}; path=/; max-age=604800; SameSite=Lax`;
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        if (newRefreshToken && typeof window !== "undefined") {
          localStorage.setItem("refreshToken", newRefreshToken);
          document.cookie = `refreshToken=${newRefreshToken}; path=/; max-age=2592000; SameSite=Lax`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
          document.cookie = "accessToken=; path=/; max-age=0; SameSite=Lax";
          document.cookie = "refreshToken=; path=/; max-age=0; SameSite=Lax";
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    // Agar logout request 401 de rahi hai, to usay refresh karne ki bajaye 
    // seedha resolve kar dein ya login par bhej dein
    if (error.response?.status === 401 && isLogoutRequest) {
       if (typeof window !== "undefined") {
         localStorage.removeItem("token");
         localStorage.removeItem("accessToken");
         localStorage.removeItem("refreshToken");
         document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
         document.cookie = "accessToken=; path=/; max-age=0; SameSite=Lax";
         document.cookie = "refreshToken=; path=/; max-age=0; SameSite=Lax";
         window.location.href = "/login";
       }
       return Promise.resolve(); 
    }

    return Promise.reject(error);
  }
);
// --- RESPONSE INTERCEPTOR END ---