import api from "../lib/api";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface UpdateProfileData {
  name: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface DeleteAccountData {
  password: string;
}

/**
 * Get current user's profile
 */
export async function getUserProfile(): Promise<UserProfile> {
  const response = await api.get<UserProfile>("/api/user/profile");
  return response.data;
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  data: UpdateProfileData
): Promise<UserProfile> {
  const response = await api.patch<UserProfile>("/api/user/profile", data);
  return response.data;
}

/**
 * Change user password
 */
export async function changePassword(
  data: ChangePasswordData
): Promise<{ message: string }> {
  const response = await api.post<{ message: string }>(
    "/api/user/change-password",
    data
  );
  return response.data;
}

/**
 * Export all user data
 */
export async function exportUserData(): Promise<Blob> {
  const response = await api.get("/api/user/export-data", {
    responseType: "blob",
  });
  return response.data;
}

/**
 * Delete user account
 */
export async function deleteUserAccount(
  data: DeleteAccountData
): Promise<{ message: string }> {
  const response = await api.delete<{ message: string }>("/api/user/account", {
    data,
  });
  return response.data;
}
