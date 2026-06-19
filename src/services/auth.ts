import {
  User,
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
} from "../types/user";

const API_URL = "";

// Helper function for API calls
export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
    },
    // This is crucial for sending and receiving HTTP-only cookies
    credentials: "include",
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "An error occurred during the request");
  }

  return data as T;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return fetchApi<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    return fetchApi<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  logout: async (): Promise<{ message: string }> => {
    return fetchApi<{ message: string }>("/api/auth/logout", {
      method: "POST",
    });
  },

  getCurrentUser: async (): Promise<{ user: User }> => {
    return fetchApi<{ user: User }>("/api/auth/me", {
      method: "GET",
    });
  },
};
