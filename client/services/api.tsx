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



// --- INTERCEPTOR START ---
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check karein ke ye request logout to nahi hai?
    const isLogoutRequest = originalRequest.url?.includes("/logout");

    if (error.response?.status === 401 && !originalRequest._retry && !isLogoutRequest) {
      originalRequest._retry = true;
      try {
        await axios.post(`${API_URL}/user/refreshAccessToken`, {}, { withCredentials: true });
        return api(originalRequest);
      } catch (refreshError) {
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // Agar logout request 401 de rahi hai, to usay refresh karne ki bajaye 
    // seedha resolve kar dein ya login par bhej dein
    if (error.response?.status === 401 && isLogoutRequest) {
       window.location.href = "/login";
       return Promise.resolve(); 
    }

    return Promise.reject(error);
  }
);
// --- INTERCEPTOR END ---