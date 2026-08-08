import api from "./axiosConfig";
import type { User, AuthResponse } from "../types";

// Cada función representa una llamada a una ruta de tu backend

export const registerUser = async (data: {
  email: string;
  password: string;
  role: "company" | "candidate";
}): Promise<User> => {
  const response = await api.post<User>("/auth/register", data);
  return response.data;
};

export const loginUser = async (data: {
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", data);
  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>("/auth/me");
  return response.data;
};
