import api from "./api";
import type { AuthResponse, LoginCredentials, RegisterData, User } from "../types/auth";

export async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/register", data);
  return response.data;
}

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/login", credentials);
  return response.data;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

export async function getUser(): Promise<User> {
  const response = await api.get<{ user: User }>("/auth/user");
  return response.data.user;
}
