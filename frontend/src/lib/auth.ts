// Token storage keys
const TOKEN_KEY = "career_compass_token";
const USER_KEY = "career_compass_user";

export interface User {
  id: string;
  email: string;
  name: string;
}

/**
 * Store authentication token in localStorage
 */
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Get authentication token from localStorage
 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Remove authentication token from localStorage
 */
export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Store user data in localStorage
 */
export function setUser(user: User): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/**
 * Get user data from localStorage
 */
export function getUser(): User | null {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

/**
 * Remove user data from localStorage
 */
export function removeUser(): void {
  localStorage.removeItem(USER_KEY);
}

/**
 * Clear all auth data
 */
export function clearAuth(): void {
  removeToken();
  removeUser();
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getToken();
}
