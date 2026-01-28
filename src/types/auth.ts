export interface User {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
  token_type: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}
