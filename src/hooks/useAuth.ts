"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { User, LoginCredentials, RegisterCredentials } from "../types/user";
import { authService } from "../services/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const fetchUser = useCallback(async () => {
    try {
      const data = await authService.getCurrentUser();

      if (data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await fetchUser();
      setIsLoading(false);
    };

    init();
  }, [fetchUser]);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await authService.login(credentials);

      if (data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
        const defaultPath =
          data.user.role === "tenant"
            ? "/"
            : data.user.role === "owner"
              ? "/dashboard/owner"
              : data.user.role === "admin"
                ? "/dashboard/admin"
                : data.user.role === "superadmin"
                  ? "/dashboard/superadmin"
                  : "";
        window.location.href = defaultPath;
      }

      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "فشل تسجيل الدخول";

      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await authService.register(credentials);

      if (data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
        const defaultPath =
          data.user.role === "owner" ? "/dashboard/owner" : "/Profile";
        window.location.href = defaultPath;
      }

      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "فشل إنشاء الحساب";

      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);

      await authService.logout();

      setUser(null);
      setIsAuthenticated(false);

      window.location.href = "/auth/login";
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "فشل تسجيل الخروج";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    checkAuth: fetchUser,
  };
}
