import { fetchApi } from "./auth";

export const passwordResetService = {
  forgotPassword: async (email: string): Promise<{ message: string }> => {
    return fetchApi<{ message: string }>("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  verifyOTP: async (email: string, otp: string): Promise<{ message: string }> => {
    return fetchApi<{ message: string }>("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    });
  },

  resetPassword: async (email: string, otp: string, newPassword: string): Promise<{ message: string }> => {
    return fetchApi<{ message: string }>("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email, otp, newPassword }),
    });
  },
};
