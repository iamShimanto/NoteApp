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
};
