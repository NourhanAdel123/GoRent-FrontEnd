'use client';

import React, {
  createContext,
  useState,
  ReactNode,
} from 'react';

import { AuthContextType, User } from '../types/user';

// Helper: read token from cookie
const getTokenFromCookie = (): string | null => {
  if (typeof window === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
};

// Helper: read user from cookie
const getUserFromCookie = (): User | null => {
  if (typeof window === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)user=([^;]*)/);
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match[1]));
  } catch {
    return null;
  }
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(getTokenFromCookie);
  const [user, setUser] = useState<User | null>(getUserFromCookie);

  const isAuthenticated = !!token;

  // LOGIN — stores the JWT token in a cookie
  const login = (newToken: string, userData: User) => {
    // Store token cookie (7 days expiry)
    const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds
    document.cookie = `token=${encodeURIComponent(newToken)}; path=/; max-age=${maxAge}; SameSite=Lax`;
    document.cookie = `user=${encodeURIComponent(JSON.stringify(userData))}; path=/; max-age=${maxAge}; SameSite=Lax`;

    setToken(newToken);
    setUser(userData);
  };

  // LOGOUT — clears the token cookie
  const logout = () => {
    document.cookie =
      'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie =
      'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

    setToken(null);
    setUser(null);

    window.location.href = '/auth/login';
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}