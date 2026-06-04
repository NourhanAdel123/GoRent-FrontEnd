export interface User {
  id: string;
  name: string;
  email: string;
  role: "tenant" | "owner" | string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password?: string;
  role: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user: User;
  token?: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
}
