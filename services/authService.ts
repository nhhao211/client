import apiClient from "@/lib/axios";

/**
 * Auth Service - API calls for authentication
 */

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: number;
      firebaseUid: string;
      email: string;
      name: string;
      picture: string | null;
    };
  };
}

export interface UserProfile {
  id: number;
  firebaseUid: string;
  email: string;
  name: string;
  picture: string | null;
  createdAt: string;
}

/**
 * Login with Firebase token
 */
export async function login(token: string): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>(
    "/v1/auth/login",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

/**
 * Admin Login
 */
export async function adminLogin(username: string, password: string): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>(
    "/v1/auth/admin-login",
    { username, password }
  );
  return response.data;
}

/**
 * Get current user profile
 */
export async function getProfile(): Promise<UserProfile> {
  const response = await apiClient.get<{ success: boolean; data: { user: UserProfile } }>(
    "/v1/auth/profile"
  );
  return response.data.data.user;
}

/**
 * Logout (client-side only)
 */
export function logout(): void {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
}

/**
 * Set auth token
 */
export function setAuthToken(token: string): void {
  localStorage.setItem("authToken", token);
}

/**
 * Get auth token
 */
export function getAuthToken(): string | null {
  return localStorage.getItem("authToken");
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getAuthToken();
}
