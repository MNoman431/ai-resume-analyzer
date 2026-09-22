// import axios from "axios";
import {
  RegisterRequest,
  LoginRequest,
  VerifyOtpRequest,
  AuthResponse,
  ResetPasswordRequest,
  ForgotPasswordRequest,
  // logoutUser,
  changecurrentpassword
} from "@/types/authTypes";
import { api, BACKEND_URL } from "./api";

// const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// const api = axios.create({
//   baseURL: API_URL,
//   withCredentials: true,
// });





export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post("/user/login", data, { withCredentials: true });
  const token = response.data?.data?.accessToken;
  const refreshToken = response.data?.data?.refreshToken;

  if (typeof window !== "undefined") {
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("accessToken", token);
      document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax`;
      document.cookie = `accessToken=${token}; path=/; max-age=604800; SameSite=Lax`;
    }
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
      document.cookie = `refreshToken=${refreshToken}; path=/; max-age=2592000; SameSite=Lax`;
    }
    window.dispatchEvent(new Event("auth-token-synced"));
  }

  return response.data;
};

export const logout = async (): Promise<AuthResponse> => {
  try {
    const response = await api.post("/user/logout", {}, { withCredentials: true });
    return response.data;
  } finally {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
      document.cookie = "accessToken=; path=/; max-age=0; SameSite=Lax";
      document.cookie = "refreshToken=; path=/; max-age=0; SameSite=Lax";
      window.dispatchEvent(new Event("auth-token-synced"));
    }
  }
};
export const forgotPassword = async (
  data: ForgotPasswordRequest
): Promise<AuthResponse> => {
  const response = await api.post("/user/forgotPassword", data ,{ withCredentials: true });
  return response.data;
};

export const resetPassword = async (
  token: string,
  data: ResetPasswordRequest
): Promise<AuthResponse> => {
  const response = await api.post(`/user/resetPassword/${token}`, data,{ withCredentials: true });
  return response.data;
};

export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await api.post("/user/register", data,{ withCredentials: true });
  return response.data;
};
export const changeCurrentPassword = async (data: changecurrentpassword): Promise<AuthResponse> => {
  const response = await api.post("/user/changeCurrentPassword", data,{ withCredentials: true });
  return response.data;
};

export const verifyOtp = async (data: VerifyOtpRequest): Promise<AuthResponse> => {
  const response = await api.post("/user/verifyEmail", data,{ withCredentials: true });
  return response.data;
};

export const loginWithGoogle = () => {
  // Pass current origin so backend redirects back to the matching frontend (e.g. localhost:3000)
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const queryParam = origin ? `?origin=${encodeURIComponent(origin)}` : "";
  window.location.href = `${BACKEND_URL}/api/user/google${queryParam}`;
};

