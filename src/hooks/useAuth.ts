"use client";

import { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { User, LoginCredentials, RegisterCredentials } from "../types/user";
import { authService } from "../services/auth";
import { setUser, clearUser, setLoading, setError } from "../store/slices/authSlice";

export function useAuth() {
  const dispatch = useDispatch();
  const [user, setUserState] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoadingState] = useState(true);
  const [error, setErrorState] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      const data = await authService.getCurrentUser();
      if (data.user) {
        setUserState(data.user);
        setIsAuthenticated(true);
        dispatch(setUser(data.user));
      } else {
        setUserState(null);
        setIsAuthenticated(false);
        dispatch(clearUser());
      }
    } catch {
      setUserState(null);
      setIsAuthenticated(false);
      dispatch(clearUser());
    }
  }, [dispatch]);

  useEffect(() => {
    const init = async () => {
      setIsLoadingState(true);
      await fetchUser();
      setIsLoadingState(false);
    };
    init();
  }, [fetchUser]);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoadingState(true);
      setErrorState(null);
      dispatch(setLoading(true));

      const data = await authService.login(credentials);

      if (data.user) {
        setUserState(data.user);
        setIsAuthenticated(true);
        dispatch(setUser(data.user));

        const defaultPath =
          data.user.role === "tenant"
            ? "/"
            : data.user.role === "owner"
              ? "/dashboard/owner"
              : data.user.role === "admin"
                ? "/dashboard/admin"
                : data.user.role === "superadmin"
                  ? "/dashboard/admin"
                  : "/";
        window.location.href = defaultPath;
      }

      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "فشل تسجيل الدخول";
      setErrorState(message);
      dispatch(setError(message));
      throw err;
    } finally {
      setIsLoadingState(false);
      dispatch(setLoading(false));
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      setIsLoadingState(true);
      setErrorState(null);
      dispatch(setLoading(true));

      const data = await authService.register(credentials);

      if (data.user) {
        setUserState(data.user);
        setIsAuthenticated(true);
        dispatch(setUser(data.user));

        const defaultPath =
          data.user.role === "owner" ? "/dashboard/owner" : "/Profile";
        window.location.href = defaultPath;
      }

      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "فشل إنشاء الحساب";
      setErrorState(message);
      dispatch(setError(message));
      throw err;
    } finally {
      setIsLoadingState(false);
      dispatch(setLoading(false));
    }
  };

  const logout = async () => {
    try {
      setIsLoadingState(true);
      await authService.logout();
      setUserState(null);
      setIsAuthenticated(false);
      dispatch(clearUser());
      window.location.href = "/auth/login";
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "فشل تسجيل الخروج";
      setErrorState(message);
      dispatch(setError(message));
    } finally {
      setIsLoadingState(false);
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