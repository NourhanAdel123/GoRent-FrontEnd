import { AuthResponse, RegisterPayload, LoginPayload } from '../types/user';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const registerUser = async (userData: RegisterPayload): Promise<AuthResponse> => {
  const response = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'فشل التسجيل. يرجى التأكد من البيانات.');
  }

  return data;
};

export const loginUser = async (credentials: LoginPayload): Promise<AuthResponse> => {
  const response = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'فشل تسجيل الدخول. يرجى التأكد من البيانات.');
  }

  return data;
};

/**
 * Helper to get the token from cookies (for use in API calls).
 * Returns null if no token is found.
 */
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
};

/**
 * Helper to create an Authorization header with the stored token.
 * Use this in fetch calls to protected API endpoints.
 *
 * Example:
 *   fetch('/api/some-protected-route', {
 *     headers: { ...authHeader() },
 *   });
 */
export const authHeader = (): Record<string, string> => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
