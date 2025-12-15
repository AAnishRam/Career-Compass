import api from "../lib/api";
import { AuthResponse, User } from "../types";
import { setToken, setUser } from "../lib/auth";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/api/auth/login", data);

  setToken(response.data.token);
  setUser(response.data.user);

  return response.data;
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/api/auth/register", data);

  setToken(response.data.token);
  setUser(response.data.user);

  return response.data;
}
