import apiClient from "./client";
import { AuthResponse, RegisterPayload, LoginPayload } from "../types/auth";

export const registerUser = async (
  data: RegisterPayload,
): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>("/api/register", data);
  return response.data;
};

export const loginUser = async (data: LoginPayload): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>("/api/login", data);
  return response.data;
};
