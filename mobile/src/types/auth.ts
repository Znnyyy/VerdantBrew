export interface User {
  id: number;
  full_name: string;
  email: string;
  phone: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterPayload {
  full_name: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}
