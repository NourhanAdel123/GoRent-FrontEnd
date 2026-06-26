export interface User {
  _id: string;
  name: string;
  email: string;
  role: "tenant" | "owner" | "admin" | "superadmin";
  profileImage?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
}

export interface LoginCredentials {
  email: string;
  password?: string;
  role?: "tenant" | "owner";
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role?: "tenant" | "owner";
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
