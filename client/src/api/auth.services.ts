import { api } from ".";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from "../types/auth";

export const authServices = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const res = await api.post("/api/auth/login", payload);
    return res.data;
  },
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const res = await api.post("/api/auth/register", payload);
    return res.data;
  },
  profile: async (): Promise<AuthResponse> => {
    const res = await api.get("/api/auth/getprofile");
    return res.data;
  },
  updateProfile: async (payload: {
    fullName: string;
  }): Promise<AuthResponse> => {
    const res = await api.put("/api/auth/profile", payload);
    return res.data;
  },
  changePassword: async (payload: {
    currentPassword: string;
    newPassword: string;
  }): Promise<AuthResponse> => {
    const res = await api.put("/api/auth/password", payload);
    return res.data;
  },
  logout: async (): Promise<AuthResponse> => {
    const res = await api.post("/api/auth/logout");
    return res.data;
  },
};
